import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Building2,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  Sliders,
  Scale,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { dataService } from '../lib/db/dataService';

export default async function HomePage() {
  const [internships, students, companies] = await Promise.all([
    dataService.getInternships(),
    dataService.getStudents(),
    dataService.getCompanies(),
  ]);

  const featured = internships.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#F8FAFC] border-b border-[#E2E8F0] pt-20 pb-24 sm:pt-24 sm:pb-28">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-200/40 blur-[120px] pointer-events-none -z-10 rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#0284C7] text-xs font-semibold border border-[#BAE6FD] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#0284C7]" />
              <span>Smart Internship Allocation &amp; Placement Platform</span>
              <span className="text-[#94A3B8]">•</span>
              <span className="text-[#0369A1]">Gale-Shapley Stable Matching</span>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15]">
                SMART INTERNSHIPS.
                <br />
                <span className="bg-gradient-to-r from-[#0284C7] via-[#0284C7] to-[#0EA5E9] bg-clip-text text-transparent">
                  SMARTER ALLOCATION.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-[#475569] font-normal max-w-2xl mx-auto leading-relaxed">
                Find the right opportunity. Build your career. A centralized, capacity-constrained matching platform powered by provably stable algorithms.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/internships" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-lg shadow-sky-600/20 px-8 py-6 text-base font-semibold">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Explore Internships
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#CBD5E1] bg-white hover:bg-[#F1F5F9] text-[#0F172A] px-8 py-6 text-base font-semibold shadow-sm">
                  Student Login
                  <ArrowRight className="h-4 w-4 ml-2 text-[#0284C7]" />
                </Button>
              </Link>
            </div>

            {/* Micro badges below CTA */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                <span>Zero Subjective Bias</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#0284C7]" />
                <span>Guaranteed Stability (No Blocking Pairs)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-[#8B5CF6]" />
                <span>Multi-Factor Merit Scoring</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Platform Statistics */}
        <section className="bg-white border-b border-[#E2E8F0] py-10 shadow-sm relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] text-center">
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0284C7] tracking-tight">500+</div>
                <div className="text-sm font-semibold text-[#0F172A] mt-1">Students</div>
                <div className="text-xs text-[#64748B] mt-0.5">Participating in cycles</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0284C7] tracking-tight">40+</div>
                <div className="text-sm font-semibold text-[#0F172A] mt-1">Companies</div>
                <div className="text-xs text-[#64748B] mt-0.5">Top-tier verified employers</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0284C7] tracking-tight">100+</div>
                <div className="text-sm font-semibold text-[#0F172A] mt-1">Internship Seats</div>
                <div className="text-xs text-[#64748B] mt-0.5">Capacity constrained quotas</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#10B981] tracking-tight">90%+</div>
                <div className="text-sm font-semibold text-[#0F172A] mt-1">Preference Satisfaction</div>
                <div className="text-xs text-[#64748B] mt-0.5">Allocated to Top 3 choices</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. How Smart Allocation Works */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-wider text-[#0284C7] bg-[#E0F2FE] px-3 py-1 rounded-full">
              Workflow Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              How Smart Allocation Works
            </h2>
            <p className="text-sm sm:text-base text-[#64748B]">
              A deterministic four-phase pipeline bridging student preferences and company requirements without manual bias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#BAE6FD] hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg">Profile &amp; Credentials</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Students register verified academic credentials: CGPA, engineering branch, graduation year, technical skills, and prior project experience.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-[11px] font-medium text-[#0284C7]">
                Automated verification
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#BAE6FD] hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg">Eligibility Gate</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Before matching begins, the eligibility engine filters opportunities against strict minimum CGPA cutoffs, allowed branches, and required skill overlaps.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-[11px] font-medium text-[#0284C7]">
                Real-time criteria check
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#BAE6FD] hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg">Ranked Preferences</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Students rank eligible opportunities via an interactive drag-and-drop interface and lock their preferences before the institutional submission deadline.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-[11px] font-medium text-[#0284C7]">
                Immutable lock state
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#BAE6FD] hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg">Gale-Shapley Match</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  The placement cell executes the Many-to-One Gale-Shapley algorithm, resolving capacity quotas through multi-criteria candidate merit scores.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-[11px] font-medium text-[#0284C7]">
                Provably stable outcome
              </div>
            </div>
          </div>
        </section>

        {/* 5. Featured Internships Section */}
        <section className="py-16 bg-[#F1F5F9] border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#0284C7]">
                  Active Openings
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-1">
                  Featured Internships
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  Verified roles offered by recruiting partners in the current academic placement cycle.
                </p>
              </div>
              <Link href="/internships">
                <Button variant="outline" className="border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#0284C7]">
                  View All {internships.length} Internships
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((intern) => (
                <div
                  key={intern.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md hover:border-[#BAE6FD] transition-all flex flex-col justify-between h-full"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-[#0284C7]">
                          {intern.companyName}
                        </span>
                        <h3 className="font-bold text-[#0F172A] text-base line-clamp-1 mt-0.5">
                          {intern.title}
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-[#BAE6FD] bg-[#EFF6FF] text-[#0369A1] font-semibold shrink-0">
                        {intern.mode}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#64748B]">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#94A3B8]" />
                        <span>{intern.location.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#94A3B8]" />
                        <span>{intern.duration}</span>
                      </div>
                      <div className="font-semibold text-[#0F172A]">
                        ₹{intern.stipend.toLocaleString()}/mo
                      </div>
                    </div>

                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {intern.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {intern.requiredSkills.slice(0, 3).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {intern.requiredSkills.length > 3 && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#94A3B8]">
                          +{intern.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <div className="text-xs text-[#64748B]">
                      <span className="font-semibold text-[#0F172A]">{intern.totalSeats}</span> seats • Min CGPA <span className="font-semibold text-[#0F172A]">{intern.minimumCGPA.toFixed(1)}</span>
                    </div>
                    <Link href={`/internships/${intern.id}`}>
                      <Button size="sm" variant="ghost" className="text-[#0284C7] hover:bg-[#E0F2FE] hover:text-[#0369A1] text-xs font-semibold p-2 h-auto">
                        Details &rarr;
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Why SmartIntern */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-wider text-[#0284C7] bg-[#E0F2FE] px-3 py-1 rounded-full">
              System Advantages
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Why SMARTINTERN?
            </h2>
            <p className="text-sm sm:text-base text-[#64748B]">
              Traditional campus placement processes suffer from spreadsheet errors, student discontent, and suboptimal matching. Here is how algorithmic allocation solves it:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="h-10 w-10 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Mathematical Stability</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Guarantees zero blocking pairs. No student and company will ever prefer each other over their assigned matches, preventing back-channel renegotiations and dropouts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="h-10 w-10 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Balanced Merit Scoring</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Does not rely solely on raw CGPA. Integrates verified skill compatibility (40%), CGPA (30%), practical experience (20%), and branch relevance (10%) for well-rounded evaluations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="h-10 w-10 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Transparent Explainability</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Every allocation or non-allocation is mathematically justified. Students see exact reasons, skill match percentages, and capacity thresholds for total trust in results.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Algorithm Explanation Teaser */}
        <section className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-semibold border border-[#38BDF8]/20">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Stable Matching Methodology</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Many-to-One Gale-Shapley (Hospital-Residents) Formulation
                </h2>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Students propose to internships according to their preference rankings. When an internship's capacity $C_i$ is exceeded, it provisionally holds the highest-merit candidates and rejects the others. Rejected candidates continue proposing down their preference list until equilibrium is reached.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/algorithm-explanation">
                    <Button className="bg-[#0284C7] hover:bg-[#0369A1] text-white">
                      Explore Algorithm Complexity &amp; Proofs
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#0B1329] p-6 rounded-2xl border border-[#334155] font-mono text-xs space-y-3">
                <div className="text-[#38BDF8] font-bold pb-2 border-b border-[#1E293B] flex items-center justify-between">
                  <span>PSEUDOCODE: GaleShapley(S, I, C, P)</span>
                  <span className="text-[10px] text-[#94A3B8]">O(S * I)</span>
                </div>
                <pre className="text-[#94A3B8] leading-relaxed overflow-x-auto whitespace-pre">
{`while (∃ unassigned student s with preferences) {
  i = s.next_eligible_preference()
  if (|held[i]| < capacity[i]) {
    held[i].insert(s)
  } else {
    worst = min_merit(held[i])
    if (merit(s, i) > merit(worst, i)) {
      held[i].remove(worst)
      held[i].insert(s)
      free_queue.push(worst)
    } else {
      reject(s)
    }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Call To Action */}
        <section className="py-20 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Ready to experience smarter placements?
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto">
              Sign in with demo accounts to explore the student preference manager, administrator allocation control center, and corporate candidate ranking pools.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/login">
                <Button size="lg" className="bg-[#0284C7] hover:bg-[#0369A1] text-white px-8 py-6 text-base font-semibold shadow-md">
                  Get Started / Sign In
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/algorithm-explanation">
                <Button size="lg" variant="outline" className="border-[#CBD5E1] text-[#0F172A] px-8 py-6 text-base font-semibold">
                  View Algorithm Analysis
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}
