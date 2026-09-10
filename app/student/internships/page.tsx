'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  Clock,
  Award,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../components/ui/toast';
import { InternshipData, StudentData } from '../../../lib/types';
import { checkEligibility } from '../../../lib/algorithm/eligibilityEngine';

export default function StudentBrowseInternshipsPage() {
  const { success, error: showError } = useToast();
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [internRes, profRes] = await Promise.all([
          fetch('/api/admin/internships').then((r) => r.json()),
          fetch('/api/student/profile').then((r) => r.json()),
        ]);
        if (internRes.internships) setInternships(internRes.internships);
        if (profRes.student) setStudent(profRes.student);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleAddPreference = async (internshipId: string) => {
    try {
      const prefRes = await fetch('/api/student/preferences').then((r) => r.json());
      const currentIds: string[] = (prefRes.preferences || []).map((p: any) => p.internshipId);

      if (currentIds.includes(internshipId)) {
        showError('Role already added in preferences.');
        return;
      }

      currentIds.push(internshipId);

      const saveRes = await fetch('/api/student/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipIds: currentIds }),
      });

      if (!saveRes.ok) throw new Error('Failed to add');
      success('Role added to preferences!');
    } catch (err: any) {
      showError(err.message || 'Error updating preferences.');
    }
  };

  const filtered = internships.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      (i.companyName && i.companyName.toLowerCase().includes(search.toLowerCase())) ||
      i.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0284C7]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded">
            Opportunities Directory
          </span>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Browse Active Internships
          </h1>
          <p className="text-xs text-[#64748B]">
            Review criteria, inspect eligibility status, and append to your Gale-Shapley ranking schedule.
          </p>
        </div>

        <Link href="/student/preferences">
          <Button size="sm" className="bg-[#0284C7] text-white">
            View My Preferences &rarr;
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by role title, company, or technical skill..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((intern) => {
          const elig = student ? checkEligibility(student, intern) : null;

          return (
            <div
              key={intern.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:border-[#BAE6FD] hover:shadow-md transition-all flex flex-col justify-between h-full space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#0284C7] uppercase block truncate">
                      {intern.companyName}
                    </span>
                    <h3 className="font-bold text-sm text-[#0F172A] line-clamp-1">
                      {intern.title}
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-[#CBD5E1] shrink-0 font-medium">
                    {intern.mode}
                  </Badge>
                </div>

                <div className="text-xs text-[#64748B] flex flex-wrap gap-x-3 gap-y-1">
                  <span>{intern.location.split(',')[0]}</span>
                  <span>•</span>
                  <span>{intern.duration}</span>
                  <span>•</span>
                  <span className="font-bold text-[#0F172A]">₹{intern.stipend.toLocaleString()}/mo</span>
                </div>

                <p className="text-xs text-[#64748B] line-clamp-2">
                  {intern.description}
                </p>

                {/* Eligibility Pill */}
                {elig?.isEligible ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[11px] font-semibold">
                    <CheckCircle2 className="h-3 w-3 text-[#10B981]" />
                    <span>Eligible ({elig.skillMatchPercentage}% skills)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[11px] font-semibold">
                    <XCircle className="h-3 w-3 text-[#EF4444]" />
                    <span>Ineligible: Min CGPA {intern.minimumCGPA.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
                <Link href={`/internships/${intern.id}`}>
                  <Button size="sm" variant="outline" className="text-xs border-[#CBD5E1]">
                    Details
                  </Button>
                </Link>

                <Button
                  size="sm"
                  onClick={() => handleAddPreference(intern.id)}
                  className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs"
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
