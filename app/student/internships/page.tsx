'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  Clock,
  Award,
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Modal } from '../../../components/ui/modal';
import { useToast } from '../../../components/ui/toast';
import { InternshipData, PreferenceData } from '../../../lib/types';

export default function StudentInternshipsPage() {
  const { success, error: showError } = useToast();
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [preferences, setPreferences] = useState<PreferenceData[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [minStipendFilter, setMinStipendFilter] = useState(0);
  const [selectedInternship, setSelectedInternship] = useState<InternshipData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [internRes, prefRes] = await Promise.all([
        fetch('/api/admin/internships').then((r) => r.json()),
        fetch('/api/student/preferences').then((r) => r.json()),
      ]);
      if (internRes.internships) {
        setInternships(internRes.internships);
        setFilteredInternships(internRes.internships);
      }
      if (prefRes.preferences) {
        setPreferences(prefRes.preferences);
      }
    } catch (err) {
      showError('Failed to load internships');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter effect
  useEffect(() => {
    let list = [...internships];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.companyName?.toLowerCase().includes(q) ||
          i.requiredSkills.some((sk) => sk.toLowerCase().includes(q))
      );
    }

    if (modeFilter !== 'ALL') {
      list = list.filter((i) => i.mode === modeFilter);
    }

    if (minStipendFilter > 0) {
      list = list.filter((i) => i.stipend >= minStipendFilter);
    }

    setFilteredInternships(list);
  }, [searchQuery, modeFilter, minStipendFilter, internships]);

  const isAlreadyPreferred = (internshipId: string) => {
    return preferences.some((p) => p.internshipId === internshipId);
  };

  const getPreferenceRank = (internshipId: string) => {
    const p = preferences.find((item) => item.internshipId === internshipId);
    return p ? p.rank : null;
  };

  const handleAddToPreferences = async (internshipId: string) => {
    if (preferences.length >= 5) {
      showError('You have already chosen the maximum of 5 preferences. Re-order them in Preference Manager.');
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
      loadData();
    } catch (err: any) {
      showError(err.message || 'Failed to update preferences');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-6 rounded-md border border-[#334155]">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-[#38BDF8]" />
            Browse Verified Internships
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Explore college-approved opportunities, review required skills, and select positions for your preference ranking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/student/preferences">
            <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white">
              Manage Rankings ({preferences.length}/5)
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            {/* Mode Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#64748B] shrink-0" />
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All Work Modes</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">On-site</option>
              </select>
            </div>

            {/* Min Stipend Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#94A3B8] shrink-0">Min Stipend:</span>
              <select
                value={minStipendFilter}
                onChange={(e) => setMinStipendFilter(Number(e.target.value))}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value={0}>Any Stipend</option>
                <option value={20000}>≥ ₹20,000 / mo</option>
                <option value={30000}>≥ ₹30,000 / mo</option>
                <option value={40000}>≥ ₹40,000 / mo</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map((intern) => {
          const isSelected = isAlreadyPreferred(intern.id);
          const rank = getPreferenceRank(intern.id);

          return (
            <Card
              key={intern.id}
              className="flex flex-col justify-between border-[#334155] bg-[#1E293B] hover:border-[#38BDF8] transition-all"
            >
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-[#F8FAFC] text-base leading-snug">{intern.title}</h3>
                      <p className="text-xs text-[#38BDF8] font-semibold">{intern.companyName}</p>
                    </div>
                    <Badge
                      variant={
                        intern.mode === 'REMOTE' ? 'success' : intern.mode === 'HYBRID' ? 'warning' : 'secondary'
                      }
                      className="text-[10px] uppercase"
                    >
                      {intern.mode}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#94A3B8] mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {intern.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {intern.duration}
                    </span>
                  </div>

                  <p className="text-xs text-[#CBD5E1] line-clamp-2 leading-relaxed mb-4">
                    {intern.description}
                  </p>

                  {/* Key Skills */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Required Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {intern.requiredSkills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] bg-[#0F172A] text-[#38BDF8] px-1.5 py-0.5 rounded border border-[#334155]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Eligibility & Seats */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#0F172A] rounded-md border border-[#334155] text-center mb-4">
                    <div>
                      <span className="text-[9px] text-[#94A3B8] uppercase font-semibold">Min CGPA</span>
                      <p className="text-xs font-bold text-[#F8FAFC]">≥ {intern.minimumCGPA.toFixed(1)}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#94A3B8] uppercase font-semibold">Stipend</span>
                      <p className="text-xs font-bold text-[#34D399]">₹{(intern.stipend / 1000).toFixed(0)}k/m</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#94A3B8] uppercase font-semibold">Seats</span>
                      <p className="text-xs font-bold text-[#38BDF8]">{intern.totalSeats}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#334155] flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedInternship(intern)}
                    className="text-xs border-[#334155] text-[#CBD5E1]"
                  >
                    View Details
                  </Button>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#065F46]/20 text-[#34D399] border border-[#059669]/40 rounded-md text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Rank #{rank}
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleAddToPreferences(intern.id)}
                      className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Choice
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={!!selectedInternship}
        onClose={() => setSelectedInternship(null)}
        title={selectedInternship?.title || 'Internship Details'}
        description={`${selectedInternship?.companyName || 'Corporate Partner'} • Internship Specification`}
        maxWidth="xl"
      >
        {selectedInternship && (
          <div className="space-y-4 text-sm text-[#F8FAFC]">
            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-md border border-[#334155]">
              <div>
                <h4 className="font-bold text-[#F8FAFC] text-base">{selectedInternship.companyName}</h4>
                <p className="text-xs text-[#94A3B8]">{selectedInternship.location} • {selectedInternship.mode}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#94A3B8] block">Monthly Stipend</span>
                <span className="text-base font-bold text-[#34D399]">
                  ₹{selectedInternship.stipend.toLocaleString()}/mo
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Full Description &amp; Scope
              </h5>
              <p className="text-xs text-[#CBD5E1] leading-relaxed bg-[#0F172A] p-3 rounded-md border border-[#334155]">
                {selectedInternship.description}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Required Technical Proficiencies
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedInternship.requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 bg-[#0F172A] text-[#38BDF8] text-xs font-medium rounded border border-[#334155]"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-[#0F172A] rounded-md border border-[#334155]">
              <div>
                <span className="text-[#94A3B8]">Minimum Academic CGPA:</span>
                <p className="font-bold text-[#38BDF8]">≥ {selectedInternship.minimumCGPA.toFixed(1)}</p>
              </div>
              <div>
                <span className="text-[#94A3B8]">Total Available Seats:</span>
                <p className="font-bold text-[#F8FAFC]">{selectedInternship.totalSeats} seats</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#334155]">
              <Button variant="outline" onClick={() => setSelectedInternship(null)}>
                Close
              </Button>
              {!isAlreadyPreferred(selectedInternship.id) && (
                <Button
                  className="bg-[#0284C7] hover:bg-[#0369A1] text-white"
                  onClick={() => {
                    handleAddToPreferences(selectedInternship.id);
                    setSelectedInternship(null);
                  }}
                >
                  Add to My Preferences
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
