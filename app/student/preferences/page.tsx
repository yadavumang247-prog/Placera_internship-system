'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ListOrdered,
  ArrowUp,
  ArrowDown,
  Trash2,
  Save,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../components/ui/toast';
import { PreferenceData, InternshipData } from '../../../lib/types';

export default function StudentPreferencesPage() {
  const { success, error: showError } = useToast();
  const [preferences, setPreferences] = useState<PreferenceData[]>([]);
  const [allInternships, setAllInternships] = useState<InternshipData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [prefRes, internRes] = await Promise.all([
        fetch('/api/student/preferences').then((r) => r.json()),
        fetch('/api/admin/internships').then((r) => r.json()),
      ]);

      if (prefRes.preferences) {
        setPreferences(prefRes.preferences);
      }
      if (internRes.internships) {
        setAllInternships(internRes.internships);
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

  // Move Up
  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...preferences];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    // Re-index ranks
    next.forEach((p, idx) => (p.rank = idx + 1));
    setPreferences(next);
  };

  // Move Down
  const moveDown = (index: number) => {
    if (index >= preferences.length - 1) return;
    const next = [...preferences];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    // Re-index ranks
    next.forEach((p, idx) => (p.rank = idx + 1));
    setPreferences(next);
  };

  // Remove Preference
  const removePreference = (index: number) => {
    const next = preferences.filter((_, idx) => idx !== index);
    next.forEach((p, idx) => (p.rank = idx + 1));
    setPreferences(next);
  };

  // Save Preferences
  const handleSavePreferences = async () => {
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

      success('Preferences updated and persisted successfully!');
      loadData();
    } catch (err: any) {
      showError(err.message || 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ListOrdered className="h-6 w-6 text-indigo-600" />
            Ranked Internship Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Order your top 5 internship preferences. Higher ranked choices receive significantly higher algorithm weight (100 down to 60 pts).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/student/internships">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Browse More Roles
            </Button>
          </Link>
          <Button
            onClick={handleSavePreferences}
            isLoading={isSaving}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Ranked Order
          </Button>
        </div>
      </div>

      {/* Priority Scoring Reference Cards */}
      <div className="grid grid-cols-5 gap-3 text-center">
        {[
          { rank: 1, pts: 100, label: 'Highest Priority' },
          { rank: 2, pts: 90, label: '2nd Choice' },
          { rank: 3, pts: 80, label: '3rd Choice' },
          { rank: 4, pts: 70, label: '4th Choice' },
          { rank: 5, pts: 60, label: '5th Choice' },
        ].map((item) => (
          <div
            key={item.rank}
            className={`p-3 rounded-xl border text-xs ${
              item.rank === 1
                ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Rank #{item.rank}</span>
            <span className="text-lg font-bold font-mono text-indigo-600 block my-0.5">{item.pts} pts</span>
            <span className="text-[10px] text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Interactive Ranking List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Priority Ranking Order ({preferences.length}/5)</CardTitle>
              <CardDescription className="text-xs">
                Use the up/down arrows to reorder your preferred companies and roles.
              </CardDescription>
            </div>
            {preferences.length < 5 && (
              <Badge variant="warning">
                {5 - preferences.length} more slots available
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {preferences.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm space-y-3">
              <AlertCircle className="h-8 w-8 mx-auto text-slate-300" />
              <p>You have not selected any internship preferences yet.</p>
              <Link href="/student/internships">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Browse Internships Directory
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {preferences.map((pref, index) => {
                const calculatedPoints = 100 - (index * 10);
                return (
                  <div
                    key={pref.id || pref.internshipId}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 shadow-sm flex items-center justify-between gap-4 transition-all"
                  >
                    {/* Rank Badge & Details */}
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">
                          {pref.internship?.title || 'Internship Position'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {pref.internship?.companyName || 'Company'} • {pref.internship?.location} • Min CGPA: {pref.internship?.minimumCGPA}
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Algorithm Merit</span>
                        <span className="font-mono font-bold text-indigo-600 text-sm">{calculatedPoints} pts</span>
                      </div>

                      <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveUp(index)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600"
                          title="Move Up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === preferences.length - 1}
                          onClick={() => moveDown(index)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600"
                          title="Move Down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removePreference(index)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                          title="Remove Choice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
