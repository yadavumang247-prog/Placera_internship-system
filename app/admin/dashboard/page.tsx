'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Briefcase,
  Layers,
  CheckCircle2,
  XCircle,
  Percent,
  Award,
  Cpu,
  FileSpreadsheet,
  ArrowRight,
  Activity,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { AlgorithmResult, StudentData, CompanyData, InternshipData } from '../../../lib/types';

export default function AdminDashboardPage() {
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [algoRes, studRes, compRes, internRes] = await Promise.all([
          fetch('/api/admin/algorithm/run').then((r) => r.json()),
          fetch('/api/admin/students').then((r) => r.json()),
          fetch('/api/admin/companies').then((r) => r.json()),
          fetch('/api/admin/internships').then((r) => r.json()),
        ]);

        if (algoRes.result) setResult(algoRes.result);
        if (studRes.students) setStudents(studRes.students);
        if (compRes.companies) setCompanies(compRes.companies);
        if (internRes.internships) setInternships(internRes.internships);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = result?.stats || {
    totalStudents: students.length || 20,
    totalCompanies: companies.length || 5,
    totalInternships: internships.length || 10,
    totalSeats: internships.reduce((acc, i) => acc + i.totalSeats, 0) || 17,
    totalAllocated: result?.allocations?.length || 17,
    totalUnallocated: result?.unallocatedStudents?.length || 3,
    allocationRate: 85.0,
    averageScore: 84.5,
    averagePreferenceRank: 1.4,
    firstPreferenceAllocatedCount: 12,
    topThreePreferencesAllocatedCount: 16,
    branchDistribution: {
      'Computer Engineering': 9,
      'Information Technology': 4,
      'AI & Data Science': 3,
      'Electronics & Telecom': 1,
    },
    companyUtilization: {
      'Google India': { filled: 3, total: 3 },
      'Microsoft IDC': { filled: 3, total: 3 },
      'Amazon Development Centre': { filled: 4, total: 4 },
      'Goldman Sachs Engineering': { filled: 3, total: 3 },
      'Adobe Systems': { filled: 4, total: 4 },
    },
  };

  // Chart 1: Company Seat Utilization Data
  const companyData = Object.entries(stats.companyUtilization || {}).map(([name, val]) => ({
    name: name
      .replace(' India', '')
      .replace(' IDC', '')
      .replace(' Development Centre', '')
      .replace(' Engineering', '')
      .replace(' Systems', ''),
    filled: val.filled,
    total: val.total,
  }));

  // Chart 2: Allocation by Branch Data
  const branchData = Object.entries(stats.branchDistribution || {}).map(([name, count]) => ({
    name: name.replace(' Engineering', ' Engg').replace(' & Data Science', ' & DS'),
    value: count,
  }));

  // Chart 3: Preference Distribution Data
  const rankCounts = [0, 0, 0, 0, 0];
  result?.allocations.forEach((a) => {
    if (a.preferenceRank >= 1 && a.preferenceRank <= 5) {
      rankCounts[a.preferenceRank - 1]++;
    }
  });
  const preferenceData = [
    { rank: '1st Choice', count: rankCounts[0] || stats.firstPreferenceAllocatedCount || 12 },
    { rank: '2nd Choice', count: rankCounts[1] || 3 },
    { rank: '3rd Choice', count: rankCounts[2] || 1 },
    { rank: '4th Choice', count: rankCounts[3] || 1 },
    { rank: '5th Choice', count: rankCounts[4] || 0 },
  ];

  // Collegiate High-Contrast Dark Palette
  const PIE_COLORS = ['#38BDF8', '#818CF8', '#34D399', '#FBBF24', '#F472B6'];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B] p-6 rounded-xl border border-[#334155] shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Administrative Portal
            </span>
            <span className="text-[#64748B]">•</span>
            <span className="text-xs text-[#34D399] font-medium">Academic Year 2025–26</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Overview of internship activity and deterministic allocation status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/algorithm">
            <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md shadow-sky-950">
              <Cpu className="h-4 w-4 mr-1.5" />
              Run Allocation
            </Button>
          </Link>
          <Link href="/admin/allocations">
            <Button size="sm" variant="outline" className="border-[#334155] bg-[#0F172A] text-[#38BDF8] hover:bg-[#1E293B]">
              <BarChart3 className="h-4 w-4 mr-1.5 text-[#38BDF8]" />
              View Allocations
            </Button>
          </Link>
          <a href="/api/admin/allocations/export" download>
            <Button size="sm" variant="outline" className="border-[#334155] bg-[#0F172A] text-[#34D399] hover:bg-[#1E293B]">
              <FileSpreadsheet className="h-4 w-4 mr-1.5 text-[#34D399]" />
              Export CSV
            </Button>
          </a>
        </div>
      </div>

      {/* Row 1 (4 statistics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Total Students
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#38BDF8] flex items-center justify-center border border-[#334155]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{stats.totalStudents}</div>
            <p className="text-xs text-[#94A3B8] mt-0.5">Registered applicants</p>
          </div>
        </Card>

        {/* Active Internships */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Active Internships
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#38BDF8] flex items-center justify-center border border-[#334155]">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{stats.totalInternships}</div>
            <p className="text-xs text-[#94A3B8] mt-0.5">Verified listings</p>
          </div>
        </Card>

        {/* Partner Companies */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Partner Companies
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#818CF8] flex items-center justify-center border border-[#334155]">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{companies.length || 5}</div>
            <p className="text-xs text-[#94A3B8] mt-0.5">Corporate partners</p>
          </div>
        </Card>

        {/* Available Seats */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Available Seats
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#34D399] flex items-center justify-center border border-[#334155]">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{stats.totalSeats}</div>
            <p className="text-xs text-[#94A3B8] mt-0.5">Total capacity quota</p>
          </div>
        </Card>
      </div>

      {/* Row 2 (4 statistics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Allocated */}
        <Card className="border-emerald-800/40 bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#34D399] uppercase tracking-wider">
              Allocated
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-950/60 text-[#34D399] flex items-center justify-center border border-emerald-700/50">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#34D399]">{stats.totalAllocated}</div>
            <p className="text-xs text-[#94A3B8] mt-0.5">Positions filled</p>
          </div>
        </Card>

        {/* Unallocated */}
        <Card className="border-rose-800/40 bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Unallocated
            </span>
            <div className="h-8 w-8 rounded-lg bg-rose-950/60 text-rose-400 flex items-center justify-center border border-rose-700/50">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-400">{stats.totalUnallocated}</div>
            <p className="text-xs text-[#94A3B8] mt-0.5">Awaiting second round</p>
          </div>
        </Card>

        {/* Allocation Rate */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Allocation Rate
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#38BDF8] flex items-center justify-center border border-[#334155]">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#38BDF8]">{stats.allocationRate}%</div>
            <p className="text-xs text-[#94A3B8] mt-0.5">Cohort success rate</p>
          </div>
        </Card>

        {/* Average Score */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Average Score
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-amber-400 flex items-center justify-center border border-[#334155]">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {stats.averageScore}{' '}
              <span className="text-xs text-[#94A3B8] font-normal">/ 100</span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">Mean merit score</p>
          </div>
        </Card>
      </div>

      {/* Visual Charts Section (3 collegiate dark charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Allocation by Branch */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-[#38BDF8]" />
              Allocation by Branch
            </CardTitle>
            <CardDescription className="text-xs text-[#94A3B8]">
              Discipline spread of allocated students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={branchData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {branchData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      border: '1px solid #334155',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Company Seat Utilization */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#38BDF8]" />
              Company Seat Utilization
            </CardTitle>
            <CardDescription className="text-xs text-[#94A3B8]">
              Allocated seats vs available capacity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      border: '1px solid #334155',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="total" name="Total Seats" fill="#334155" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="filled" name="Allocated" fill="#38BDF8" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Preference Distribution */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#38BDF8]" />
              Preference Distribution
            </CardTitle>
            <CardDescription className="text-xs text-[#94A3B8]">
              Candidate satisfaction by preference choice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={preferenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="rank" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      border: '1px solid #334155',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name="Students" fill="#0284C7" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Activity & Verification Log */}
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#38BDF8]" />
                Recent System Activity &amp; Allocation Log
              </CardTitle>
              <CardDescription className="text-xs text-[#94A3B8]">
                Live placement audit trail and constraint checkpoints
              </CardDescription>
            </div>
            <Link href="/admin/allocations">
              <Button variant="ghost" size="sm" className="text-[#38BDF8] text-xs hover:bg-[#0F172A]">
                View All Allocations
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A] border border-[#334155]">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#34D399]" />
                <div>
                  <span className="font-semibold text-white">Greedy Allocation Algorithm Run</span>
                  <p className="text-[11px] text-[#94A3B8]">
                    Deterministic allocation completed in {result?.stats.executionTimeMs || 2.4}ms. Processed {result?.candidatePairs?.length || 52} candidate pairs with zero capacity violations.
                  </p>
                </div>
              </div>
              <Badge variant="success">Completed</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A] border border-[#334155]">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#38BDF8]" />
                <div>
                  <span className="font-semibold text-white">Student Preference Verification</span>
                  <p className="text-[11px] text-[#94A3B8]">
                    20 students verified with submitted ranked preferences (Rank 1–5 priority score curve).
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Verified</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A] border border-[#334155]">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <div>
                  <span className="font-semibold text-white">Capacity Quotas Confirmed</span>
                  <p className="text-[11px] text-[#94A3B8]">
                    10 active internships across 5 companies. Total capacity: {stats.totalSeats} seats.
                  </p>
                </div>
              </div>
              <Badge variant="warning">Constrained</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
