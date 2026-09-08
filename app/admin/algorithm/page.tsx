'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Play,
  CheckCircle2,
  Sliders,
  Clock,
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../components/ui/toast';
import { AlgorithmResult, CandidatePair } from '../../../lib/types';

export default function AdminAlgorithmSimulationPage() {
  const { success, error: showError } = useToast();

  // Algorithm Weights State
  const [prefWeight, setPrefWeight] = useState(0.40);
  const [cgpaWeight, setCgpaWeight] = useState(0.30);
  const [skillWeight, setSkillWeight] = useState(0.30);
  const [minSkillRatio, setMinSkillRatio] = useState(0.0);

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [searchPair, setSearchPair] = useState('');
  const [filterPairStatus, setFilterPairStatus] = useState<'ALL' | 'ALLOCATED' | 'REJECTED'>('ALL');

  const stages = [
    { name: 'Input Initialization', desc: 'Fetching 20 students and 10 internships' },
    { name: 'Eligibility Filtering', desc: 'Pruning CGPA < cutoff and expired deadlines' },
    { name: 'Preference Scoring', desc: 'Calculating rank points (100–60 pts)' },
    { name: 'Multi-Objective Scoring', desc: 'Computing weighted composite score S' },
    { name: 'Deterministic Sorting', desc: 'Applying O(N log N) multi-criteria comparator' },
    { name: 'Greedy Allocation', desc: 'Enforcing seat quotas and 1-per-student limit' },
  ];

  const loadLatest = async () => {
    try {
      const res = await fetch('/api/admin/algorithm/run');
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        if (data.result.weights) {
          setPrefWeight(data.result.weights.preferenceWeight ?? 0.40);
          setCgpaWeight(data.result.weights.cgpaWeight ?? 0.30);
          setSkillWeight(data.result.weights.skillWeight ?? 0.30);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLatest();
  }, []);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setActiveStage(1);

    // Visual animated progression through stages
    for (let i = 1; i <= stages.length; i++) {
      setActiveStage(i);
      await new Promise((r) => setTimeout(r, 220));
    }

    try {
      const res = await fetch('/api/admin/algorithm/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferenceWeight: prefWeight,
          cgpaWeight: cgpaWeight,
          skillWeight: skillWeight,
          minSkillMatchRatio: minSkillRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data.result);
      success('AOA Allocation Algorithm executed successfully!');
    } catch (err: any) {
      showError(err.message || 'Simulation run failed');
    } finally {
      setIsRunning(false);
      setActiveStage(0);
    }
  };

  const handleResetWeights = () => {
    setPrefWeight(0.40);
    setCgpaWeight(0.30);
    setSkillWeight(0.30);
    setMinSkillRatio(0.0);
  };

  // Filter candidate pairs
  const candidatePairs = result?.candidatePairs || [];
  const filteredPairs = candidatePairs.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchPair.toLowerCase()) ||
      p.studentRollNumber.toLowerCase().includes(searchPair.toLowerCase()) ||
      p.internshipTitle.toLowerCase().includes(searchPair.toLowerCase()) ||
      p.companyName.toLowerCase().includes(searchPair.toLowerCase());

    const matchesStatus =
      filterPairStatus === 'ALL'
        ? true
        : filterPairStatus === 'ALLOCATED'
        ? p.allocated
        : !p.allocated;

    return matchesSearch && matchesStatus;
  });

  const totalWeight = Math.round((prefWeight + cgpaWeight + skillWeight) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-indigo-600" />
            AOA Algorithm Simulation Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure multi-objective weight parameters, execute live allocation, and inspect candidate pair decision trees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/algorithm-explanation">
            <Button variant="outline" size="sm">
              Algorithm Math Proof
            </Button>
          </Link>
          <Link href="/admin/allocations">
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-1 text-emerald-600" />
              View Allocations
            </Button>
          </Link>
        </div>
      </div>

      {/* Weights Tuning & Execution Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sliders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-indigo-600" />
                  Multi-Objective Scoring Weights
                </CardTitle>
                <CardDescription className="text-xs">
                  Weights dictate the proportional influence of preference, academic CGPA, and technical skills.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleResetWeights} className="text-xs text-slate-500">
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset Defaults
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preference Weight */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">1. Student Preference Weight (w_pref)</span>
                <span className="font-mono font-bold text-indigo-600">{(prefWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={prefWeight}
                onChange={(e) => setPrefWeight(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <p className="text-[11px] text-slate-400">
                Awards up to 100 points for student 1st choice, 90 for 2nd choice, 80 for 3rd choice.
              </p>
            </div>

            {/* CGPA Weight */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">2. Academic CGPA Weight (w_cgpa)</span>
                <span className="font-mono font-bold text-blue-600">{(cgpaWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={cgpaWeight}
                onChange={(e) => setCgpaWeight(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <p className="text-[11px] text-slate-400">
                Normalizes student GPA on a 10.0 scale into a 0–100 academic merit factor.
              </p>
            </div>

            {/* Skill Match Weight */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">3. Technical Skill Match Weight (w_skill)</span>
                <span className="font-mono font-bold text-amber-600">{(skillWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={skillWeight}
                onChange={(e) => setSkillWeight(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <p className="text-[11px] text-slate-400">
                Measures the percentage of required tools &amp; frameworks matched by the student profile.
              </p>
            </div>

            {/* Total Weight Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">Sum of Configured Weights:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded ${
                  totalWeight === 100
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {totalWeight}% (Normalized dynamically)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Trigger Action & Metrics */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Execute Live Allocation
            </CardTitle>
            <CardDescription className="text-xs">
              Runs the deterministic optimization algorithm and persists allocation decisions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Algorithm:</span>
                <span className="text-white font-mono">Constrained Greedy</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Time Complexity:</span>
                <span className="text-indigo-400 font-mono">O(SI log(SI))</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last Execution Time:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {result?.stats.executionTimeMs || 2.4} ms
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Allocation Rate:</span>
                <span className="text-amber-400 font-mono font-bold">
                  {result?.stats.allocationRate || 85}%
                </span>
              </div>
            </div>

            <Button
              onClick={handleRunSimulation}
              isLoading={isRunning}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100"
            >
              <Play className="h-4 w-4 mr-2 fill-current" />
              Run Allocation Algorithm
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Visualization of Pipeline Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600" />
            Interactive Execution Pipeline Stages
          </CardTitle>
          <CardDescription className="text-xs">
            Visual progression of candidate generation, multi-tier ranking, and constraint resolution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {stages.map((stg, idx) => {
              const isCurrent = activeStage === idx + 1;
              const isPast = activeStage > idx + 1 || (activeStage === 0 && result !== null);

              return (
                <div
                  key={stg.name}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-md'
                      : isPast
                      ? 'border-slate-200 bg-white'
                      : 'border-slate-100 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      PHASE 0{idx + 1}
                    </span>
                    {isCurrent ? (
                      <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
                    ) : isPast ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : null}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{stg.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">{stg.desc}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Candidate Pairs Decision Inspector */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold">
                Candidate Pairs Decision Inspector ({filteredPairs.length} Pairs)
              </CardTitle>
              <CardDescription className="text-xs">
                Inspect every evaluated (student, internship) pair, its calculated component scores, and allocation verdict.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search candidate or position..."
                value={searchPair}
                onChange={(e) => setSearchPair(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={filterPairStatus}
                onChange={(e) => setFilterPairStatus(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Outcomes</option>
                <option value="ALLOCATED">Allocated Only</option>
                <option value="REJECTED">Skipped / Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Internship &amp; Company</th>
                <th className="py-3 px-4">Preference</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Skill Match</th>
                <th className="py-3 px-4">Composite Score</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Decision Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPairs.map((pair, idx) => (
                <tr
                  key={`${pair.studentId}_${pair.internshipId}_${idx}`}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    pair.allocated ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-slate-900 block">{pair.studentName}</span>
                    <span className="font-mono text-[10px] text-slate-400">{pair.studentRollNumber}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-medium text-slate-800 block">{pair.internshipTitle}</span>
                    <span className="text-[10px] text-indigo-600">{pair.companyName}</span>
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">
                    Choice #{pair.preferenceRank} ({pair.preferenceScore} pts)
                  </td>
                  <td className="py-2.5 px-4 font-mono">
                    {pair.studentCgpa.toFixed(2)} ({pair.cgpaScore} pts)
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-700">
                    {pair.skillMatchScore}%
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-indigo-600 text-sm">
                    {pair.totalScore}
                  </td>
                  <td className="py-2.5 px-4">
                    {pair.allocated ? (
                      <Badge variant="success" size="sm">
                        ALLOCATED
                      </Badge>
                    ) : (
                      <Badge variant="danger" size="sm">
                        SKIPPED
                      </Badge>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-[11px] text-slate-500">
                    {pair.allocated ? (
                      <span className="text-emerald-700 font-medium">Allocated (Highest Available Score)</span>
                    ) : (
                      <span className="text-slate-400">{pair.rejectionReason || 'Capacity filled / Already allocated'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
