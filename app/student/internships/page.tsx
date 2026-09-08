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
  Layers,
  Sparkles,
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            Browse Verified Internships
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore industry opportunities, review required skills, and add desired positions to your ranking list.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/student/preferences">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              Manage Rankings ({preferences.length}/5)
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Mode Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Work Modes</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>

            {/* Min Stipend Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Min Stipend:</span>
              <select
                value={minStipendFilter}
                onChange={(e) => setMinStipendFilter(Number(e.target.value))}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={0}>Any Stipend</option>
                <option value={50000}>≥ ₹50,000 / mo</option>
                <option value={70000}>≥ ₹70,000 / mo</option>
                <option value={80000}>≥ ₹80,000 / mo</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map((intern) => {
          const isSelected = isAlreadyPreferred(intern.id);

          return (
            <Card
              key={intern.id}
              className="flex flex-col justify-between hover:shadow-card-hover transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">{intern.title}</h3>
                    <p className="text-xs text-indigo-600 font-semibold">{intern.companyName}</p>
                  </div>
                  <Badge variant="primary" size="sm">
                    {intern.mode}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {intern.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {intern.duration}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {intern.description}
                </p>

                {/* Key Skills */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Required Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {intern.requiredSkills.map((sk) => (
                      <span key={sk} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Eligibility & Seats */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center mb-4">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Min CGPA</span>
                    <p className="text-xs font-bold text-slate-800">≥ {intern.minimumCGPA.toFixed(1)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Stipend</span>
                    <p className="text-xs font-bold text-emerald-700">₹{(intern.stipend / 1000).toFixed(0)}k/m</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Seats</span>
                    <p className="text-xs font-bold text-indigo-600">{intern.totalSeats}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInternship(intern)}
                  className="text-xs"
                >
                  View Details
                </Button>

                {isSelected ? (
                  <Badge variant="success" size="sm" className="px-3 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    In Preferences
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleAddToPreferences(intern.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Choice
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={!!selectedInternship}
        onClose={() => setSelectedInternship(null)}
        title={selectedInternship?.title || 'Internship Details'}
        maxWidth="xl"
      >
        {selectedInternship && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h4 className="font-bold text-slate-900 text-base">{selectedInternship.companyName}</h4>
                <p className="text-xs text-slate-500">{selectedInternship.location} • {selectedInternship.mode}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Monthly Stipend</span>
                <span className="text-lg font-bold font-mono text-emerald-700">
                  ₹{selectedInternship.stipend.toLocaleString()}/mo
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Description &amp; Scope
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                {selectedInternship.description}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Required Technical Proficiencies
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedInternship.requiredSkills.map((sk) => (
                  <Badge key={sk} variant="primary">
                    {sk}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400">Minimum Academic CGPA:</span>
                <p className="font-bold text-slate-900 font-mono">≥ {selectedInternship.minimumCGPA}</p>
              </div>
              <div>
                <span className="text-slate-400">Total Available Seats:</span>
                <p className="font-bold text-slate-900 font-mono">{selectedInternship.totalSeats} seats</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedInternship(null)}>
                Close
              </Button>
              {!isAlreadyPreferred(selectedInternship.id) && (
                <Button
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
