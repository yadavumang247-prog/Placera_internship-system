'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Cpu,
  Clock,
  Database,
  CheckCircle2,
  Layers,
  Sparkles,
  Award,
  GitBranch,
  Filter,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export default function AlgorithmExplanationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Portal Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-3 mb-10 pb-6 border-b border-[#334155]">
          <div className="flex items-center gap-2">
            <Badge variant="primary">AOA Technical Documentation</Badge>
            <span className="text-xs text-[#94A3B8]">Analysis and Optimization of Algorithms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Algorithm Formulation &amp; Complexity Analysis
          </h1>
          <p className="text-base text-[#94A3B8] leading-relaxed max-w-3xl">
            A comprehensive academic explanation of the Multi-Objective Constrained Greedy Optimization algorithm implemented in the InternMatch Portal.
          </p>
        </div>

        {/* Core Sections Container */}
        <div className="space-y-10">
          {/* 1. Problem Formulation */}
          <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#38BDF8] border border-[#334155] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-xl font-bold text-white">Problem Formulation &amp; Input Definition</h2>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Given a finite set of participating students <code className="font-mono text-[#38BDF8]">S = &#123;s₁, s₂, ..., sₙ&#125;</code> and available internships <code className="font-mono text-[#38BDF8]">I = &#123;i₁, i₂, ..., iₘ&#125;</code>, the system must assign each student <code className="font-mono text-[#38BDF8]">s ∈ S</code> to at most one internship <code className="font-mono text-[#38BDF8]">i ∈ I</code> such that capacity constraints are strictly obeyed, eligibility criteria are enforced, and overall student-company matching satisfaction is maximized.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-lg bg-[#0F172A] border border-[#334155] space-y-1.5">
                <span className="font-bold text-white">Student Attributes (s):</span>
                <ul className="list-disc pl-4 text-[#94A3B8] space-y-1">
                  <li>Academic CGPA (<code className="font-mono text-[#38BDF8]">cgpa ∈ [0.0, 10.0]</code>)</li>
                  <li>Technical Skill Vector (<code className="font-mono text-[#38BDF8]">skills ⊆ Σ*</code>)</li>
                  <li>Ranked Preference List (<code className="font-mono text-[#38BDF8]">P(s) = [i₍₁₎, i₍₂₎, ..., i₍₅₎]</code>)</li>
                  <li>Unique Roll Number for deterministic tie-breaking</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#0F172A] border border-[#334155] space-y-1.5">
                <span className="font-bold text-white">Internship Attributes (i):</span>
                <ul className="list-disc pl-4 text-[#94A3B8] space-y-1">
                  <li>Total Seat Quota (<code className="font-mono text-[#38BDF8]">totalSeats(i) ≥ 1</code>)</li>
                  <li>Minimum CGPA Cutoff (<code className="font-mono text-[#38BDF8]">minCGPA(i)</code>)</li>
                  <li>Prerequisite Skill Set (<code className="font-mono text-[#38BDF8]">requiredSkills(i)</code>)</li>
                  <li>Application Deadline timestamp</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. Step-by-Step Pipeline */}
          <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] shadow-lg space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#38BDF8] border border-[#334155] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-xl font-bold text-white">Step-by-Step Algorithmic Pipeline</h2>
            </div>

            <div className="space-y-4">
              <div className="border-l-2 border-[#38BDF8] pl-4 py-1">
                <h3 className="text-sm font-bold text-white">Phase 1: Eligibility Filtering</h3>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  For each student-internship pair <code className="font-mono text-[#38BDF8]">(s, i)</code> present in <code className="font-mono text-[#38BDF8]">P(s)</code>:
                  validate that <code className="font-mono text-[#38BDF8]">s.cgpa ≥ i.minimumCGPA</code> and deadline has not elapsed. Pairs failing eligibility are pruned immediately, preventing invalid allocations.
                </p>
              </div>

              <div className="border-l-2 border-[#38BDF8] pl-4 py-1">
                <h3 className="text-sm font-bold text-white">Phase 2: Multi-Objective Scoring</h3>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  Component dimensions are evaluated and normalized onto a uniform 0–100 scale:
                </p>
                <div className="my-2 p-3 bg-[#0F172A] text-slate-100 rounded-lg border border-[#334155] text-xs font-mono space-y-1">
                  <p>1. Preference Score: S_pref(r) = max(0, 100 - (r - 1) * 10)</p>
                  <p>2. CGPA Score: S_cgpa(cgpa) = (cgpa / 10.0) * 100</p>
                  <p>3. Skill Match Score: S_skill = (|skills(s) ∩ required(i)| / |required(i)|) * 100</p>
                  <p className="text-[#38BDF8] font-bold pt-1">
                    OverallScore = w_pref · S_pref + w_cgpa · S_cgpa + w_skill · S_skill
                  </p>
                </div>
              </div>

              <div className="border-l-2 border-[#38BDF8] pl-4 py-1">
                <h3 className="text-sm font-bold text-white">Phase 3: Multi-Criteria Deterministic Sorting</h3>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  All eligible candidate pairs are sorted in descending order of priority using a lexicographical tuple:
                  <code className="font-mono font-bold text-[#38BDF8]"> (totalScore DESC, preferenceRank ASC, studentCGPA DESC, rollNumber ASC)</code>.
                  This ensures 100% determinism: identical inputs produce identical allocations across runs.
                </p>
              </div>

              <div className="border-l-2 border-[#38BDF8] pl-4 py-1">
                <h3 className="text-sm font-bold text-white">Phase 4: Constrained Greedy Allocation</h3>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  Iterate through sorted candidate pairs: if student has not yet received an allocation AND the internship has remaining available seats, allocate the seat immediately. Otherwise, skip to the next candidate pair.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Pseudocode */}
          <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#38BDF8] border border-[#334155] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-xl font-bold text-white">Algorithm Pseudocode</h2>
            </div>

            <div className="p-5 rounded-lg bg-[#0F172A] text-[#38BDF8] font-mono text-xs leading-relaxed overflow-x-auto border border-[#334155]">
              <pre>{`ALGORITHM: InternMatchAllocation(Students S, Internships I, Preferences P, Weights W)
INPUT:
    S: List of students with {id, cgpa, skills, rollNumber}
    I: List of internships with {id, minimumCGPA, requiredSkills, totalSeats}
    P: Map of studentId -> list of {internshipId, rank}
    W: {w_pref, w_cgpa, w_skill} summing to 1.0

OUTPUT:
    Allocations, UnallocatedStudents, CandidatePairs, ExecutionStats

BEGIN
    candidatePairs ← []
    internshipSeats ← Map(i.id -> { available: i.totalSeats, filled: 0 })
    allocatedStudents ← Set()
    finalAllocations ← []

    // STEP 1 & 2: Eligibility Filtering and Scoring
    FOR each student s IN S:
        FOR each preference p IN P[s.id]:
            internship ← I[p.internshipId]
            
            // Eligibility Condition
            IF s.cgpa >= internship.minimumCGPA:
                prefScore ← max(0, 100 - (p.rank - 1) * 10)
                cgpaScore ← (s.cgpa / 10.0) * 100
                skillScore ← (|s.skills ∩ internship.requiredSkills| / |internship.requiredSkills|) * 100
                totalScore ← W.w_pref * prefScore + W.w_cgpa * cgpaScore + W.w_skill * skillScore

                ADD {student: s, internship: internship, rank: p.rank, score: totalScore} TO candidatePairs

    // STEP 3: Multi-Criteria Deterministic Sorting
    SORT candidatePairs BY:
        1. totalScore DESC
        2. rank ASC
        3. s.cgpa DESC
        4. s.rollNumber ASC   // Deterministic tie-breaker

    // STEP 4: Constrained Greedy Allocation
    FOR each pair IN candidatePairs:
        IF pair.student.id NOT IN allocatedStudents:
            IF internshipSeats[pair.internship.id].available > 0:
                internshipSeats[pair.internship.id].available ← internshipSeats[pair.internship.id].available - 1
                internshipSeats[pair.internship.id].filled ← internshipSeats[pair.internship.id].filled + 1
                ADD pair.student.id TO allocatedStudents
                ADD pair TO finalAllocations
                pair.allocated ← TRUE
            ELSE:
                pair.allocated ← FALSE
                pair.reason ← "Capacity Reached"
        ELSE:
            pair.allocated ← FALSE
            pair.reason ← "Student Already Allocated"

    // STEP 5: Unallocated Detection
    unallocatedStudents ← { s ∈ S | s.id NOT IN allocatedStudents }

    RETURN finalAllocations, unallocatedStudents, candidatePairs
END`}</pre>
            </div>
          </section>

          {/* 4. Complexity Analysis */}
          <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] shadow-lg space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#38BDF8] border border-[#334155] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="text-xl font-bold text-white">Asymptotic Complexity Derivations</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="p-5 rounded-lg bg-[#0F172A] border border-[#334155] space-y-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#38BDF8]" />
                  Time Complexity Derivation
                </h3>
                <p className="text-[#94A3B8] leading-relaxed text-xs">
                  Let <strong className="text-white">S</strong> = number of students, and <strong className="text-white">I</strong> = number of internships.
                </p>
                <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                  <li>
                    <strong>Candidate Generation:</strong> Each student lists at most <code className="font-mono text-[#38BDF8]">k</code> preferences (where <code className="font-mono text-[#38BDF8]">k ≤ I</code>). Hence, candidate pair creation evaluates at most <code className="font-mono text-[#38BDF8]">O(S · I)</code> pairs.
                  </li>
                  <li>
                    <strong>Sorting:</strong> Sorting an array of <code className="font-mono text-[#38BDF8]">N = S · I</code> elements via comparison sort takes <code className="font-mono text-[#38BDF8]">O(N log N) = O(S·I log(S·I))</code> time.
                  </li>
                  <li>
                    <strong>Greedy Allocation:</strong> Single linear pass over sorted candidates with <code className="font-mono text-[#38BDF8]">O(1)</code> HashSet and HashMap checks takes <code className="font-mono text-[#38BDF8]">O(S · I)</code> time.
                  </li>
                </ul>
                <div className="p-2.5 rounded-lg bg-[#0284C7] text-white font-mono font-bold text-xs text-center shadow-md shadow-sky-950">
                  Total Time: O(S · I · log(S · I))
                </div>
              </div>

              <div className="p-5 rounded-lg bg-[#0F172A] border border-[#334155] space-y-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Database className="h-4 w-4 text-[#38BDF8]" />
                  Space Complexity Derivation
                </h3>
                <p className="text-[#94A3B8] leading-relaxed text-xs">
                  Memory allocation is dominated by the candidate pair records and state lookup tables.
                </p>
                <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                  <li>
                    <strong>Candidate Pairs List:</strong> Stores eligible student-internship tuples of size at most <code className="font-mono text-[#38BDF8]">O(S · I)</code>.
                  </li>
                  <li>
                    <strong>State Maps:</strong> <code className="font-mono text-[#38BDF8]">allocatedStudents</code> set of size <code className="font-mono text-[#38BDF8]">O(S)</code>, and <code className="font-mono text-[#38BDF8]">internshipSeats</code> map of size <code className="font-mono text-[#38BDF8]">O(I)</code>.
                  </li>
                  <li>
                    <strong>Result Lists:</strong> Allocations array of size at most <code className="font-mono text-[#38BDF8]">min(S, totalSeats) ≤ O(S)</code>.
                  </li>
                </ul>
                <div className="p-2.5 rounded-lg bg-[#334155] text-[#38BDF8] font-mono font-bold text-xs text-center border border-[#475569]">
                  Total Auxiliary Space: O(S · I)
                </div>
              </div>
            </div>
          </section>

          {/* 5. Comparative Analysis */}
          <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#38BDF8] border border-[#334155] flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h2 className="text-xl font-bold text-white">Comparative Analysis: Why This Approach?</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              When designing internship allocation systems for universities, standard algorithms have specific trade-offs:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-4 rounded-lg border border-[#334155] bg-[#0F172A] space-y-2">
                <h4 className="font-bold text-white">Gale-Shapley (Stable Marriage)</h4>
                <p className="text-[#94A3B8] leading-relaxed">
                  Requires <em>both</em> sides to provide complete preference rankings. Companies cannot exhaustively rank hundreds of uninterviewed applicants.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[#334155] bg-[#0F172A] space-y-2">
                <h4 className="font-bold text-white">Hungarian / Kuhn-Munkres</h4>
                <p className="text-[#94A3B8] leading-relaxed">
                  Solves maximum weight bipartite matching in <code className="font-mono text-[#38BDF8]">O(V³)</code> time, but lacks explainable multi-tier tie-breaking and seat quotas natively.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[#38BDF8] bg-[#38BDF8]/10 space-y-2">
                <h4 className="font-bold text-[#38BDF8]">Our Multi-Objective Greedy</h4>
                <p className="text-white leading-relaxed">
                  Executes in <code className="font-mono text-[#38BDF8]">O(SI log(SI))</code>, enforces strict seat capacities, provides clear score transparency, and guarantees deterministic outcomes.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link href="/login?demo=admin">
            <Button size="lg" className="bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md shadow-sky-950">
              <span>Test Allocation Algorithm in Admin Portal</span>
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
