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
  Plus,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';
import { useToast } from '../../components/ui/toast';
import { InternshipData, PreferenceData, UserSession, StudentData } from '../../lib/types';

export default function InternshipsPage() {
  const { success, error: showError } = useToast();
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);
  const [preferences, setPreferences] = useState<PreferenceData[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [minCgpaFilter, setMinCgpaFilter] = useState('ALL');
  const [minStipendFilter, setMinStipendFilter] = useState(0);
  const [durationFilter, setDurationFilter] = useState('ALL');

  // Modal State
  const [selectedInternship, setSelectedInternship] = useState<InternshipData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const internRes = await fetch('/api/admin/internships').then((r) => r.json());
        if (internRes.internships) {
          setInternships(internRes.internships);
          setFilteredInternships(internRes.internships);
        }

        // Check user session
        try {
          const authRes = await fetch('/api/auth/me').then((r) => r.json());
          if (authRes.authenticated && authRes.user) {
            setUser(authRes.user);
            if (authRes.user.role === 'STUDENT') {
              const [prefRes, studRes] = await Promise.all([
                fetch('/api/student/preferences').then((r) => r.json()),
                fetch('/api/admin/students').then((r) => r.json()),
              ]);
              if (prefRes.preferences) {
                setPreferences(prefRes.preferences);
              }
              if (studRes.students) {
                const found = studRes.students.find(
                  (s: StudentData) =>
                    s.id === authRes.user.studentId ||
                    s.userId === authRes.user.id ||
                    s.email === authRes.user.email
                );
                if (found) setStudentProfile(found);
              }
            }
          }
        } catch (authErr) {
          // Public browsing
        }
      } catch (err) {
        showError('Unable to load internship opportunities.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [showError]);

  // Dynamic filter options
  const companies = Array.from(new Set(internships.map((i) => i.companyName || 'Corporate Partner'))).sort();
  const locations = Array.from(new Set(internships.map((i) => i.location))).sort();
  const durations = Array.from(new Set(internships.map((i) => i.duration))).sort();
  const allRequiredSkills = Array.from(
    new Set(internships.flatMap((i) => i.requiredSkills))
  ).sort();

  // Apply filters
  useEffect(() => {
    let list = [...internships];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.companyName?.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (companyFilter !== 'ALL') {
      list = list.filter((i) => (i.companyName || 'Corporate Partner') === companyFilter);
    }

    if (locationFilter !== 'ALL') {
      list = list.filter((i) => i.location === locationFilter);
    }

    if (modeFilter !== 'ALL') {
      list = list.filter((i) => i.mode === modeFilter);
    }

    if (skillFilter !== 'ALL') {
      list = list.filter((i) => i.requiredSkills.includes(skillFilter));
    }

    if (minCgpaFilter !== 'ALL') {
      const cgpa = parseFloat(minCgpaFilter);
      list = list.filter((i) => i.minimumCGPA <= cgpa);
    }

    if (minStipendFilter > 0) {
      list = list.filter((i) => i.stipend >= minStipendFilter);
    }

    if (durationFilter !== 'ALL') {
      list = list.filter((i) => i.duration === durationFilter);
    }

    setFilteredInternships(list);
  }, [
    searchQuery,
    companyFilter,
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
    setLocationFilter('ALL');
    setModeFilter('ALL');
    setSkillFilter('ALL');
    setMinCgpaFilter('ALL');
    setMinStipendFilter(0);
    setDurationFilter('ALL');
  };

  const isAlreadyPreferred = (id: string) => {
    return preferences.some((p) => p.internshipId === id);
  };

  const getPreferenceRank = (id: string) => {
    const p = preferences.find((item) => item.internshipId === id);
    return p ? p.rank : null;
  };

  const handleAddToPreferences = async (internshipId: string) => {
    if (!user) {
      showError('Please sign in as a student to add preferences.');
      return;
    }
    if (user.role !== 'STUDENT') {
      showError('Only registered students can submit preferences.');
      return;
    }
    if (preferences.length >= 5) {
      showError('You have already selected the maximum 5 preferences. Re-order them in Preference Manager.');
      return;
    }
    if (isAlreadyPreferred(internshipId)) {
      showError('This internship is already in your preference list.');
      return;
    }

    const updatedIds = [...preferences.map((p) => p.internshipId), internshipId];

    try {
      const res = await fetch('/api/student/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipIds: updatedIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      success('Added to your ranked preferences!');
      const prefRes = await fetch('/api/student/preferences').then((r) => r.json());
      if (prefRes.preferences) {
        setPreferences(prefRes.preferences);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to update preferences.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#334155]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Directory</span>
            <span className="text-[#334155]">•</span>
            <span className="text-xs text-[#34D399] font-medium">Verified College Listings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">Internship Opportunities</h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Browse corporate openings, review required technical competencies, check academic eligibility, and submit your ranked preferences.
          </p>
        </div>

        {user?.role === 'STUDENT' && (
          <div className="flex items-center gap-3">
            <Link href="/student/preferences">
              <Button className="bg-[#0284C7] hover:bg-[#0369A1] text-white">
                My Rankings ({preferences.length}/5)
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Filter and Search Panel */}
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardContent className="p-5 space-y-4">
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3.5 top-3.5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search internships by role, company, location, or technical skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-[#334155] rounded-md text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 focus:border-[#38BDF8]"
            />
          </div>

          {/* Secondary Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {/* Company */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Company</label>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-[#334155] rounded-md text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All Companies</option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-[#334155] rounded-md text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Mode</label>
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-[#334155] rounded-md text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All Modes</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">On-site</option>
              </select>
            </div>

            {/* Skill Filter */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Required Skill</label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-[#334155] rounded-md text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All Skills ({allRequiredSkills.length})</option>
                {allRequiredSkills.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum CGPA */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Max Min CGPA</label>
              <select
                value={minCgpaFilter}
                onChange={(e) => setMinCgpaFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-[#334155] rounded-md text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">Any CGPA</option>
                <option value="7.0">≤ 7.0 Required</option>
                <option value="7.5">≤ 7.5 Required</option>
                <option value="8.0">≤ 8.0 Required</option>
                <option value="8.5">≤ 8.5 Required</option>
              </select>
            </div>

            {/* Stipend */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Min Stipend</label>
              <select
                value={minStipendFilter}
                onChange={(e) => setMinStipendFilter(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-[#334155] rounded-md text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value={0}>Any Stipend</option>
                <option value={15000}>₹15,000+</option>
                <option value={25000}>₹25,000+</option>
                <option value={35000}>₹35,000+</option>
                <option value={45000}>₹45,000+</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">Duration</label>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0F172A] border border-[#334155] rounded-md text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All Durations</option>
                {durations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count & Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-[#334155] text-xs text-[#94A3B8]">
            <span>
              Showing <strong className="text-[#F8FAFC]">{filteredInternships.length}</strong> of{' '}
              <strong className="text-[#F8FAFC]">{internships.length}</strong> opportunities
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[#38BDF8] hover:underline font-medium cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Filters
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Internship Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="h-64 bg-[#1E293B] border border-[#334155] rounded-md animate-pulse p-5 space-y-4"
            >
              <div className="h-4 bg-[#334155] rounded w-1/3"></div>
              <div className="h-6 bg-[#334155] rounded w-3/4"></div>
              <div className="h-16 bg-[#0F172A] rounded w-full"></div>
              <div className="h-8 bg-[#334155] rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="text-center py-16 bg-[#1E293B] border border-[#334155] rounded-md p-8">
          <Briefcase className="h-10 w-10 text-[#64748B] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#F8FAFC]">No matching internships found</h3>
          <p className="text-sm text-[#94A3B8] mt-1 mb-4">
            Try adjusting your search criteria or clearing selected filters.
          </p>
          <Button variant="outline" onClick={handleResetFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship) => {
            const alreadyPreferred = isAlreadyPreferred(internship.id);
            const rank = getPreferenceRank(internship.id);
            const isEligible = studentProfile ? studentProfile.cgpa >= internship.minimumCGPA : true;

            return (
              <Card
                key={internship.id}
                className="border-[#334155] bg-[#1E293B] hover:border-[#38BDF8] transition-all flex flex-col justify-between"
              >
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Header: Company + Mode */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-medium">
                        <Building2 className="h-3.5 w-3.5 text-[#38BDF8]" />
                        <span>{internship.companyName || 'Corporate Partner'}</span>
                      </div>
                      <Badge
                        variant={
                          internship.mode === 'REMOTE'
                            ? 'success'
                            : internship.mode === 'HYBRID'
                            ? 'warning'
                            : 'secondary'
                        }
                        className="text-[10px] uppercase font-semibold"
                      >
                        {internship.mode}
                      </Badge>
                    </div>

                    {/* Internship Title */}
                    <h3 className="font-bold text-[#F8FAFC] text-base leading-snug hover:text-[#38BDF8]">
                      {internship.title}
                    </h3>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#334155] text-xs text-[#94A3B8]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#64748B] shrink-0" />
                        <span className="truncate">{internship.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#64748B] shrink-0" />
                        <span>{internship.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-[#F8FAFC]">
                        <span>
                          {internship.stipend > 0
                            ? `₹${internship.stipend.toLocaleString()}/mo`
                            : 'Unpaid / Training'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-[#34D399]">
                        <Award className="h-3.5 w-3.5 text-[#34D399] shrink-0" />
                        <span>Min CGPA: {internship.minimumCGPA.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Available Seats & Eligibility */}
                    <div className="flex items-center justify-between text-xs text-[#94A3B8] mt-2">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-[#64748B]" />
                        <span>Capacity: {internship.totalSeats} seats</span>
                      </div>

                      {studentProfile && (
                        isEligible ? (
                          <span className="text-[10px] font-semibold text-[#34D399]">
                            Eligible (CGPA {studentProfile.cgpa.toFixed(1)})
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-[#F87171]">
                            CGPA Cutoff Unmet
                          </span>
                        )
                      )}
                    </div>

                    {/* Skills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {internship.requiredSkills.slice(0, 3).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 bg-[#0F172A] text-[#38BDF8] text-[11px] font-medium rounded border border-[#334155]"
                        >
                          {skill}
                        </span>
                      ))}
                      {internship.requiredSkills.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[11px] text-[#94A3B8]">
                          +{internship.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#334155] flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs border-[#334155] text-[#CBD5E1] hover:text-[#F8FAFC]"
                      onClick={() => {
                        setSelectedInternship(internship);
                        setIsModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>

                    {user?.role === 'STUDENT' && (
                      alreadyPreferred ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#065F46]/20 text-[#34D399] border border-[#059669]/40 rounded-md text-xs font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Rank #{rank}
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs"
                          onClick={() => handleAddToPreferences(internship.id)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add
                        </Button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedInternship && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedInternship(null);
          }}
          title={selectedInternship.title}
          description={`${selectedInternship.companyName || 'Corporate Partner'} • Placement Specification`}
          maxWidth="2xl"
        >
          <div className="space-y-6 pt-2">
            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#0F172A] rounded-md border border-[#334155]">
              <div>
                <span className="text-[11px] font-medium text-[#94A3B8] block">Work Mode</span>
                <span className="text-sm font-semibold text-[#F8FAFC]">{selectedInternship.mode}</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#94A3B8] block">Location</span>
                <span className="text-sm font-semibold text-[#F8FAFC]">{selectedInternship.location}</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#94A3B8] block">Duration</span>
                <span className="text-sm font-semibold text-[#F8FAFC]">{selectedInternship.duration}</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#94A3B8] block">Monthly Stipend</span>
                <span className="text-sm font-semibold text-[#34D399]">
                  {selectedInternship.stipend > 0
                    ? `₹${selectedInternship.stipend.toLocaleString()}`
                    : 'Unpaid / Credits'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#94A3B8] block">Min CGPA Required</span>
                <span className="text-sm font-semibold text-[#38BDF8]">
                  {selectedInternship.minimumCGPA.toFixed(1)} / 10.0
                </span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#94A3B8] block">Available Seats</span>
                <span className="text-sm font-semibold text-[#F8FAFC]">{selectedInternship.totalSeats}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[11px] font-medium text-[#94A3B8] block">Allocation Criteria</span>
                <span className="text-xs text-[#CBD5E1]">
                  CGPA (40%) + Skill Match (30%) + Preference (20%) + Branch (10%)
                </span>
              </div>
            </div>

            {/* Role Overview */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                Internship Description
              </h4>
              <p className="text-sm text-[#CBD5E1] leading-relaxed whitespace-pre-line bg-[#0F172A] p-3 rounded border border-[#334155]">
                {selectedInternship.description}
              </p>
            </div>

            {/* Required Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                Required Technical Competencies
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedInternship.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#0F172A] text-[#38BDF8] text-xs font-semibold rounded-md border border-[#334155]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Department Eligibility */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                Eligible Engineering Branches
              </h4>
              <p className="text-xs text-[#94A3B8]">
                Open to Computer Science (CS), Information Technology (IT), Electronics &amp; Telecommunication (EXTC), Electrical, Mechanical, and Civil branches meeting the minimum CGPA cutoff.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#334155]">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedInternship(null);
                }}
              >
                Close
              </Button>

              {user?.role === 'STUDENT' ? (
                isAlreadyPreferred(selectedInternship.id) ? (
                  <Button disabled className="bg-[#059669] text-white opacity-90 cursor-default">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Already in Preferences
                  </Button>
                ) : (
                  <Button
                    className="bg-[#0284C7] hover:bg-[#0369A1] text-white"
                    onClick={() => {
                      handleAddToPreferences(selectedInternship.id);
                      setIsModalOpen(false);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add to Preferences
                  </Button>
                )
              ) : (
                <Link href="/login">
                  <Button className="bg-[#0284C7] hover:bg-[#0369A1] text-white">
                    Sign in to Apply
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
