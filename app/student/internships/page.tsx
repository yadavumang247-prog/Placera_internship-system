'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../components/ui/toast';
import { Internship, Student } from '../../../lib/types';
import { checkEligibility } from '../../../lib/algorithm/eligibilityEngine';

export default function StudentInternshipsDirectoryPage() {
  const { success, warning, error: showError } = useToast();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [resIntern, resStudent, resPrefs] = await Promise.all([
          fetch('/api/internships'),
          fetch('/api/student/profile'),
          fetch('/api/student/preferences'),
        ]);

        if (resIntern.ok) {
          const iData = await resIntern.json();
          setInternships(iData);
        }

        if (resStudent.ok) {
          const sData = await resStudent.json();
          setStudent(sData);
        }

        if (resPrefs.ok) {
          const pData = await resPrefs.json();
          setPreferences(pData.map((p: any) => p.internshipId));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddPreference = async (internshipId: string) => {
    if (preferences.includes(internshipId)) {
      warning('Already in Preferences', 'This internship is already in your preference ranking schedule.');
      return;
    }

    const updated = [...preferences, internshipId];
    try {
      const res = await fetch('/api/student/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferenceIds: updated }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save preference');
      }

      setPreferences(updated);
      success('Preference Added', `Saved as choice #${updated.length} in your allocation rankings.`);
    } catch (err: any) {
      showError('Error', err.message);
    }
  };

  const filtered = internships.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      (i.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
      i.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E5BA73]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl text-[#FAF8F5]">
      <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E5BA73] bg-[#E5BA73]/15 border border-[#E5BA73]/30 px-2.5 py-0.5 rounded">
            Opportunities Directory
          </span>
          <h1 className="text-2xl font-extrabold text-[#FAF8F5] tracking-tight mt-1">
            Browse Active Internships
          </h1>
          <p className="text-xs text-[#A8B2D1]">
            Review criteria, inspect eligibility status, and append to your placement ranking schedule.
          </p>
        </div>

        <Link href="/student/preferences">
          <Button size="sm" className="bg-[#E5BA73] hover:bg-[#F3CA68] text-[#0A1128] font-bold">
            View My Preferences &rarr;
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#A8B2D1]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by role title, company, or technical skill..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F1A36] border border-[#1E3466] text-xs text-[#FAF8F5] placeholder-[#A8B2D1]/60 focus:outline-none focus:ring-2 focus:ring-[#E5BA73]"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((intern) => {
          const elig = student ? checkEligibility(student, intern) : null;

          return (
            <div
              key={intern.id}
              className="bg-[#0F1A36] rounded-2xl border border-[#1E3466] p-5 shadow-md hover:border-[#E5BA73]/50 transition-all flex flex-col justify-between h-full space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#E5BA73] uppercase block truncate">
                      {intern.companyName}
                    </span>
                    <h3 className="font-bold text-sm text-[#FAF8F5] line-clamp-1">
                      {intern.title}
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-[#1E3466] bg-[#142247] text-[#FAF8F5] shrink-0 font-medium">
                    {intern.mode}
                  </Badge>
                </div>

                <div className="text-xs text-[#A8B2D1] flex flex-wrap gap-x-3 gap-y-1">
                  <span>{intern.location.split(',')[0]}</span>
                  <span>•</span>
                  <span>{intern.duration}</span>
                  <span>•</span>
                  <span className="font-bold text-[#FAF8F5]">₹{intern.stipend.toLocaleString()}/mo</span>
                </div>

                <p className="text-xs text-[#A8B2D1] line-clamp-2">
                  {intern.description}
                </p>

                {/* Eligibility Pill */}
                {elig?.isEligible ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span>Eligible ({elig.skillMatchPercentage}% skills)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-900/30 border border-rose-500/30 text-rose-400 text-[11px] font-semibold">
                    <XCircle className="h-3 w-3 text-rose-400" />
                    <span>Ineligible: Min CGPA {intern.minimumCGPA.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#1E3466] flex items-center justify-between gap-2">
                <Link href={`/internships/${intern.id}`}>
                  <Button size="sm" variant="outline" className="text-xs border-[#1E3466] bg-[#142247] text-[#FAF8F5] hover:bg-[#1E3466]">
                    Details
                  </Button>
                </Link>

                <Button
                  size="sm"
                  onClick={() => handleAddPreference(intern.id)}
                  className="bg-[#E5BA73] hover:bg-[#F3CA68] text-[#0A1128] font-bold text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add to List
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
