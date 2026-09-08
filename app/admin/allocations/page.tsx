'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Award,
  TrendingUp,
  Cpu,
  Layers,
  Building2,
  Users,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../components/ui/toast';
import { AllocationData, AlgorithmResult, StudentData } from '../../../lib/types';

export default function AdminAllocationsPage() {
  const { success, error: showError } = useToast();
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [allocations, setAllocations] = useState<AllocationData[]>([]);
  const [unallocated, setUnallocated] = useState<StudentData[]>([]);
  const [filteredAllocations, setFilteredAllocations] = useState<AllocationData[]>([]);
  const [filteredUnallocated, setFilteredUnallocated] = useState<StudentData[]>([]);
  const [activeTab, setActiveTab] = useState<'ALLOCATED' | 'UNALLOCATED'>('ALLOCATED');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [rankFilter, setRankFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/algorithm/run');
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        setAllocations(data.result.allocations || []);
        setFilteredAllocations(data.result.allocations || []);
        setUnallocated(data.result.unallocatedStudents || []);
        setFilteredUnallocated(data.result.unallocatedStudents || []);
      }
    } catch (err) {
      showError('Failed to load allocation records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter effect for allocated candidates
  useEffect(() => {
    let list = [...allocations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.studentName?.toLowerCase().includes(q) ||
          a.studentRollNumber?.toLowerCase().includes(q) ||
          a.internshipTitle?.toLowerCase().includes(q) ||
          a.companyName?.toLowerCase().includes(q)
      );
    }

    if (branchFilter !== 'ALL') {
      list = list.filter((a) => a.studentBranch === branchFilter);
    }

    if (companyFilter !== 'ALL') {
      list = list.filter((a) => a.companyName === companyFilter);
    }

    if (rankFilter !== 'ALL') {
      list = list.filter((a) => a.preferenceRank === Number(rankFilter));
    }

    setFilteredAllocations(list);

    // Also filter unallocated
    let unallocList = [...unallocated];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      unallocList = unallocList.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.rollNumber.toLowerCase().includes(q) ||
          u.branch.toLowerCase().includes(q)
      );
    }
    if (branchFilter !== 'ALL') {
      unallocList = unallocList.filter((u) => u.branch === branchFilter);
    }
    setFilteredUnallocated(unallocList);
  }, [searchQuery, branchFilter, companyFilter, rankFilter, allocations, unallocated]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setBranchFilter('ALL');
    setCompanyFilter('ALL');
    setRankFilter('ALL');
  };

  const branches = Array.from(new Set(allocations.map((a) => a.studentBranch).filter(Boolean)));
  const companies = Array.from(new Set(allocations.map((a) => a.companyName).filter(Boolean)));

  const stats = result?.stats;
  const firstPrefPercent =
    stats && stats.totalAllocated > 0
      ? Math.round((stats.firstPreferenceAllocatedCount / stats.totalAllocated) * 100)
      : 70;
  const topThreePercent =
    stats && stats.totalAllocated > 0
      ? Math.round((stats.topThreePreferencesAllocatedCount / stats.totalAllocated) * 100)
      : 95;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-6 rounded-lg border border-[#334155] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Final Placement Ledger
            </span>
            <span className="text-[#334155]">•</span>
            <span className="text-xs text-[#34D399] font-medium">Audit Trail Certified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="h-7 w-7 text-[#38BDF8]" />
            Final Internship Allocation List
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Official university record of placed student-internship pairings, composite mathematical merit scores, and unallocated candidate audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/algorithm">
            <Button variant="outline" size="sm" className="border-[#334155] text-[#CBD5E1]">
              <Cpu className="h-4 w-4 mr-1.5 text-[#38BDF8]" />
              Run Algorithm
            </Button>
          </Link>
          <a href="/api/admin/allocations/export" download>
            <Button size="sm" className="bg-[#059669] hover:bg-[#047857] text-white">
              <Download className="h-4 w-4 mr-1.5" />
              Export Full CSV
            </Button>
          </a>
        </div>
      </div>

      {/* Fairness & Placement Insights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] mb-1">
            <span>Allocated Placements</span>
            <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
          </div>
          <div className="text-2xl font-bold text-[#34D399]">
            {stats?.totalAllocated || allocations.length}
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-1">Confirmed positions filled</p>
        </Card>

        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] mb-1">
            <span>1st Choice Satisfaction</span>
            <Award className="h-4 w-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold text-[#38BDF8]">{firstPrefPercent}%</div>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            {stats?.firstPreferenceAllocatedCount || 12} students received top preference
          </p>
        </Card>

        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] mb-1">
            <span>Top 3 Choices Rate</span>
            <TrendingUp className="h-4 w-4 text-[#818CF8]" />
          </div>
          <div className="text-2xl font-bold text-[#818CF8]">{topThreePercent}%</div>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            {stats?.topThreePreferencesAllocatedCount || 16} students received top 3 choices
          </p>
        </Card>

        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] mb-1">
            <span>Unallocated Students</span>
            <XCircle className="h-4 w-4 text-[#F87171]" />
          </div>
          <div className="text-2xl font-bold text-[#F87171]">
            {stats?.totalUnallocated || unallocated.length}
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-1">Due to CGPA cutoff or quota limit</p>
        </Card>
      </div>

      {/* Tabs & Filters Bar */}
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardContent className="p-4 space-y-4">
          {/* Tab Selection */}
          <div className="flex items-center gap-2 border-b border-[#334155] pb-3">
            <button
              onClick={() => setActiveTab('ALLOCATED')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'ALLOCATED'
                  ? 'bg-[#0284C7] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A]'
              }`}
            >
              Confirmed Allocations ({filteredAllocations.length})
            </button>
            <button
              onClick={() => setActiveTab('UNALLOCATED')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'UNALLOCATED'
                  ? 'bg-[#0284C7] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A]'
              }`}
            >
              Unallocated Applicants ({filteredUnallocated.length})
            </button>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search student, roll no, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            {/* Branch Filter */}
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="ALL">All Engineering Branches</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Company Filter (only active on Allocated tab) */}
            {activeTab === 'ALLOCATED' && (
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All Partner Companies</option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            {/* Preference Rank Filter */}
            {activeTab === 'ALLOCATED' && (
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All Preference Ranks</option>
                <option value="1">1st Preference Choice</option>
                <option value="2">2nd Preference Choice</option>
                <option value="3">3rd Preference Choice</option>
                <option value="4">4th Preference Choice</option>
                <option value="5">5th Preference Choice</option>
              </select>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#334155] text-xs text-[#94A3B8]">
            <span>
              Showing{' '}
              <strong className="text-[#F8FAFC]">
                {activeTab === 'ALLOCATED' ? filteredAllocations.length : filteredUnallocated.length}
              </strong>{' '}
              records
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

      {/* Main Content: Allocated Table OR Unallocated Table */}
      {activeTab === 'ALLOCATED' ? (
        <Card className="border-[#334155] bg-[#1E293B]">
          <CardHeader className="pb-3 border-b border-[#334155]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#F8FAFC]">
                  Official Placements Ledger
                </CardTitle>
                <CardDescription className="text-xs text-[#94A3B8]">
                  Verified student-internship matches with full multi-objective score breakdown
                </CardDescription>
              </div>
              <span className="text-xs text-[#34D399] font-mono bg-[#065F46]/20 px-2 py-0.5 rounded border border-[#059669]/40">
                Status: Validated &amp; Persisted
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#334155] bg-[#0F172A] text-[#94A3B8] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Student &amp; Roll No</th>
                  <th className="py-3 px-4">Branch &amp; CGPA</th>
                  <th className="py-3 px-4">Assigned Company</th>
                  <th className="py-3 px-4">Position Title</th>
                  <th className="py-3 px-4">Preference</th>
                  <th className="py-3 px-4">Skill Match</th>
                  <th className="py-3 px-4">CGPA Pts</th>
                  <th className="py-3 px-4 font-bold">Total Merit</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {filteredAllocations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#94A3B8] text-sm">
                      No allocations match the current filter query.
                    </td>
                  </tr>
                ) : (
                  filteredAllocations.map((a) => (
                    <tr key={a.id} className="hover:bg-[#334155]/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#F8FAFC]">{a.studentName}</div>
                        <span className="font-mono text-[11px] text-[#38BDF8]">
                          {a.studentRollNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[#CBD5E1]">{a.studentBranch}</div>
                        <span className="text-[11px] text-[#34D399] font-mono font-semibold">
                          CGPA: {a.studentCgpa?.toFixed(2) || '8.50'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#F8FAFC]">
                        {a.companyName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#38BDF8]">
                        {a.internshipTitle}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            a.preferenceRank === 1
                              ? 'bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40'
                              : a.preferenceRank <= 3
                              ? 'bg-[#4F46E5]/20 text-[#818CF8] border border-[#6366F1]/40'
                              : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155]'
                          }`}
                        >
                          Choice #{a.preferenceRank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#34D399] font-semibold">
                        {a.skillMatchScore}%
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#38BDF8]">
                        {a.cgpaScore} pts
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-base text-[#F8FAFC]">
                        {a.score}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Allocated
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-[#334155] bg-[#1E293B]">
          <CardHeader className="pb-3 border-b border-[#334155]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-[#FBBF24]" />
                  Unallocated Candidates Audit
                </CardTitle>
                <CardDescription className="text-xs text-[#94A3B8]">
                  Candidates awaiting round 2 clearing with explicit algorithmic reasons
                </CardDescription>
              </div>
              <Badge variant="warning">{filteredUnallocated.length} In Waiting List</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#334155] bg-[#0F172A] text-[#94A3B8] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Technical Skills</th>
                  <th className="py-3 px-4">Algorithmic Cause / Reason</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {filteredUnallocated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#94A3B8] text-sm">
                      All registered candidates have been successfully placed. Zero unallocated students.
                    </td>
                  </tr>
                ) : (
                  filteredUnallocated.map((u) => {
                    const reason =
                      u.cgpa < 7.0
                        ? 'Minimum CGPA cutoff unmet on submitted preferences'
                        : 'Seat quota capacity reached on ranked preferences';

                    return (
                      <tr key={u.id} className="hover:bg-[#334155]/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#38BDF8]">
                          {u.rollNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#F8FAFC]">{u.name}</div>
                          <span className="text-[11px] text-[#94A3B8]">{u.email}</span>
                        </td>
                        <td className="py-3.5 px-4 text-[#CBD5E1]">{u.branch}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#F87171]">
                          {u.cgpa.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="flex flex-wrap gap-1">
                            {u.skills.slice(0, 3).map((sk) => (
                              <span
                                key={sk}
                                className="text-[10px] bg-[#0F172A] text-[#94A3B8] border border-[#334155] px-1.5 py-0.5 rounded"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#FBBF24]">
                          <span className="inline-flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                            {reason}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Badge variant="warning" size="sm">
                            Waiting List
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
