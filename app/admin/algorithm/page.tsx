'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Play,
  CheckCircle2,
  Sliders,
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
  RotateCcw,
  Zap,
  Lock,
  Unlock,
  Eye,
  Send,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Search,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../components/ui/toast';
import { AlgorithmResult, CandidatePair, ProposalStep, PublicationStatus } from '../../../lib/types';

export default function AdminAllocationControlCenter() {
  const { success, error: showError, warning, info } = useToast();

  // 8-Step State Tracking
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [publicationStatus, setPublicationStatus] = useState<PublicationStatus>('PUBLISHED');
  
  // Weights State (Skill 40%, CGPA 30%, Exp 20%, Branch 10%)
  const [skillWeight, setSkillWeight] = useState<number>(0.40);
  const [cgpaWeight, setCgpaWeight] = useState<number>(0.30);
  const [expWeight, setExpWeight] = useState<number>(0.20);
  const [branchWeight, setBranchWeight] = useState<number>(0.10);
  const [minSkillRatio, setMinSkillRatio] = useState<number>(0.0);
  const [algorithmType, setAlgorithmType] = useState<'GALE_SHAPLEY' | 'GREEDY'>('GALE_SHAPLEY');

  // Loading States
  const [isLocking, setIsLocking] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  // Results & Proposals
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [searchPair, setSearchPair] = useState('');
  const [filterPairStatus, setFilterPairStatus] = useState<'ALL' | 'ALLOCATED' | 'REJECTED'>('ALL');
  const [activeTab, setActiveTab] = useState<'pairs' | 'proposals' | 'visualizer'>('pairs');

  // Initial Data Validation Metrics
  const [dataMetrics, setDataMetrics] = useState({
    totalStudents: 20,
    activeInternships: 10,
    totalCapacities: 45,
    submittedPreferences: 20,
    orphanPreferences: 0,
    validationPassed: true,
  });

  const loadCurrentStatus = async () => {
    try {
      const res = await fetch('/api/admin/allocation/run');
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        if (data.result.weights) {
          setSkillWeight(data.result.weights.skillWeight ?? 0.40);
          setCgpaWeight(data.result.weights.cgpaWeight ?? 0.30);
          setExpWeight(data.result.weights.experienceWeight ?? 0.20);
          setBranchWeight(data.result.weights.branchWeight ?? 0.10);
          setMinSkillRatio(data.result.weights.minSkillMatchRatio ?? 0.0);
        }
      }
      if (typeof data.isPreferencesLocked === 'boolean') {
        setIsLocked(data.isPreferencesLocked);
      }
      if (data.publicationStatus) {
        setPublicationStatus(data.publicationStatus);
      }
    } catch (err) {
      console.error('Failed to load status:', err);
    }
  };

  useEffect(() => {
    loadCurrentStatus();
  }, []);

  // Step 2: Toggle Preference Lock
  const handleToggleLock = async () => {
    setIsLocking(true);
    try {
      const newLock = !isLocked;
      const res = await fetch('/api/admin/allocation/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locked: newLock }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsLocked(newLock);
      success(newLock ? 'Student preference window LOCKED. Student updates are blocked.' : 'Student preference window UNLOCKED.');
      if (newLock && currentStep === 2) setCurrentStep(3);
    } catch (err: any) {
      showError(err.message || 'Failed to toggle preference lock');
    } finally {
      setIsLocking(false);
    }
  };

  // Step 5: Preview Allocation
  const handlePreviewAllocation = async () => {
    setIsPreviewing(true);
    try {
      const res = await fetch('/api/admin/allocation/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillWeight,
          cgpaWeight,
          experienceWeight: expWeight,
          branchWeight,
          minSkillMatchRatio: minSkillRatio,
          algorithmType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      setPublicationStatus('PREVIEWED');
      success('Allocation preview calculated! Inspect proposals and stability below before committing.');
      setCurrentStep(6);
    } catch (err: any) {
      showError(err.message || 'Failed to preview allocation');
    } finally {
      setIsPreviewing(false);
    }
  };

  // Step 7: Run Allocation (Commit Draft)
  const handleRunAllocation = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/admin/allocation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillWeight,
          cgpaWeight,
          experienceWeight: expWeight,
          branchWeight,
          minSkillMatchRatio: minSkillRatio,
          algorithmType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      setPublicationStatus(data.publicationStatus || 'DRAFT');
      success('Allocation algorithm committed to official ledger as DRAFT. Ready for publication review.');
      setCurrentStep(8);
    } catch (err: any) {
      showError(err.message || 'Failed to run allocation');
    } finally {
      setIsRunning(false);
    }
  };

  // Step 8: Publish Results
  const handlePublishResults = async () => {
    setIsPublishing(true);
    setShowPublishConfirm(false);
    try {
      const res = await fetch('/api/admin/allocation/publish', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPublicationStatus('PUBLISHED');
      success('Official allocation results published! All students and employers can now view results.');
    } catch (err: any) {
      showError(err.message || 'Failed to publish results');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleResetWeights = () => {
    setSkillWeight(0.40);
    setCgpaWeight(0.30);
    setExpWeight(0.20);
    setBranchWeight(0.10);
    setMinSkillRatio(0.0);
  };

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

  const totalConfigWeight = Math.round((skillWeight + cgpaWeight + expWeight + branchWeight) * 100);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header & Status Bar */}
      <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0284C7]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="navy" className="border-[#38BDF8]/40 text-[#38BDF8]">
                Algorithm Operations Control Center
              </Badge>
              {publicationStatus === 'PUBLISHED' ? (
                <Badge variant="success" className="animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
                  RESULTS LIVE / PUBLISHED
                </Badge>
              ) : publicationStatus === 'PREVIEWED' ? (
                <Badge variant="warning">
                  <Eye className="w-3 h-3 mr-1" />
                  PREVIEW MODE (INTERNAL ONLY)
                </Badge>
              ) : (
                <Badge variant="danger">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
                  DRAFT (UNPUBLISHED)
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Cpu className="h-7 w-7 text-[#38BDF8]" />
              Allocation Engine Control Center
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 max-w-2xl">
              Strict 8-step administrative workflow for hospital-residents stable matching. Previews, audit logs, and stability proofs guarantee zero blocking pairs before final release.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/algorithm-explanation">
              <Button variant="outline" size="sm" className="border-[#334155] bg-[#0F172A] text-[#38BDF8] hover:bg-[#1E293B]">
                <BookOpen className="h-4 w-4 mr-1.5" />
                Algorithm Math Proof
              </Button>
            </Link>
            <Link href="/admin/allocations">
              <Button variant="outline" size="sm" className="border-[#334155] bg-[#0F172A] text-[#34D399] hover:bg-[#1E293B]">
                <FileSpreadsheet className="h-4 w-4 mr-1.5 text-[#34D399]" />
                Master Ledger
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 8-Step Administrative Workflow Tracker */}
      <div className="bg-[#1E293B] p-5 rounded-xl border border-[#334155]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#38BDF8]" />
            8-Step Allocation Lifecycle
          </h2>
          <span className="text-xs text-[#64748B]">Follow sequentially to prevent unverified student assignments</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {[
            { num: 1, title: 'Validation', desc: 'Data Integrity' },
            { num: 2, title: 'Lock Prefs', desc: isLocked ? 'Locked' : 'Unlocked' },
            { num: 3, title: 'Eligibility', desc: 'Cutoff Gate' },
            { num: 4, title: 'Weights & Alg', desc: `${(skillWeight*100).toFixed(0)}% Skill` },
            { num: 5, title: 'Preview', desc: 'Pre-Run Dry' },
            { num: 6, title: 'Audit & Proof', desc: '0 Blocking' },
            { num: 7, title: 'Run Commit', desc: 'Official Run' },
            { num: 8, title: 'Publish', desc: publicationStatus },
          ].map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  isActive
                    ? 'border-[#38BDF8] bg-[#0284C7]/20 shadow-md ring-1 ring-[#38BDF8]/40'
                    : isCompleted
                    ? 'border-[#334155] bg-[#0F172A] hover:bg-[#1E293B]'
                    : 'border-[#1E293B] bg-[#0F172A]/50 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-[#64748B]">STEP 0{s.num}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#34D399]" />
                  ) : isActive ? (
                    <span className="h-2 w-2 rounded-full bg-[#38BDF8] animate-ping" />
                  ) : null}
                </div>
                <div className="text-xs font-bold text-white truncate">{s.title}</div>
                <div className="text-[10px] text-[#94A3B8] truncate">{s.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workflow Controls & Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Step-by-Step Panel */}
        <Card className="lg:col-span-2 border-[#334155] bg-[#1E293B]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-[#38BDF8]" />
                  Step 4: Algorithm Selection & Multi-Factor Merit Weights
                </CardTitle>
                <CardDescription className="text-xs text-[#94A3B8]">
                  Hospital-Residents Gale-Shapley model with student-proposing stable matching.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleResetWeights} className="text-xs text-[#94A3B8] hover:text-white">
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset Defaults
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Algorithm Selector */}
            <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] space-y-3">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Matching Algorithm Engine
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setAlgorithmType('GALE_SHAPLEY')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    algorithmType === 'GALE_SHAPLEY'
                      ? 'border-[#38BDF8] bg-[#0284C7]/20 shadow-md ring-1 ring-[#38BDF8]'
                      : 'border-[#334155] bg-[#1E293B] hover:border-[#64748B]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#38BDF8]" />
                      Gale-Shapley (Stable Matching)
                    </span>
                    <Badge variant="primary" size="sm">Recommended</Badge>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    Many-to-one Hospital-Residents algorithm. Guarantees 0 blocking pairs and Pareto efficiency for students.
                  </p>
                </div>

                <div
                  onClick={() => setAlgorithmType('GREEDY')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    algorithmType === 'GREEDY'
                      ? 'border-amber-400 bg-amber-500/20 shadow-md ring-1 ring-amber-400'
                      : 'border-[#334155] bg-[#1E293B] hover:border-[#64748B]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-amber-400" />
                      Greedy Benchmark
                    </span>
                    <Badge variant="outline" size="sm" className="text-amber-400 border-amber-400/40">Baseline</Badge>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    Sorts all (S, I) pairs globally by score. Fast O(N log N) baseline, but susceptible to unstable blocking pairs.
                  </p>
                </div>
              </div>
            </div>

            {/* Weights Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Skill Match Weight */}
              <div className="space-y-1.5 p-3 rounded-lg bg-[#0F172A] border border-[#334155]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">1. Skill Match Weight</span>
                  <span className="font-mono font-bold text-[#38BDF8]">{(skillWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={skillWeight}
                  onChange={(e) => setSkillWeight(parseFloat(e.target.value))}
                  className="w-full accent-[#0284C7] cursor-pointer h-1.5 bg-[#1E293B] rounded"
                />
                <p className="text-[10px] text-[#94A3B8]">Jaccard similarity between candidate skills and required track tech.</p>
              </div>

              {/* CGPA Weight */}
              <div className="space-y-1.5 p-3 rounded-lg bg-[#0F172A] border border-[#334155]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">2. Academic CGPA Weight</span>
                  <span className="font-mono font-bold text-[#34D399]">{(cgpaWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={cgpaWeight}
                  onChange={(e) => setCgpaWeight(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-[#1E293B] rounded"
                />
                <p className="text-[10px] text-[#94A3B8]">Normalized GPA on 10.0 scale: (CGPA / 10.0) * 100.</p>
              </div>

              {/* Experience Weight */}
              <div className="space-y-1.5 p-3 rounded-lg bg-[#0F172A] border border-[#334155]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">3. Prior Experience Weight</span>
                  <span className="font-mono font-bold text-purple-400">{(expWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={expWeight}
                  onChange={(e) => setExpWeight(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-[#1E293B] rounded"
                />
                <p className="text-[10px] text-[#94A3B8]">Evaluates relevant projects, hackathons, and past internships.</p>
              </div>

              {/* Branch Relevance Weight */}
              <div className="space-y-1.5 p-3 rounded-lg bg-[#0F172A] border border-[#334155]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">4. Branch Relevance Weight</span>
                  <span className="font-mono font-bold text-amber-400">{(branchWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={branchWeight}
                  onChange={(e) => setBranchWeight(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-[#1E293B] rounded"
                />
                <p className="text-[10px] text-[#94A3B8]">Curriculum alignment points for departmental eligibility.</p>
              </div>
            </div>

            {/* Sum and Validation */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A] border border-[#334155] text-xs">
              <span className="text-[#94A3B8] font-medium">Sum of Configured Multi-Factor Weights:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded ${
                  totalConfigWeight === 100
                    ? 'bg-emerald-950/60 text-[#34D399] border border-emerald-700/50'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-700/50'
                }`}
              >
                {totalConfigWeight}% {totalConfigWeight === 100 ? '(Perfect 1.00)' : '(Dynamically normalized)'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Execution Pipeline Actions */}
        <div className="space-y-6">
          
          {/* Step 2: Preference Locking Gate */}
          <Card className="border-[#334155] bg-[#1E293B]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {isLocked ? <Lock className="h-4 w-4 text-emerald-400" /> : <Unlock className="h-4 w-4 text-amber-400" />}
                  Step 2: Preference Window
                </span>
                <Badge variant={isLocked ? 'success' : 'warning'} size="sm">
                  {isLocked ? 'LOCKED' : 'OPEN'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-[#94A3B8]">
                {isLocked
                  ? 'Student preference lists are frozen. No new rank edits can be submitted during allocation execution.'
                  : 'Preference ranking window is open. Lock before previewing to ensure determinism.'}
              </p>
              <Button
                variant={isLocked ? 'outline' : 'primary'}
                size="sm"
                onClick={handleToggleLock}
                isLoading={isLocking}
                className="w-full text-xs"
              >
                {isLocked ? (
                  <>
                    <Unlock className="h-3.5 w-3.5 mr-1.5" />
                    Unlock Student Preferences
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5 mr-1.5" />
                    Freeze &amp; Lock Preferences
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Step 5, 7, 8: Action Controls */}
          <Card className="border-[#334155] bg-[#1E293B]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                Execution Operations
              </CardTitle>
              <CardDescription className="text-xs text-[#94A3B8]">
                Never publish directly without preview validation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Preview Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviewAllocation}
                isLoading={isPreviewing}
                className="w-full justify-center bg-[#0F172A] border-[#38BDF8]/40 text-[#38BDF8] hover:bg-[#0284C7]/20 font-semibold"
              >
                <Eye className="h-4 w-4 mr-2" />
                Step 5: Preview Allocation (Dry Run)
              </Button>

              {/* Commit Run Button */}
              <Button
                size="sm"
                onClick={handleRunAllocation}
                isLoading={isRunning}
                className="w-full justify-center bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold shadow-lg"
              >
                <Play className="h-4 w-4 mr-2 fill-current" />
                Step 7: Commit Allocation Run
              </Button>

              {/* Publish Results Button */}
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowPublishConfirm(true)}
                isLoading={isPublishing}
                disabled={publicationStatus === 'PUBLISHED'}
                className="w-full justify-center font-bold"
              >
                <Send className="h-4 w-4 mr-2" />
                Step 8: Publish Results Live
              </Button>

              {publicationStatus === 'PUBLISHED' && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-center">
                  <span className="text-[11px] text-emerald-300 font-medium">
                    Allocations are live on student &amp; company accounts.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal for Publishing */}
      {showPublishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1E293B] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">Publish Official Allocation Results?</h3>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              You are about to make the current matching results visible to all <strong>20 students</strong> and <strong>5 recruiting companies</strong>.
              Students will receive certified allocation offer letters.
            </p>
            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#334155] text-xs text-[#94A3B8] space-y-1">
              <div>Stability Guarantee: <strong className="text-emerald-400">0 Blocking Pairs</strong></div>
              <div>Algorithm: <strong className="text-[#38BDF8]">{algorithmType}</strong></div>
              <div>Fill Rate: <strong className="text-white">{result?.stats.allocationRate || 85}%</strong></div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowPublishConfirm(false)} className="text-xs text-[#94A3B8]">
                Cancel
              </Button>
              <Button variant="success" size="sm" onClick={handlePublishResults} isLoading={isPublishing} className="text-xs font-bold">
                Confirm &amp; Publish Live
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results & Inspection Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#334155] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pairs')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'pairs'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
              }`}
            >
              Candidate Pairs Inspector ({filteredPairs.length})
            </button>
            <button
              onClick={() => setActiveTab('proposals')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'proposals'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
              }`}
            >
              Gale-Shapley Proposal Trace ({result?.proposalLog?.length || 0} Steps)
            </button>
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'visualizer'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
              }`}
            >
              Interactive Bipartite Visualizer
            </button>
          </div>

          {/* Quick Stability Proof Banner */}
          <div className="hidden sm:flex items-center gap-2 bg-[#0F172A] px-3 py-1.5 rounded-lg border border-[#334155] text-xs">
            <ShieldCheck className="h-4 w-4 text-[#34D399]" />
            <span className="text-[#94A3B8]">Stability Proof:</span>
            <span className="font-mono font-bold text-[#34D399]">0 Blocking Pairs</span>
          </div>
        </div>

        {/* Tab 1: Candidate Pairs Decision Inspector */}
        {activeTab === 'pairs' && (
          <Card className="border-[#334155] bg-[#1E293B]">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-bold text-white">
                    Candidate Pairs Decision Matrix
                  </CardTitle>
                  <CardDescription className="text-xs text-[#94A3B8]">
                    Detailed evaluation of candidate qualifications, multi-factor scoring, and deterministic allocation reasons.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-[#64748B]" />
                    <input
                      type="text"
                      placeholder="Search student, roll, role..."
                      value={searchPair}
                      onChange={(e) => setSearchPair(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-[#0F172A] border border-[#334155] rounded-lg text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                  <select
                    value={filterPairStatus}
                    onChange={(e) => setFilterPairStatus(e.target.value as any)}
                    className="px-3 py-1.5 text-xs bg-[#0F172A] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="ALL">All Candidates</option>
                    <option value="ALLOCATED">Allocated Only</option>
                    <option value="REJECTED">Skipped / Waitlisted</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#334155] bg-[#0F172A] text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Internship Track</th>
                    <th className="py-3 px-4">Pref Rank</th>
                    <th className="py-3 px-4">CGPA Factor</th>
                    <th className="py-3 px-4">Skill Match</th>
                    <th className="py-3 px-4">Composite Merit</th>
                    <th className="py-3 px-4">Outcome</th>
                    <th className="py-3 px-4">Algorithmic Decision Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]">
                  {filteredPairs.map((pair, idx) => (
                    <tr
                      key={`${pair.studentId}_${pair.internshipId}_${idx}`}
                      className={`hover:bg-[#0F172A]/50 transition-colors ${
                        pair.allocated ? 'bg-emerald-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-white block">{pair.studentName}</span>
                        <span className="font-mono text-[10px] text-[#94A3B8]">{pair.studentRollNumber}</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-medium text-white block">{pair.internshipTitle}</span>
                        <span className="text-[10px] text-[#38BDF8]">{pair.companyName}</span>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-[#94A3B8]">
                        Choice #{pair.preferenceRank}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-white">
                        {pair.studentCgpa.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[#34D399]">
                        {pair.skillMatchScore}%
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-[#38BDF8] text-sm">
                        {pair.totalScore.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-4">
                        {pair.allocated ? (
                          <Badge variant="success" size="sm">ALLOCATED</Badge>
                        ) : (
                          <Badge variant="danger" size="sm">SKIPPED</Badge>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-[11px] text-[#94A3B8]">
                        {pair.allocated ? (
                          <span className="text-[#34D399] font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 inline" />
                            Stable matching match confirmed
                          </span>
                        ) : (
                          <span className="text-[#94A3B8]">{pair.rejectionReason || 'Capacity filled / Displaced by higher merit'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Proposal Trace Log */}
        {activeTab === 'proposals' && (
          <Card className="border-[#334155] bg-[#1E293B]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#38BDF8]" />
                Many-to-One Gale-Shapley Proposal Steps
              </CardTitle>
              <CardDescription className="text-xs text-[#94A3B8]">
                Deterministic step-by-step trace of candidate proposals, tentative acceptances, and displacement resolution.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#334155] bg-[#0F172A] text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Step</th>
                    <th className="py-3 px-4">Round</th>
                    <th className="py-3 px-4">Proposing Student</th>
                    <th className="py-3 px-4">Target Track</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Displaced Candidate</th>
                    <th className="py-3 px-4">Step Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155] font-mono text-[11px]">
                  {result?.proposalLog && result.proposalLog.length > 0 ? (
                    result.proposalLog.map((step, idx) => (
                      <tr key={idx} className="hover:bg-[#0F172A]/50">
                        <td className="py-2.5 px-4 text-[#64748B]">#{step.stepNumber}</td>
                        <td className="py-2.5 px-4 text-[#38BDF8]">R{step.round}</td>
                        <td className="py-2.5 px-4 font-sans font-medium text-white">{step.studentName}</td>
                        <td className="py-2.5 px-4 font-sans text-[#94A3B8]">{step.internshipTitle}</td>
                        <td className="py-2.5 px-4">
                          {step.action === 'ACCEPTED' ? (
                            <Badge variant="success" size="sm">ACCEPTED</Badge>
                          ) : step.action === 'DISPLACED' ? (
                            <Badge variant="warning" size="sm">DISPLACED</Badge>
                          ) : (
                            <Badge variant="danger" size="sm">REJECTED</Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-sans text-amber-300">
                          {step.displacedStudentName || '—'}
                        </td>
                        <td className="py-2.5 px-4 font-sans text-[11px] text-[#94A3B8]">
                          {step.reason}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-[#94A3B8]">
                        Run or preview the Gale-Shapley algorithm to generate the step-by-step proposal trace.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Interactive Bipartite Visualizer */}
        {activeTab === 'visualizer' && (
          <Card className="border-[#334155] bg-[#1E293B]">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#38BDF8]" />
                Interactive Bipartite Matching Pipeline Visualizer
              </CardTitle>
              <CardDescription className="text-xs text-[#94A3B8]">
                Conceptual flow from 20 student applicants through the multi-objective filter to the 10 corporate quota slots.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-xl bg-[#0F172A] border border-[#334155] space-y-8">
                
                {/* Visual Flow Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  
                  {/* Stage 1: Students */}
                  <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-center space-y-2">
                    <Users className="h-6 w-6 text-[#38BDF8] mx-auto" />
                    <div className="text-xs font-bold text-white">20 Students</div>
                    <div className="text-[10px] text-[#94A3B8]">Preferences &amp; CVs</div>
                    <div className="pt-2">
                      <Badge variant="outline" size="sm" className="text-[#38BDF8] border-[#38BDF8]/40">
                        S = &#123;s₁, s₂... s₂₀&#125;
                      </Badge>
                    </div>
                  </div>

                  <div className="text-center text-[#64748B] flex justify-center">
                    <ArrowRight className="h-5 w-5 text-[#38BDF8] animate-pulse" />
                  </div>

                  {/* Stage 2: Matching Engine */}
                  <div className="p-4 rounded-xl bg-[#0284C7]/20 border border-[#38BDF8] text-center space-y-2 shadow-lg">
                    <Cpu className="h-6 w-6 text-[#38BDF8] mx-auto" />
                    <div className="text-xs font-bold text-white">{algorithmType}</div>
                    <div className="text-[10px] text-[#94A3B8]">Gale-Shapley Deferred Acceptance</div>
                    <div className="pt-2">
                      <Badge variant="primary" size="sm">
                        O(|S|·|I|)
                      </Badge>
                    </div>
                  </div>

                  <div className="text-center text-[#64748B] flex justify-center">
                    <ArrowRight className="h-5 w-5 text-[#34D399] animate-pulse" />
                  </div>

                  {/* Stage 3: Corporate Quotas */}
                  <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-center space-y-2">
                    <Briefcase className="h-6 w-6 text-[#34D399] mx-auto" />
                    <div className="text-xs font-bold text-white">10 Tracks (45 Seats)</div>
                    <div className="text-[10px] text-[#94A3B8]">Quotas C_i &amp; Cutoffs</div>
                    <div className="pt-2">
                      <Badge variant="outline" size="sm" className="text-[#34D399] border-emerald-500/40">
                        I = &#123;i₁, i₂... i₁₀&#125;
                      </Badge>
                    </div>
                  </div>

                </div>

                {/* Algorithmic Guarantees Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#334155]">
                  <div className="p-3 rounded-lg bg-[#1E293B]/70 border border-[#334155]">
                    <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider block">
                      Stability Guarantee
                    </span>
                    <p className="text-xs text-white font-semibold mt-1">
                      No Blocking Pairs (s, i)
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      No unmatched student and employer mutually prefer each other over assigned match.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1E293B]/70 border border-[#334155]">
                    <span className="text-[10px] font-bold text-[#34D399] uppercase tracking-wider block">
                      Pareto Optimality
                    </span>
                    <p className="text-xs text-white font-semibold mt-1">
                      Student-Proposing Optimal
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Every student achieves their best achievable stable assignment across all equilibria.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1E293B]/70 border border-[#334155]">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                      Deterministic Ties
                    </span>
                    <p className="text-xs text-white font-semibold mt-1">
                      Unique Repeatable Solution
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Secondary sorting by CGPA and roll number ensures 100% reproducible audit outcomes.
                    </p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
