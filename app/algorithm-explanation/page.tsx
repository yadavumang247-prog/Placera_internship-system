import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Cpu,
  Clock,
  Database,
  Layers,
  CheckCircle2,
  Sliders,
  Scale,
  Code2,
  FileCode,
  Lightbulb,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export default function AlgorithmExplanationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-3 mb-12">
          <div className="flex items-center gap-2">
            <Badge variant="purple">AOA Technical Specification</Badge>
            <span className="text-xs text-slate-400">Analysis and Optimization of Algorithms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Algorithm Formulation &amp; Complexity Analysis
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            A comprehensive academic explanation of the Multi-Objective Constrained Greedy Optimization algorithm implemented in the Smart Internship Allocation System.
          </p>
        </div>

        {/* Core Sections Container */}
        <div className="space-y-12">
          {/* 1. Problem Formulation */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-xl font-bold text-slate-900">Problem Formulation &amp; Input Definition</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Given a finite set of participating students <code className="font-mono text-indigo-600">S = &#123;s₁, s₂, ..., sₙ&#125;</code> and available internships <code className="font-mono text-indigo-600">I = &#123;i₁, i₂, ..., iₘ&#125;</code>, the system must assign each student <code className="font-mono text-indigo-600">s ∈ S</code> to at most one internship <code className="font-mono text-indigo-600">i ∈ I</code> such that capacity constraints are strictly obeyed, eligibility criteria are enforced, and overall student-company matching satisfaction is maximized.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-800">Student Attributes s:</span>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  <li>Academic CGPA (<code className="font-mono">cgpa ∈ [0.0, 10.0]</code>)</li>
                  <li>Technical Skill Vector (<code className="font-mono">skills ⊆ Σ*</code>)</li>
                  <li>Ranked Preference List (<code className="font-mono">P(s) = [i₍₁₎, i₍₂₎, ..., i₍₅₎]</code>)</li>
                  <li>Unique Roll Number for deterministic tie-breaking</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-800">Internship Attributes i:</span>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  <li>Total Seat Quota (<code className="font-mono">totalSeats(i) ≥ 1</code>)</li>
                  <li>Minimum CGPA Cutoff (<code className="font-mono">minCGPA(i)</code>)</li>
                  <li>Prerequisite Skill Set (<code className="font-mono">requiredSkills(i)</code>)</li>
                  <li>Application Deadline timestamp</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. Step-by-Step Pipeline */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-xl font-bold text-slate-900">Step-by-Step Algorithmic Pipeline</h2>
            </div>

            <div className="space-y-4">
              <div className="border-l-2 border-indigo-500 pl-4 py-1">
                <h3 className="text-sm font-bold text-slate-900">Phase 1: Eligibility Filtering</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  For each student-internship pair <code className="font-mono">(s, i)</code> present in <code className="font-mono">P(s)</code>:
                  validate that <code className="font-mono">s.cgpa ≥ i.minimumCGPA</code> and deadline has not elapsed. Pairs failing eligibility are pruned immediately, preventing invalid allocations.
                </p>
              </div>

              <div className="border-l-2 border-indigo-500 pl-4 py-1">
                <h3 className="text-sm font-bold text-slate-900">Phase 2: Multi-Objective Scoring</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Three orthogonal dimensions are evaluated and normalized onto a uniform 0–100 scale:
                </p>
                <div className="my-2 p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono space-y-1">
                  <p>1. Preference Score: S_pref(r) = max(0, 100 - (r - 1) * 10)</p>
                  <p>2. CGPA Score: S_cgpa(cgpa) = (cgpa / 10.0) * 100</p>
                  <p>3. Skill Match Score: S_skill = (|skills(s) ∩ required(i)| / |required(i)|) * 100</p>
                  <p className="text-indigo-400 font-bold pt-1">
                    OverallScore = w_pref · S_pref + w_cgpa · S_cgpa + w_skill · S_skill
                  </p>
                </div>
              </div>

              <div className="border-l-2 border-indigo-500 pl-4 py-1">
                <h3 className="text-sm font-bold text-slate-900">Phase 3: Multi-Criteria Deterministic Sorting</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  All eligible candidate pairs are sorted in descending order of priority using a lexicographical tuple:
                  <code className="font-mono font-bold text-slate-800"> (totalScore DESC, preferenceRank ASC, studentCGPA DESC, rollNumber ASC)</code>.
                  This ensures 100% determinism: identical inputs produce identical allocations across runs.
                </p>
              </div>

              <div className="border-l-2 border-indigo-500 pl-4 py-1">
                <h3 className="text-sm font-bold text-slate-900">Phase 4: Constrained Greedy Allocation</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Iterate through sorted candidate pairs: if student has not yet received an allocation AND the internship has remaining available seats, allocate the seat immediately. Otherwise, skip to the next candidate pair.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Pseudocode */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                3
              </div>
              <h2 className="text-xl font-bold text-slate-900">Algorithm Pseudocode</h2>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800">
              <pre>{`ALGORITHM: SmartInternshipAllocation(Students S, Internships I, Preferences P, Weights W)
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
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                4
              </div>
              <h2 className="text-xl font-bold text-slate-900">Asymptotic Complexity Derivations</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="p-5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                <h3 className="font-bold text-indigo-950 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  Time Complexity Derivation
                </h3>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Let <strong className="text-slate-900">S</strong> = number of students, and <strong className="text-slate-900">I</strong> = number of internships.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li>
                    <strong>Candidate Generation:</strong> Each student lists at most <code className="font-mono">k</code> preferences (where <code className="font-mono">k ≤ I</code>). Hence, candidate pair creation evaluates at most <code className="font-mono">O(S · I)</code> pairs.
                  </li>
                  <li>
                    <strong>Sorting:</strong> Sorting an array of <code className="font-mono">N = S · I</code> elements via comparison sort (Timsort) takes <code className="font-mono">O(N log N) = O(S·I log(S·I))</code> time.
                  </li>
                  <li>
                    <strong>Greedy Allocation:</strong> Single linear pass over sorted candidates with <code className="font-mono">O(1)</code> HashSet and HashMap checks takes <code className="font-mono">O(S · I)</code> time.
                  </li>
                </ul>
                <div className="p-2.5 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs text-center">
                  Total Time: O(S · I · log(S · I))
                </div>
              </div>

              <div className="p-5 rounded-xl bg-purple-50/60 border border-purple-100 space-y-3">
                <h3 className="font-bold text-purple-950 flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-600" />
                  Space Complexity Derivation
                </h3>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Memory allocation is dominated by the candidate pair records and state lookup tables.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li>
                    <strong>Candidate Pairs List:</strong> Stores eligible student-internship tuples of size at most <code className="font-mono">O(S · I)</code>.
                  </li>
                  <li>
                    <strong>State Maps:</strong> <code className="font-mono">allocatedStudents</code> set of size <code className="font-mono">O(S)</code>, and <code className="font-mono">internshipSeats</code> map of size <code className="font-mono">O(I)</code>.
                  </li>
                  <li>
                    <strong>Result Lists:</strong> Allocations array of size at most <code className="font-mono">min(S, totalSeats) ≤ O(S)</code>.
                  </li>
                </ul>
                <div className="p-2.5 rounded-lg bg-purple-600 text-white font-mono font-bold text-xs text-center">
                  Total Auxiliary Space: O(S · I)
                </div>
              </div>
            </div>
          </section>

          {/* 5. Comparative Analysis */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                5
              </div>
              <h2 className="text-xl font-bold text-slate-900">Comparative Analysis: Why This Approach?</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When designing internship allocation systems for universities, standard algorithms have specific limitations:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900">Gale-Shapley (Stable Marriage)</h4>
                <p className="text-slate-500 leading-relaxed">
                  Requires <em>both</em> sides to provide complete preference rankings. Companies cannot exhaustively rank hundreds of uninterviewed applicants.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900">Hungarian / Kuhn-Munkres</h4>
                <p className="text-slate-500 leading-relaxed">
                  Solves maximum weight bipartite matching in <code className="font-mono">O(V³)</code> time, but lacks explainable multi-tier tie-breaking and seat quotas natively.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
                <h4 className="font-bold text-indigo-950">Our Multi-Objective Greedy</h4>
                <p className="text-indigo-900/80 leading-relaxed">
                  Executes in <code className="font-mono">O(SI log(SI))</code>, enforces strict seat capacities, provides clear score transparency, and guarantees deterministic outcomes.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link href="/login?demo=admin">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              <span>Test Algorithm in Admin Portal</span>
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
