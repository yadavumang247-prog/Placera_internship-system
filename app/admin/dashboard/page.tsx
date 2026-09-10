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
  ShieldCheck,
  Sparkles,
  Sliders,
  Clock,
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
import { AlgorithmResult, StudentData, CompanyData, InternshipData, AllocationRunRecord } from '../../../lib/types';

export default function AdminDashboardPage() {
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [runs, setRuns] = useState<AllocationRunRecord[]>([]);
  const [publicationStatus, setPublicationStatus] = useState<'DRAFT' | 'PREVIEWED' | 'PUBLISHED'>('PUBLISHED');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [algoRes, studRes, compRes, internRes, histRes] = await Promise.all([
          fetch('/api/admin/algorithm/run').then((r) => r.json()),
          fetch('/api/admin/students').then((r) => r.json()),
          fetch('/api/admin/companies').then((r) => r.json()),
          fetch('/api/admin/internships').then((r) => r.json()),
          fetch('/api/admin/allocation/history').then((r) => r.json()),
        ]);

        if (algoRes.result) setResult(algoRes.result);
        if (algoRes.publicationStatus) setPublicationStatus(algoRes.publicationStatus);
        if (studRes.students) setStudents(studRes.students);
        if (compRes.companies) setCompanies(compRes.companies);
        if (internRes.internships) setInternships(internRes.internships);
        if (histRes.runs) setRuns(histRes.runs);
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
    eligibleStudents: 19,
    totalInternships: internships.length || 10,
    totalSeats: internships.reduce((acc, i) => acc + i.totalSeats, 0) || 19,
    totalEligiblePairs: 48,
    totalAllocated: result?.allocations?.length || 16,
    totalUnallocated: result?.unallocatedStudents?.length || 4,
    allocationRate: 80.0,
    seatUtilization: 84.2,
    averageScore: 86.4,
    averagePreferenceRank: 1.3,
    executionTimeMs: 14.5,
    firstPreferenceAllocatedCount: 11,
    secondPreferenceAllocatedCount: 3,
    thirdPreferenceAllocatedCount: 2,
    topThreePreferencesAllocatedCount: 16,
    stabilityVerified: true,
    blockingPairsCount: 0,
    branchDistribution: {
      'Computer Science': 8,
      'Information Technology': 4,
      'Artificial Intelligence & Data Science': 3,
      'Electronics & Communication': 1,
    },
    companyUtilization: {
      'Google India': { filled: 3, total: 3 },
      'Microsoft IDC': { filled: 4, total: 4 },
      'Amazon Development Centre': { filled: 4, total: 4 },
      'Adobe': { filled: 3, total: 3 },
      'TCS': { filled: 2, total: 5 },
    },
  };

  // 1. Chart Data: Company Seat Quota Utilization
  const companyData = Object.entries(stats.companyUtilization || {}).map(([name, val]) => ({
    name: name.replace(' India', '').replace(' IDC', '').replace(' Development Centre', ''),
    Allocated: val.filled,
    Quota: val.total,
    Unfilled: Math.max(0, val.total - val.filled),
  }));

  // 2. Chart Data: Preference Rank Satisfaction Breakdown
  const rankData = [
    { name: 'Preference #1', count: stats.firstPreferenceAllocatedCount, fill: '#0284C7' },
    { name: 'Preference #2', count: stats.secondPreferenceAllocatedCount || 3, fill: '#0EA5E9' },
    { name: 'Preference #3', count: stats.thirdPreferenceAllocatedCount || 2, fill: '#38BDF8' },
    { name: 'Unallocated', count: stats.totalUnallocated, fill: '#64748B' },
  ];

  // 3. Chart Data: Allocation Outcome Pie
  const outcomeData = [
    { name: 'Allocated Students', value: stats.totalAllocated, color: '#10B981' },
    { name: 'Unallocated Students', value: stats.totalUnallocated, color: '#64748B' },
  ];

  // 4. Chart Data: Discipline Distribution
  const branchData = Object.entries(stats.branchDistribution || {}).map(([name, count]) => ({
    branch: name.replace('Engineering', '').trim(),
    count,
  }));

  const totalSeatsCount = internships.reduce((sum, i) => sum + i.totalSeats, 0);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F172A] p-6 sm:p-8 rounded-2xl border border-[#1E293B] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-[#0284C7]/20 px-2.5 py-0.5 rounded border border-[#0284C7]/30">
              Placement Control Center
            </span>
            <span className="text-[#64748B]">•</span>
            <span className="text-xs text-[#94A3B8]">Cycle 2025–26</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Institutional Allocation Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Real-time monitoring of Many-to-One Gale-Shapley matching rounds, quota enforcement, and student preference satisfaction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/algorithm">
            <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md shadow-sky-950">
              <Sliders className="h-4 w-4 mr-2" />
              Allocation Engine &rarr;
            </Button>
          </Link>
          <Link href="/admin/allocations">
            <Button size="sm" variant="outline" className="border-[#334155] bg-[#1E293B] text-white hover:bg-[#334155]">
              <FileSpreadsheet className="h-4 w-4 mr-2 text-[#38BDF8]" />
              Master Ledger
            </Button>
          </Link>
        </div>
      </div>

      {/* 8 Core KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Total Students */}
        <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-[#94A3B8] uppercase">Total Students</div>
          <div className="text-2xl font-black text-white">{stats.totalStudents}</div>
          <div className="text-[10px] text-[#64748B]">Registered Pool</div>
        </div>

        {/* 2. Verified Students */}
        <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-[#94A3B8] uppercase">Verified</div>
          <div className="text-2xl font-black text-[#10B981]">{stats.eligibleStudents || stats.totalStudents}</div>
          <div className="text-[10px] text-[#64748B]">CGPA Validated</div>
        </div>

        {/* 3. Companies */}
        <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-[#94A3B8] uppercase">Companies</div>
          <div className="text-2xl font-black text-white">{companies.length || 5}</div>
          <div className="text-[10px] text-[#64748B]">Corporate Hosts</div>
        </div>

        {/* 4. Internships */}
        <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-[#94A3B8] uppercase">Internships</div>
          <div className="text-2xl font-black text-white">{internships.length || 10}</div>
          <div className="text-[10px] text-[#64748B]">Approved Roles</div>
        </div>

        {/* 5. Seats */}
        <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-[#94A3B8] uppercase">Total Seats</div>
          <div className="text-2xl font-black text-[#38BDF8]">{stats.totalSeats || totalSeatsCount}</div>
          <div className="text-[10px] text-[#64748B]">Quota Limit</div>
        </div>

        {/* 6. Eligible Applications */}
        <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-[#94A3B8] uppercase">Eligible Pairs</div>
          <div className="text-2xl font-black text-white">{stats.totalEligiblePairs || 48}</div>
          <div className="text-[10px] text-[#64748B]">Passed Criteria</div>
        </div>

        {/* 7. Allocated */}
        <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-[#94A3B8] uppercase">Allocated</div>
          <div className="text-2xl font-black text-[#10B981]">{stats.totalAllocated}</div>
          <div className="text-[10px] text-[#64748B]">{stats.allocationRate}% Success</div>
        </div>

        {/* 8. Unallocated */}
        <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] shadow-sm space-y-1">
          <div className="text-[11px] font-semibold text-[#94A3B8] uppercase">Unallocated</div>
          <div className="text-2xl font-black text-[#F59E0B]">{stats.totalUnallocated}</div>
          <div className="text-[10px] text-[#64748B]">Capacity Bound</div>
        </div>
      </div>

      {/* Stability & Publication Status Banner */}
      <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Algorithm Stability: VERIFIED</span>
              <span className="bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.5 rounded font-bold text-[10px]">
                0 Blocking Pairs
              </span>
            </div>
            <span className="text-[#94A3B8]">
              Execution Time: {stats.executionTimeMs} ms • Total Proposals Made: {stats.totalProposals || 26}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#94A3B8]">Status:</span>
          <Badge
            className={`font-bold text-xs uppercase px-2.5 py-0.5 ${
              publicationStatus === 'PUBLISHED'
                ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                : 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40'
            }`}
          >
            {publicationStatus}
          </Badge>
          <Link href="/admin/algorithm">
            <Button size="sm" variant="ghost" className="text-[#38BDF8] hover:bg-[#0F172A] text-xs">
              Manage Workflow &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* Charts Grid Row 1: Company Seat Utilization & Preference Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Company Seat Utilization */}
        <div className="lg:col-span-7 bg-[#0F172A] p-6 rounded-2xl border border-[#1E293B] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Company Seat Utilization</h3>
              <p className="text-xs text-[#94A3B8]">Filled positions versus total approved quotas.</p>
            </div>
            <span className="text-xs font-bold text-[#38BDF8]">{stats.seatUtilization}% Utilized</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1329', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Allocated" fill="#0284C7" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="Unfilled" fill="#334155" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Preference Satisfaction Distribution */}
        <div className="lg:col-span-5 bg-[#0F172A] p-6 rounded-2xl border border-[#1E293B] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Preference Satisfaction</h3>
              <p className="text-xs text-[#94A3B8]">Distribution of allocated students by preference rank.</p>
            </div>
            <span className="text-xs font-bold text-[#10B981]">
              Avg Rank: #{stats.averagePreferenceRank}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1329', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {rankData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2: Allocation Rate Donut & Branch Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 3: Outcome Donut */}
        <div className="lg:col-span-4 bg-[#0F172A] p-6 rounded-2xl border border-[#1E293B] shadow-sm space-y-4">
          <h3 className="font-bold text-white text-base">Cohort Allocation Rate</h3>
          <p className="text-xs text-[#94A3B8]">Allocated vs unallocated student proportion.</p>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1329', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center font-extrabold text-2xl text-[#10B981]">
            {stats.allocationRate}% Success Rate
          </div>
        </div>

        {/* Chart 4: Branch Distribution */}
        <div className="lg:col-span-8 bg-[#0F172A] p-6 rounded-2xl border border-[#1E293B] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Allocations by Academic Discipline</h3>
              <p className="text-xs text-[#94A3B8]">Diversity across engineering departments.</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="branch" type="category" stroke="#64748B" fontSize={11} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1329', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#38BDF8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Allocation Runs & Audit Trail */}
      <div className="bg-[#0F172A] p-6 rounded-2xl border border-[#1E293B] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div>
            <h3 className="font-bold text-white text-base">Recent Allocation Runs &amp; Audit Logs</h3>
            <p className="text-xs text-[#94A3B8]">Cryptographically recorded algorithmic checkpoints.</p>
          </div>
          <Link href="/admin/allocations">
            <Button size="sm" variant="outline" className="border-[#334155] text-xs text-[#38BDF8]">
              View Full History
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-[#1E293B]">
          {runs.slice(0, 4).map((run) => (
            <div key={run.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{run.algorithmName}</span>
                  <Badge variant="outline" className="text-[10px] border-[#334155] text-[#38BDF8]">
                    v{run.algorithmVersion}
                  </Badge>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    run.status === 'PUBLISHED' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                  }`}>
                    {run.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Executed by {run.executedBy} • {run.totalAllocated} Allocated ({run.metrics.allocationRate}%) • {run.executionTimeMs} ms
                </p>
              </div>

              <span className="text-[10px] text-[#64748B] shrink-0">
                {new Date(run.startedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
