import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  Sliders,
  CheckCircle2,
  Users,
  Building2,
  Briefcase,
  Zap,
  BookOpen,
  ArrowDown,
  Layers,
  Award,
  Clock,
  Database,
  LineChart,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function LandingPage() {
  const stepsFlow = [
    {
      step: '01',
      title: 'Student Profiles',
      desc: 'Students submit preferences, verified CGPA, and technical skill matrices.',
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      step: '02',
      title: 'Eligibility Filtering',
      desc: 'Validates minimum CGPA constraints, active application deadlines, and skill prerequisites.',
      icon: ShieldCheck,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      step: '03',
      title: 'Preference Analysis',
      desc: 'Inverted ranking hierarchy scores top choices exponentially higher (100 down to 60 pts).',
      icon: Sliders,
      color: 'from-purple-500 to-pink-500',
    },
    {
      step: '04',
      title: 'Skill & CGPA Scoring',
      desc: 'Mathematical model combines preference (40%), normalized CGPA (30%), and skill overlap (30%).',
      icon: Zap,
      color: 'from-pink-500 to-rose-500',
    },
    {
      step: '05',
      title: 'Optimization Algorithm',
      desc: 'Multi-criteria deterministic sorting with lexicographical tie-breaking over candidate pairs.',
      icon: Cpu,
      color: 'from-rose-500 to-amber-500',
    },
    {
      step: '06',
      title: 'Final Allocation',
      desc: 'Capacity-constrained greedy matching guarantees zero over-subscription and max 1 seat per student.',
      icon: CheckCircle2,
      color: 'from-amber-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 border-b border-slate-200/70">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 shadow-sm">
              <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-900 tracking-wide uppercase">
                College AOA Project &amp; Research Showcase
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Smart Internship <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600">
                Allocation System
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-600">
              Algorithm-Based Internship Allocation Platform
            </p>

            <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Designed for collegiate academic placement offices, our platform leverages deterministic multi-criteria optimization to allocate internships fairly, transparently, and efficiently while eliminating human bias and capacity violations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Launch Platform
                </Button>
              </Link>
              <Link href="/login?demo=admin" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 hover:bg-slate-100">
                  <span>Explore Demo</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/algorithm-explanation" className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto text-slate-700 hover:text-indigo-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Algorithm Docs
                </Button>
              </Link>
            </div>

            {/* Quick Demo Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Instant Demo Login:</span>
              <Link href="/login?demo=admin">
                <Badge variant="purple" className="cursor-pointer hover:bg-purple-100">Admin</Badge>
              </Link>
              <Link href="/login?demo=student">
                <Badge variant="primary" className="cursor-pointer hover:bg-indigo-100">Student</Badge>
              </Link>
              <Link href="/login?demo=company">
                <Badge variant="success" className="cursor-pointer hover:bg-emerald-100">Company</Badge>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Pipeline Flow */}
      <section id="algorithm" className="py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="primary">Algorithmic Pipeline</Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Visual Execution Flow
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              How student preferences and academic merit transition through our 6-stage deterministic allocation engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {stepsFlow.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-2.5 py-1 rounded-md">
                      STEP {item.step}
                    </span>
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Linear Flow Banner */}
          <div className="mt-12 p-4 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-mono flex flex-wrap items-center justify-center gap-2 text-center shadow-lg">
            <span className="text-indigo-400 font-bold">Students</span>
            <span className="text-slate-600">→</span>
            <span className="text-indigo-300">Eligibility Filtering</span>
            <span className="text-slate-600">→</span>
            <span className="text-indigo-300">Preference Analysis</span>
            <span className="text-slate-600">→</span>
            <span className="text-indigo-300">Skill &amp; CGPA Scoring</span>
            <span className="text-slate-600">→</span>
            <span className="text-indigo-300">Optimization Algorithm</span>
            <span className="text-slate-600">→</span>
            <span className="text-emerald-400 font-bold">Final Allocation</span>
          </div>
        </div>
      </section>

      {/* Section 1: How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="primary">System Architecture</Badge>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                Empowering Students, Recruiters, and Academic Coordinators
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Traditional internship placements suffer from first-come-first-served biases, seat wastage, and opaque selection criteria. Smart Internship Allocation System standardizes the process with a multi-portal architecture.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Student Preference Ranking</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Students explore verified company profiles, filter by stipend or minimum CGPA, and rank their top 5 desired internships with live score previews.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Configurable Weight Tuning</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Administrators adjust the influence of Student Preferences (default 40%), Academic CGPA (30%), and Technical Skills (30%) directly from the dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Automated Audit &amp; CSV Export</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Results are persisted to the database with candidate traces, and placement coordinators can export certified CSV spreadsheets in 1 click.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Formula Card */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 text-base">Mathematical Scoring Model</h3>
                <Badge variant="purple">Formula</Badge>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
                <p className="text-indigo-300 font-bold mb-2">// Composite Score Equation</p>
                <p>OverallScore =</p>
                <p className="pl-4 text-emerald-300">0.40 × PreferenceScore</p>
                <p className="pl-4 text-blue-300">+ 0.30 × NormalizedCGPAScore</p>
                <p className="pl-4 text-amber-300">+ 0.30 × SkillMatchPercentage</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                  <div className="text-lg font-bold text-indigo-700">40%</div>
                  <div className="text-[11px] text-slate-600 font-medium">Preference</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-lg font-bold text-blue-700">30%</div>
                  <div className="text-[11px] text-slate-600 font-medium">Academic CGPA</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="text-lg font-bold text-amber-700">30%</div>
                  <div className="text-[11px] text-slate-600 font-medium">Skill Match</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Smart Allocation Algorithm & Complexity */}
      <section className="py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="purple">AOA Complexity Analysis</Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Algorithm Complexity &amp; Constraints
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Rigorous theoretical and asymptotic evaluation for Analysis &amp; Optimization of Algorithms (AOA).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Time Complexity Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Time Complexity</h3>
                  <p className="text-xs text-indigo-600 font-mono font-semibold">O(S · I · log(S · I))</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Let <strong className="text-slate-900">S</strong> denote the number of students and <strong className="text-slate-900">I</strong> denote available internships.
              </p>

              <div className="space-y-2 text-xs font-mono bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">1. Candidate Generation:</span>
                  <span className="font-bold text-slate-800">O(S × I)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">2. Deterministic Sorting:</span>
                  <span className="font-bold text-indigo-600">O((S × I) log(S × I))</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">3. Greedy Allocation:</span>
                  <span className="font-bold text-slate-800">O(S × I)</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold">
                  <span className="text-slate-900">Overall Time:</span>
                  <span className="text-indigo-600">O(S·I log(S·I))</span>
                </div>
              </div>
            </div>

            {/* Space Complexity Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Space Complexity</h3>
                  <p className="text-xs text-purple-600 font-mono font-semibold">O(S · I)</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The algorithm retains candidate evaluation records and hash tables for O(1) state lookups.
              </p>

              <div className="space-y-2 text-xs font-mono bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Candidate Pairs Array:</span>
                  <span className="font-bold text-slate-800">O(S × I)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student &amp; Seat HashMaps:</span>
                  <span className="font-bold text-slate-800">O(S + I)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Allocation HashSets:</span>
                  <span className="font-bold text-slate-800">O(S)</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold">
                  <span className="text-slate-900">Total Auxiliary Space:</span>
                  <span className="text-purple-600">O(S · I)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/algorithm-explanation">
              <Button variant="outline" size="md">
                <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
                Read Full Algorithm Formal Proof &amp; Pseudocode
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Live Statistics Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">20+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Enrolled Students</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">5</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Top Tier Companies</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">10</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Active Internships</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">85%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Allocation Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Badge variant="primary">Experience It Now</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to Test the Smart Internship Allocation Engine?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Log in with the pre-seeded demo accounts to run real-time algorithm simulations, inspect fairness distributions, update preferences, or post new internship openings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/login?demo=admin">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <span>Enter Admin Simulation</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login?demo=student">
              <Button size="lg" variant="outline">
                <span>Enter Student Portal</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
