'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  GraduationCap,
  BookOpen,
  Sparkles,
  Save,
  CheckCircle2,
  FileText,
  Plus,
  X,
  Layers,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useToast } from '../../../components/ui/toast';
import { Student } from '../../../lib/types';

export default function StudentProfilePage() {
  const { success, error: showError } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [cgpa, setCgpa] = useState<number>(0);
  const [branch, setBranch] = useState<string>('');
  const [year, setYear] = useState<number>(3);
  const [experienceMonths, setExperienceMonths] = useState<number>(0);
  const [experienceSummary, setExperienceSummary] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [resumeUrl, setResumeUrl] = useState<string>('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/student/profile');
        if (!res.ok) throw new Error('Failed to load profile');
        const data: Student = await res.json();
        setStudent(data);
        setCgpa(data.cgpa);
        setBranch(data.branch);
        setYear(data.year);
        setExperienceMonths(data.experienceMonths ?? 0);
        setExperienceSummary(data.experienceSummary || '');
        setSkills(data.skills || []);
        setResumeUrl(data.resumeUrl || '');
      } catch (err: any) {
        showError('Could not load profile', err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) return;
    setSkills([...skills, trimmed]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa,
          branch,
          year,
          experienceMonths,
          experienceSummary,
          skills,
          resumeUrl,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Update failed');
      }

      const updated = await res.json();
      setStudent(updated);
      success('Profile Updated', 'Your academic credentials and technical skill set have been persisted.');
    } catch (err: any) {
      showError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E5BA73]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl text-[#FAF8F5]">
      {/* Header */}
      <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E5BA73] bg-[#E5BA73]/15 border border-[#E5BA73]/30 px-2.5 py-0.5 rounded">
          Academic Credentials
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FAF8F5] tracking-tight mt-1">
          My Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#A8B2D1]">
          Your registered CGPA, engineering discipline, and technical skills directly determine your eligibility and merit score in the allocation matching rounds.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Academic Details Card */}
        <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md space-y-4">
          <h2 className="text-base font-bold text-[#FAF8F5] border-b border-[#1E3466] pb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#E5BA73]" />
            <span>Academic Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#A8B2D1] mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={student?.name || ''}
                className="w-full p-2.5 rounded-xl bg-[#0A1128] border border-[#1E3466] text-[#A8B2D1] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#A8B2D1]/70 mt-1 block">Verified university registry record</span>
            </div>

            <div>
              <label className="block font-semibold text-[#A8B2D1] mb-1">Roll Number</label>
              <input
                type="text"
                disabled
                value={student?.rollNumber || ''}
                className="w-full p-2.5 rounded-xl bg-[#0A1128] border border-[#1E3466] text-[#A8B2D1] cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#A8B2D1] mb-1">Engineering Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#142247] border border-[#1E3466] text-[#FAF8F5] focus:ring-2 focus:ring-[#E5BA73]"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#A8B2D1] mb-1">Cumulative CGPA (Scale of 10.0)</label>
              <input
                type="number"
                step="0.01"
                min="0.0"
                max="10.0"
                value={cgpa}
                onChange={(e) => setCgpa(parseFloat(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#142247] border border-[#1E3466] text-[#FAF8F5] font-bold focus:ring-2 focus:ring-[#E5BA73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#A8B2D1] mb-1">Current Academic Year</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#142247] border border-[#1E3466] text-[#FAF8F5] focus:ring-2 focus:ring-[#E5BA73]"
              >
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year (Class of 2026)</option>
                <option value={4}>4th Year (Class of 2025)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#A8B2D1] mb-1">Prior Experience (Months)</label>
              <input
                type="number"
                min="0"
                max="36"
                value={experienceMonths}
                onChange={(e) => setExperienceMonths(parseInt(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#142247] border border-[#1E3466] text-[#FAF8F5] focus:ring-2 focus:ring-[#E5BA73]"
              />
              <span className="text-[10px] text-[#A8B2D1]/70 mt-1 block">Contributes 20% to candidate merit score</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#A8B2D1] text-xs mb-1">Experience &amp; Project Summary</label>
            <textarea
              rows={3}
              value={experienceSummary}
              onChange={(e) => setExperienceSummary(e.target.value)}
              placeholder="Describe open-source contributions, prior internships, or technical capstones..."
              className="w-full p-2.5 rounded-xl bg-[#142247] border border-[#1E3466] text-xs text-[#FAF8F5] focus:ring-2 focus:ring-[#E5BA73]"
            />
          </div>
        </div>

        {/* Technical Skills Card */}
        <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md space-y-4">
          <h2 className="text-base font-bold text-[#FAF8F5] border-b border-[#1E3466] pb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#E5BA73]" />
            <span>Technical Skills &amp; Competencies (40% Weight in Merit)</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#142247] border border-[#E5BA73]/30 text-xs font-semibold text-[#E5BA73]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400 transition-colors"
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
              className="flex-1 p-2.5 rounded-xl bg-[#142247] border border-[#1E3466] text-xs text-[#FAF8F5] placeholder-[#A8B2D1]/60 focus:ring-2 focus:ring-[#E5BA73]"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAddSkill}
              className="bg-[#E5BA73] hover:bg-[#F3CA68] text-[#0A1128] font-bold"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Skill
            </Button>
          </div>
        </div>

        {/* Resume Link */}
        <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md space-y-3">
          <h2 className="text-base font-bold text-[#FAF8F5] flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#E5BA73]" />
            <span>Verified Resume Document</span>
          </h2>
          <input
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://example.com/my-resume.pdf"
            className="w-full p-2.5 rounded-xl bg-[#142247] border border-[#1E3466] text-xs text-[#FAF8F5] placeholder-[#A8B2D1]/60 focus:ring-2 focus:ring-[#E5BA73]"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            size="lg"
            className="bg-[#E5BA73] hover:bg-[#F3CA68] text-[#0A1128] px-8 font-bold shadow-md"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
