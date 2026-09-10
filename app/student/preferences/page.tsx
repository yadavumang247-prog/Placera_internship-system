'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ListOrdered,
  ArrowUp,
  ArrowDown,
  Trash2,
  Save,
  Lock,
  Unlock,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  GripVertical,
  Briefcase,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../components/ui/toast';
import { PreferenceData, InternshipData, StudentData } from '../../../lib/types';
import { checkEligibility } from '../../../lib/algorithm/eligibilityEngine';
import { calculateMeritScore } from '../../../lib/algorithm/meritCalculator';

export default function StudentPreferencesPage() {
  const { success, error: showError } = useToast();
  const [preferences, setPreferences] = useState<PreferenceData[]>([]);
  const [allInternships, setAllInternships] = useState<InternshipData[]>([]);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const [prefRes, internRes, profRes] = await Promise.all([
        fetch('/api/student/preferences').then((r) => r.json()),
        fetch('/api/admin/internships').then((r) => r.json()),
        fetch('/api/student/profile').then((r) => r.json()),
      ]);

      if (prefRes.preferences) {
        setPreferences(prefRes.preferences);
      }
      if (internRes.internships) {
        setAllInternships(internRes.internships);
      }
      if (profRes.student) {
        setStudent(profRes.student);
        setIsLocked(!!profRes.student.preferencesLocked);
      }
    } catch (err) {
      showError('Failed to load preferences');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    if (isLocked) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (isLocked || draggedIndex === null || draggedIndex === index) return;

    const updated = [...preferences];
    const item = updated.splice(draggedIndex, 1)[0];
    updated.splice(index, 0, item);
    updated.forEach((p, idx) => (p.rank = idx + 1));

    setDraggedIndex(index);
    setPreferences(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Reorder buttons for accessibility
  const moveUp = (index: number) => {
    if (isLocked || index <= 0) return;
    const next = [...preferences];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    next.forEach((p, idx) => (p.rank = idx + 1));
    setPreferences(next);
  };

  const moveDown = (index: number) => {
    if (isLocked || index >= preferences.length - 1) return;
    const next = [...preferences];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    next.forEach((p, idx) => (p.rank = idx + 1));
    setPreferences(next);
  };

  const removePreference = (index: number) => {
    if (isLocked) return;
    const next = preferences.filter((_, idx) => idx !== index);
    next.forEach((p, idx) => (p.rank = idx + 1));
    setPreferences(next);
  };

  // Add an unranked internship
  const handleAddInternship = (internshipId: string) => {
    if (isLocked) return;
    if (preferences.some((p) => p.internshipId === internshipId)) {
      showError('This role is already in your preference ranking list.');
      return;
    }
    const intern = allInternships.find((i) => i.id === internshipId);
    const newPref: PreferenceData = {
      id: `pref_${Date.now()}`,
      studentId: student?.id || 'stud_1',
      internshipId,
      rank: preferences.length + 1,
      internship: intern,
    };
    setPreferences([...preferences, newPref]);
  };

  // Save Preferences
  const handleSavePreferences = async () => {
    if (isLocked) return;
    setIsSaving(true);
    try {
      const internshipIds = preferences.map((p) => p.internshipId);
      const res = await fetch('/api/student/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      success('Preferences saved successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  // Lock Preferences
  const handleLockPreferences = async () => {
    if (preferences.length === 0) {
      showError('Please add at least 1 preference before locking.');
      return;
    }
    const confirm = window.confirm(
      'Are you sure you want to lock your preferences? Once locked, you will not be able to modify rankings or add new tracks.'
    );
    if (!confirm) return;

    try {
      // First ensure current order is saved
      const internshipIds = preferences.map((p) => p.internshipId);
      await fetch('/api/student/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipIds }),
      });

      // Call lock endpoint
      const lockRes = await fetch('/api/student/preferences/lock', { method: 'POST' });
      const lockData = await lockRes.json();
      if (!lockRes.ok) throw new Error(lockData.error);

      setIsLocked(true);
      success('Preferences Locked. Your submissions are locked for algorithmic allocation.');
    } catch (err: any) {
      showError(err.message || 'Failed to lock preferences');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0284C7]" />
      </div>
    );
  }

  // Unselected internships available to add
  const unselectedInternships = allInternships.filter(
    (i) => !preferences.some((p) => p.internshipId === i.id)
  );

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded">
                Gale-Shapley Matching Input
              </span>
              {isLocked ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#065F46] bg-[#ECFDF5] px-2.5 py-0.5 rounded border border-[#A7F3D0]">
                  <Lock className="h-3 w-3" /> Preferences Locked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D97706] bg-[#FFFBEB] px-2.5 py-0.5 rounded border border-[#FDE68A]">
                  <Unlock className="h-3 w-3" /> Preferences Open
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Rank Internship Preferences
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Drag and drop or use arrow controls to prioritize opportunities. The Gale-Shapley algorithm will propose to your #1 choice first, continuing down your list only if capacity is full.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isLocked ? (
              <>
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  variant="outline"
                  size="sm"
                  className="border-[#CBD5E1] bg-white text-[#0F172A] shadow-sm"
                >
                  <Save className="h-4 w-4 mr-1.5 text-[#0284C7]" />
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  onClick={handleLockPreferences}
                  size="sm"
                  className="bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sm"
                >
                  <Lock className="h-4 w-4 mr-1.5" />
                  Lock Preferences
                </Button>
              </>
            ) : (
              <Badge className="bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] px-3 py-1 text-xs font-bold">
                ✓ Locked for Allocation
              </Badge>
            )}
          </div>
        </div>

        {isLocked && (
          <div className="bg-[#EFF6FF] border border-[#BAE6FD] p-3 rounded-xl text-xs text-[#0369A1] flex items-center gap-2">
            <Lock className="h-4 w-4 shrink-0" />
            <span>
              Your preferences have been finalized and locked. The placement cell is evaluating matching rounds.
            </span>
          </div>
        )}
      </div>

      {/* Main Ranking List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">
          <span>Priority Ranking ({preferences.length} Selected)</span>
          <span>Matching Metadata</span>
        </div>

        {preferences.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <ListOrdered className="h-10 w-10 text-[#94A3B8] mx-auto" />
            <h3 className="font-bold text-base text-[#0F172A]">No Preferences Selected Yet</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Select roles from the directory below to build your priority schedule for Gale-Shapley matching.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {preferences.map((pref, index) => {
              const intern = allInternships.find((i) => i.id === pref.internshipId) || pref.internship;
              const elig = student && intern ? checkEligibility(student, intern) : null;
              const merit = student && intern ? calculateMeritScore(student, intern) : null;

              return (
                <div
                  key={pref.id || pref.internshipId}
                  draggable={!isLocked}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                    draggedIndex === index
                      ? 'border-[#0284C7] bg-[#EFF6FF] shadow-md'
                      : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#BAE6FD]'
                  }`}
                >
                  {/* Left: Grip, Rank, Role info */}
                  <div className="flex items-center gap-3">
                    {!isLocked && (
                      <div className="cursor-grab active:cursor-grabbing text-[#94A3B8] hover:text-[#0284C7] p-1">
                        <GripVertical className="h-5 w-5" />
                      </div>
                    )}

                    <div className="h-8 w-8 rounded-lg bg-[#0284C7] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm">
                      {pref.rank}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0284C7] uppercase">
                          {intern?.companyName}
                        </span>
                        <Badge variant="outline" className="text-[10px] border-[#CBD5E1] font-medium">
                          {intern?.mode}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-sm text-[#0F172A]">
                        {intern?.title}
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        {intern?.location.split(',')[0]} • ₹{intern?.stipend.toLocaleString()}/mo • {intern?.duration}
                      </p>
                    </div>
                  </div>

                  {/* Right: Match Score, Eligibility, Reorder controls */}
                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    {/* Merit & Eligibility */}
                    <div className="text-right text-xs">
                      {merit && (
                        <div className="font-bold text-[#0284C7]">
                          Merit: {merit.totalMeritScore.toFixed(1)}/100
                        </div>
                      )}
                      {elig?.isEligible ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#065F46] font-semibold">
                          <CheckCircle2 className="h-3 w-3 text-[#10B981]" /> Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#991B1B] font-semibold">
                          <XCircle className="h-3 w-3 text-[#EF4444]" /> Ineligible
                        </span>
                      )}
                    </div>

                    {/* Controls */}
                    {!isLocked && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0284C7] disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Rank Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === preferences.length - 1}
                          className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0284C7] disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Rank Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removePreference(index)}
                          className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-red-500 hover:bg-red-50"
                          title="Remove from Rankings"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Track Picker (Add More Roles) */}
      {!isLocked && unselectedInternships.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm">Add Additional Opportunities</h3>
              <p className="text-xs text-[#64748B]">Click any approved role to append to your ranking list.</p>
            </div>
            <Link href="/internships">
              <Button size="sm" variant="outline" className="text-xs border-[#CBD5E1]">
                Directory View
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unselectedInternships.map((intern) => {
              const elig = student ? checkEligibility(student, intern) : null;

              return (
                <div
                  key={intern.id}
                  className="p-3.5 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] hover:bg-white hover:border-[#BAE6FD] transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 truncate">
                    <span className="text-[10px] font-bold text-[#0284C7] uppercase block truncate">
                      {intern.companyName}
                    </span>
                    <h4 className="font-bold text-xs text-[#0F172A] truncate">
                      {intern.title}
                    </h4>
                    <span className="text-[11px] text-[#64748B] block">
                      Min CGPA: {intern.minimumCGPA.toFixed(1)} • ₹{intern.stipend.toLocaleString()}/mo
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddInternship(intern.id)}
                    className="text-xs border-[#0284C7] text-[#0284C7] bg-white shrink-0 hover:bg-[#EFF6FF]"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
