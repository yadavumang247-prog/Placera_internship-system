'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  BookOpen,
  Award,
  Briefcase,
  Save,
  CheckCircle2,
  FileText,
  Sparkles,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../components/ui/toast';
import { StudentData } from '../../../lib/types';

export default function StudentProfilePage() {
  const { success, error: showError } = useToast();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState(8.5);
  const [year, setYear] = useState(3);
  const [experienceMonths, setExperienceMonths] = useState(4);
  const [experienceSummary, setExperienceSummary] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/student/profile');
        const data = await res.json();
        if (data.student) {
          setStudent(data.student);
          setBranch(data.student.branch || '');
          setCgpa(data.student.cgpa || 8.0);
          setYear(data.student.year || 3);
          setExperienceMonths(data.student.experienceMonths || 0);
          setExperienceSummary(data.student.experienceSummary || '');
          setSkills(data.student.skills || []);
          setResumeUrl(data.student.resumeUrl || '');
        }
      } catch (err) {
        showError('Failed to load student profile.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [showError]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (skills.includes(newSkillInput.trim())) {
      showError('Skill already added.');
      return;
    }
    setSkills([...skills, newSkillInput.trim()]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch,
          cgpa: parseFloat(cgpa as any),
          year: parseInt(year as any),
          experienceMonths: parseInt(experienceMonths as any),
          experienceSummary,
          skills,
          resumeUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStudent(data.student);
      success('Academic profile updated successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0284C7]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded">
          Academic Credentials
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          My Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Your registered CGPA, engineering discipline, and technical skills directly determine your eligibility and merit score in the Gale-Shapley matching rounds.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Academic Details Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#0284C7]" />
            <span>Academic Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={student?.name || ''}
                className="w-full p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#94A3B8] mt-1 block">Verified university registry record</span>
            </div>

            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Roll Number</label>
              <input
                type="text"
                disabled
                value={student?.rollNumber || ''}
                className="w-full p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Engineering Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] focus:ring-2 focus:ring-[#0284C7]"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Cumulative CGPA (Scale of 10.0)</label>
              <input
                type="number"
                step="0.01"
                min="0.0"
                max="10.0"
                value={cgpa}
                onChange={(e) => setCgpa(parseFloat(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-bold focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Current Academic Year</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A]"
              >
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year (Class of 2026)</option>
                <option value={4}>4th Year (Class of 2025)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#64748B] mb-1">Prior Experience (Months)</label>
              <input
                type="number"
                min="0"
                max="36"
                value={experienceMonths}
                onChange={(e) => setExperienceMonths(parseInt(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A]"
              />
              <span className="text-[10px] text-[#64748B] mt-1 block">Contributes 20% to candidate merit score</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#64748B] text-xs mb-1">Experience &amp; Project Summary</label>
            <textarea
              rows={3}
              value={experienceSummary}
              onChange={(e) => setExperienceSummary(e.target.value)}
              placeholder="Describe open-source contributions, prior internships, or technical capstones..."
              className="w-full p-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:ring-2 focus:ring-[#0284C7]"
            />
          </div>
        </div>

        {/* Technical Skills Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#0284C7]" />
            <span>Technical Skills &amp; Competencies (40% Weight in Merit)</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EFF6FF] border border-[#BAE6FD] text-xs font-semibold text-[#0284C7]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add skill (e.g. Go, PyTorch, React, Kubernetes)..."
              className="flex-1 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A]"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAddSkill}
              className="bg-[#0284C7] text-white"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Skill
            </Button>
          </div>
        </div>

        {/* Resume Link */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#0284C7]" />
            <span>Verified Resume Document</span>
          </h2>
          <input
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://example.com/my-resume.pdf"
            className="w-full p-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            size="lg"
            className="bg-[#0284C7] hover:bg-[#0369A1] text-white px-8 font-semibold shadow-md"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
