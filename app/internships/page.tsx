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
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/toast';
import { InternshipData, StudentData, UserSession } from '../../lib/types';
import { checkEligibility } from '../../lib/algorithm/eligibilityEngine';

export default function InternshipsDirectoryPage() {
  const { success, error: showError } = useToast();
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [minCgpaFilter, setMinCgpaFilter] = useState('ALL');
  const [minStipendFilter, setMinStipendFilter] = useState(0);
  const [durationFilter, setDurationFilter] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/internships').then((r) => r.json());
        if (res.internships) {
          setInternships(res.internships);
          setFilteredInternships(res.internships);
        }

        try {
          const authRes = await fetch('/api/auth/me').then((r) => r.json());
          if (authRes.authenticated && authRes.user) {
            setUser(authRes.user);
            if (authRes.user.role === 'STUDENT') {
              const studRes = await fetch('/api/student/profile').then((r) => r.json());
              if (studRes.student) {
                setStudentProfile(studRes.student);
              }
            }
          }
        } catch (authErr) {}
      } catch (err) {
        showError('Unable to load internship opportunities.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [showError]);

  // Distinct filter values
  const companies = Array.from(new Set(internships.map((i) => i.companyName || 'Corporate Partner'))).sort();
  const locations = Array.from(new Set(internships.map((i) => i.location))).sort();
  const durations = Array.from(new Set(internships.map((i) => i.duration))).sort();
  const allBranches = Array.from(
    new Set(internships.flatMap((i) => i.allowedBranches || ['All Branches']))
  ).sort();
  const allSkills = Array.from(new Set(internships.flatMap((i) => i.requiredSkills || []))).sort();

  // Apply multi-factor filters
  useEffect(() => {
    let result = [...internships];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.companyName && i.companyName.toLowerCase().includes(q)) ||
          i.description.toLowerCase().includes(q) ||
          i.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (companyFilter !== 'ALL') {
      result = result.filter((i) => i.companyName === companyFilter);
    }

    if (branchFilter !== 'ALL') {
      result = result.filter(
        (i) => i.allowedBranches.includes('All Branches') || i.allowedBranches.includes(branchFilter)
      );
    }

    if (locationFilter !== 'ALL') {
      result = result.filter((i) => i.location === locationFilter);
    }

    if (modeFilter !== 'ALL') {
      result = result.filter((i) => i.mode === modeFilter);
    }

    if (skillFilter !== 'ALL') {
      result = result.filter((i) =>
        i.requiredSkills.some((s) => s.toLowerCase() === skillFilter.toLowerCase())
      );
    }

    if (minCgpaFilter !== 'ALL') {
      const cutoff = parseFloat(minCgpaFilter);
      result = result.filter((i) => i.minimumCGPA <= cutoff);
    }

    if (minStipendFilter > 0) {
      result = result.filter((i) => i.stipend >= minStipendFilter);
    }

    if (durationFilter !== 'ALL') {
      result = result.filter((i) => i.duration === durationFilter);
    }

    setFilteredInternships(result);
  }, [
    searchQuery,
    companyFilter,
    branchFilter,
    locationFilter,
    modeFilter,
    skillFilter,
    minCgpaFilter,
    minStipendFilter,
    durationFilter,
    internships,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setCompanyFilter('ALL');
    setBranchFilter('ALL');
    setLocationFilter('ALL');
    setModeFilter('ALL');
    setSkillFilter('ALL');
    setMinCgpaFilter('ALL');
    setMinStipendFilter(0);
    setDurationFilter('ALL');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1128] text-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E5BA73] bg-[#E5BA73]/15 px-2.5 py-0.5 rounded border border-[#E5BA73]/30">
                  Campus Recruitment
                </span>
                <span className="text-xs text-[#D8CEBC]">Active Opportunities</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FAF8F5] tracking-tight mt-1">
                Verified Internship Directory
              </h1>
              <p className="text-xs sm:text-sm text-[#D8CEBC] mt-1">
                Explore approved corporate opportunities, inspect academic eligibility criteria, and rank your preferences for automated matching.
              </p>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-[#0F1A36] p-5 rounded-2xl border border-[#1E3466] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#FAF8F5]">
                <SlidersHorizontal className="h-4 w-4 text-[#E5BA73]" />
                <span>Multi-Factor Filters</span>
                <Badge variant="outline" className="text-xs font-normal border-[#1E3466] text-[#E5BA73]">
                  {filteredInternships.length} Available
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs text-[#D8CEBC] hover:text-[#FAF8F5] p-1.5 h-auto"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset All
              </Button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#8A97B5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role title, corporate partner, or skills (e.g. Python, Azure)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E3466] text-sm text-[#FAF8F5] placeholder-[#8A97B5] focus:outline-none focus:ring-2 focus:ring-[#E5BA73]/50 focus:border-[#E5BA73] transition-all"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
              {/* Company */}
              <div>
                <label className="block text-[11px] font-semibold text-[#D8CEBC] mb-1">Company</label>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0A1128] border border-[#1E3466] text-[#FAF8F5]"
                >
                  <option value="ALL">All Companies</option>
                  {companies.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-[11px] font-semibold text-[#D8CEBC] mb-1">Branch</label>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0A1128] border border-[#1E3466] text-[#FAF8F5]"
                >
                  <option value="ALL">All Branches</option>
                  {allBranches.map((b, i) => (
                    <option key={i} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-[11px] font-semibold text-[#D8CEBC] mb-1">Work Mode</label>
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0A1128] border border-[#1E3466] text-[#FAF8F5]"
                >
                  <option value="ALL">All Modes</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">Onsite</option>
                </select>
              </div>

              {/* Min CGPA */}
              <div>
                <label className="block text-[11px] font-semibold text-[#D8CEBC] mb-1">My CGPA &ge;</label>
                <select
                  value={minCgpaFilter}
                  onChange={(e) => setMinCgpaFilter(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0A1128] border border-[#1E3466] text-[#FAF8F5]"
                >
                  <option value="ALL">Any Cutoff</option>
                  <option value="7.0">&le; 7.0 Cutoff</option>
                  <option value="8.0">&le; 8.0 Cutoff</option>
                  <option value="8.5">&le; 8.5 Cutoff</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] font-semibold text-[#D8CEBC] mb-1">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0A1128] border border-[#1E3466] text-[#FAF8F5]"
                >
                  <option value="ALL">All Locations</option>
                  {locations.map((l, i) => (
                    <option key={i} value={l}>{l.split(',')[0]}</option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-[11px] font-semibold text-[#D8CEBC] mb-1">Duration</label>
                <select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0A1128] border border-[#1E3466] text-[#FAF8F5]"
                >
                  <option value="ALL">All Durations</option>
                  {durations.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-[11px] font-semibold text-[#D8CEBC] mb-1">Skill</label>
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0A1128] border border-[#1E3466] text-[#FAF8F5]"
                >
                  <option value="ALL">All Skills</option>
                  {allSkills.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Stipend */}
              <div>
                <label className="block text-[11px] font-semibold text-[#D8CEBC] mb-1">Min Stipend</label>
                <select
                  value={minStipendFilter}
                  onChange={(e) => setMinStipendFilter(parseInt(e.target.value))}
                  className="w-full p-2 rounded-lg bg-[#0A1128] border border-[#1E3466] text-[#FAF8F5]"
                >
                  <option value="0">Any</option>
                  <option value="50000">&ge; ₹50,000</option>
                  <option value="70000">&ge; ₹70,000</option>
                  <option value="80000">&ge; ₹80,000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Internship Grid */}
          {filteredInternships.length === 0 ? (
            <div className="bg-[#0F1A36] p-12 text-center rounded-2xl border border-[#1E3466] space-y-3">
              <Briefcase className="h-10 w-10 text-[#8A97B5] mx-auto" />
              <h3 className="font-bold text-lg text-[#FAF8F5]">No Matching Opportunities Found</h3>
              <p className="text-xs text-[#D8CEBC] max-w-sm mx-auto">
                No active internships meet your selected filter criteria. Try clearing filters or expanding your search.
              </p>
              <Button size="sm" variant="outline" onClick={handleResetFilters} className="mt-2 border-[#1E3466] text-[#E5BA73]">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((intern) => {
                const elig = studentProfile ? checkEligibility(studentProfile, intern) : null;

                return (
                  <div
                    key={intern.id}
                    className="bg-[#0F1A36] rounded-2xl border border-[#1E3466] p-6 shadow-sm hover:shadow-md hover:border-[#E5BA73]/60 transition-all flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      {/* Company Header & Mode */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-[#E5BA73] uppercase tracking-wider block">
                            {intern.companyName}
                          </span>
                          <h2 className="text-lg font-bold text-[#FAF8F5] leading-snug line-clamp-1 mt-0.5">
                            {intern.title}
                          </h2>
                        </div>
                        <Badge variant="outline" className="text-[11px] border-[#E5BA73]/40 bg-[#E5BA73]/15 text-[#F3CA68] font-semibold shrink-0">
                          {intern.mode}
                        </Badge>
                      </div>

                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#D8CEBC]">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#E5BA73]" />
                          <span>{intern.location.split(',')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-[#E5BA73]" />
                          <span>{intern.duration}</span>
                        </div>
                        <div className="font-bold text-[#FAF8F5]">
                          ₹{intern.stipend.toLocaleString()}/mo
                        </div>
                      </div>

                      {/* Description snippet */}
                      <p className="text-xs text-[#D8CEBC] line-clamp-2 leading-relaxed">
                        {intern.description}
                      </p>

                      {/* Required Skills */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-[#D8CEBC]/70 tracking-wider block">
                          Required Competencies
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {intern.requiredSkills.slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#142247] text-[#D8CEBC] font-medium border border-[#1E3466]"
                            >
                              {skill}
                            </span>
                          ))}
                          {intern.requiredSkills.length > 3 && (
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#142247] text-[#D8CEBC]/70 border border-[#1E3466]">
                              +{intern.requiredSkills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Live Eligibility Status Pill */}
                      {studentProfile && (
                        <div className="pt-2">
                          {elig?.isEligible ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#064E3B]/40 border border-[#059669]/50 text-emerald-300 text-xs font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#34D399]" />
                              <span>Eligible ({elig.skillMatchPercentage}% skill match)</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#7F1D1D]/30 border border-[#DC2626]/40 text-rose-300 text-xs font-semibold">
                              <XCircle className="h-3.5 w-3.5 text-[#F87171]" />
                              <span>Not Eligible: Min CGPA {intern.minimumCGPA.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Quota & Action Button */}
                    <div className="mt-6 pt-4 border-t border-[#1E3466] flex items-center justify-between">
                      <div className="text-xs text-[#D8CEBC]">
                        <span className="font-bold text-[#FAF8F5]">{intern.totalSeats}</span> seats • Min CGPA <span className="font-bold text-[#FAF8F5]">{intern.minimumCGPA.toFixed(1)}</span>
                      </div>

                      <Link href={`/internships/${intern.id}`}>
                        <Button size="sm" className="bg-[#E5BA73] hover:bg-[#D4A253] text-[#0A1128] text-xs font-bold shadow-sm">
                          View Details
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
