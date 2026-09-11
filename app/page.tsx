import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Building2,
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
  Scale,
  Sliders,
  Check,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { dataService } from '../lib/db/dataService';

export default async function HomePage() {
  const [internships, students, companies] = await Promise.all([
    dataService.getInternships(),
    dataService.getStudents(),
    dataService.getCompanies(),
  ]);

  const featured = internships.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1128] text-[#FAF8F5]">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1128] via-[#0E1B38] to-[#0A1128] border-b border-[#1E3466] pt-20 pb-24 sm:pt-28 sm:pb-32">
          {/* Subtle Warm Beige/Gold Ambient Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#E5BA73]/10 blur-[130px] pointer-events-none -z-10 rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F1A36] text-[#E5BA73] text-xs font-semibold border border-[#1E3466] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#E5BA73]" />
              <span>Smart Internship Allocation System</span>
              <span className="text-[#1E3466]">•</span>
              <span className="text-[#FAF8F5]">Automated Talent Matching</span>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FAF8F5] leading-[1.15]">
                SMART INTERNSHIPS.
                <br />
                <span className="bg-gradient-to-r from-[#E5BA73] via-[#F3CA68] to-[#DFC062] bg-clip-text text-transparent">
                  SMARTER ALLOCATION.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-[#D8CEBC] font-normal max-w-2xl mx-auto leading-relaxed">
                Find the right opportunity. Accelerate your career. A centralized matching platform connecting ambitious students with industry-leading corporate teams.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/internships" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[#E5BA73] hover:bg-[#D4A253] text-[#0A1128] shadow-lg shadow-[#E5BA73]/20 px-8 py-6 text-base font-bold">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Explore Internships
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#1E3466] bg-[#0F1A36] hover:bg-[#142247] hover:border-[#E5BA73]/50 text-[#FAF8F5] px-8 py-6 text-base font-semibold shadow-sm">
                  Candidate Login
                  <ArrowRight className="h-4 w-4 ml-2 text-[#E5BA73]" />
                </Button>
              </Link>
            </div>

            {/* Micro badges below CTA */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#D8CEBC]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                <span>Zero Subjective Bias</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#E5BA73]" />
                <span>Capacity-Constrained Fair Matching</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-[#F3CA68]" />
                <span>Multi-Factor Merit Scoring</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Platform Statistics */}
        <section className="bg-[#0F1A36] border-b border-[#1E3466] py-10 shadow-sm relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#1E3466] text-center">
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#E5BA73] tracking-tight">500+</div>
                <div className="text-sm font-semibold text-[#FAF8F5] mt-1">Students</div>
                <div className="text-xs text-[#D8CEBC] mt-0.5">Active candidates</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#E5BA73] tracking-tight">40+</div>
                <div className="text-sm font-semibold text-[#FAF8F5] mt-1">Companies</div>
                <div className="text-xs text-[#D8CEBC] mt-0.5">Verified hiring partners</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#E5BA73] tracking-tight">100+</div>
                <div className="text-sm font-semibold text-[#FAF8F5] mt-1">Internship Seats</div>
                <div className="text-xs text-[#D8CEBC] mt-0.5">Allocated opportunities</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#10B981] tracking-tight">95%+</div>
                <div className="text-sm font-semibold text-[#FAF8F5] mt-1">Preference Satisfaction</div>
                <div className="text-xs text-[#D8CEBC] mt-0.5">Allocated to Top Choices</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. How Smart Allocation Works */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-wider text-[#E5BA73] bg-[#E5BA73]/15 px-3 py-1 rounded-full border border-[#E5BA73]/30">
              Workflow Pipeline
            </span>
            <h2 className="text-3xl font-extrabold text-[#FAF8F5] tracking-tight">
              How Smart Allocation Works
            </h2>
            <p className="text-sm sm:text-base text-[#D8CEBC]">
              A deterministic four-phase process bridging student preferences and company requirements without manual bias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-sm hover:border-[#E5BA73]/60 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-[#E5BA73]/20 text-[#F3CA68] flex items-center justify-center font-bold text-lg border border-[#E5BA73]/30">
                  1
                </div>
                <h3 className="font-bold text-[#FAF8F5] text-lg">Profile &amp; Credentials</h3>
                <p className="text-xs text-[#D8CEBC] leading-relaxed">
                  Students complete verified profiles: academic CGPA, engineering branch, graduation year, technical skills, and practical project experience.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E3466] text-[11px] font-semibold text-[#E5BA73]">
                Automated verification
              </div>
            </div>

            <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-sm hover:border-[#E5BA73]/60 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-[#E5BA73]/20 text-[#F3CA68] flex items-center justify-center font-bold text-lg border border-[#E5BA73]/30">
                  2
                </div>
                <h3 className="font-bold text-[#FAF8F5] text-lg">Eligibility Gate</h3>
                <p className="text-xs text-[#D8CEBC] leading-relaxed">
                  The system filters available opportunities against strict minimum CGPA cutoffs, department criteria, and core skill requirements.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E3466] text-[11px] font-semibold text-[#E5BA73]">
                Real-time criteria check
              </div>
            </div>

            <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-sm hover:border-[#E5BA73]/60 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-[#E5BA73]/20 text-[#F3CA68] flex items-center justify-center font-bold text-lg border border-[#E5BA73]/30">
                  3
                </div>
                <h3 className="font-bold text-[#FAF8F5] text-lg">Ranked Preferences</h3>
                <p className="text-xs text-[#D8CEBC] leading-relaxed">
                  Students explore eligible opportunities, rank their top choices via an interactive drag-and-drop builder, and submit them before the deadline.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E3466] text-[11px] font-semibold text-[#E5BA73]">
                Candidate-first priority
              </div>
            </div>

            <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-sm hover:border-[#E5BA73]/60 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-[#E5BA73]/20 text-[#F3CA68] flex items-center justify-center font-bold text-lg border border-[#E5BA73]/30">
                  4
                </div>
                <h3 className="font-bold text-[#FAF8F5] text-lg">Smart Matching</h3>
                <p className="text-xs text-[#D8CEBC] leading-relaxed">
                  The system resolves capacity quotas using multi-criteria merit scores (skills, CGPA, experience), providing optimal and fair allocations.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E3466] text-[11px] font-semibold text-[#E5BA73]">
                Fair &amp; verified outcome
              </div>
            </div>
          </div>
        </section>

        {/* 5. Featured Internships Section */}
        <section className="py-16 bg-[#0B1530] border-y border-[#1E3466]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#E5BA73]">
                  Active Openings
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#FAF8F5] tracking-tight mt-1">
                  Featured Internships
                </h2>
                <p className="text-xs sm:text-sm text-[#D8CEBC] mt-1">
                  Verified roles offered by recruiting partners in the current placement cycle.
                </p>
              </div>
              <Link href="/internships">
                <Button variant="outline" className="border-[#1E3466] bg-[#0F1A36] hover:bg-[#142247] hover:border-[#E5BA73]/60 text-[#E5BA73]">
                  View All {internships.length} Internships
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((intern) => (
                <div
                  key={intern.id}
                  className="bg-[#0F1A36] rounded-2xl border border-[#1E3466] p-5 shadow-sm hover:shadow-md hover:border-[#E5BA73]/60 transition-all flex flex-col justify-between h-full"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-[#E5BA73]">
                          {intern.companyName}
                        </span>
                        <h3 className="font-bold text-[#FAF8F5] text-base line-clamp-1 mt-0.5">
                          {intern.title}
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-[#E5BA73]/40 bg-[#E5BA73]/15 text-[#F3CA68] font-semibold shrink-0">
                        {intern.mode}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#D8CEBC]">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#E5BA73]" />
                        <span>{intern.location.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#E5BA73]" />
                        <span>{intern.duration}</span>
                      </div>
                      <div className="font-semibold text-[#FAF8F5]">
                        ₹{intern.stipend.toLocaleString()}/mo
                      </div>
                    </div>

                    <p className="text-xs text-[#D8CEBC] line-clamp-2 leading-relaxed">
                      {intern.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {intern.requiredSkills.slice(0, 3).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#142247] text-[#D8CEBC] border border-[#1E3466] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {intern.requiredSkills.length > 3 && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#142247] text-[#D8CEBC]/70 border border-[#1E3466]">
                          +{intern.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#1E3466] flex items-center justify-between">
                    <div className="text-xs text-[#D8CEBC]">
                      <span className="font-semibold text-[#FAF8F5]">{intern.totalSeats}</span> seats • Min CGPA <span className="font-semibold text-[#FAF8F5]">{intern.minimumCGPA.toFixed(1)}</span>
                    </div>
                    <Link href={`/internships/${intern.id}`}>
                      <Button size="sm" variant="ghost" className="text-[#E5BA73] hover:bg-[#E5BA73]/15 hover:text-[#F3CA68] text-xs font-semibold p-2 h-auto">
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
            <span className="text-xs uppercase font-bold tracking-wider text-[#E5BA73] bg-[#E5BA73]/15 px-3 py-1 rounded-full border border-[#E5BA73]/30">
              Platform Benefits
            </span>
            <h2 className="text-3xl font-extrabold text-[#FAF8F5] tracking-tight">
              Why SMARTINTERN?
            </h2>
            <p className="text-sm sm:text-base text-[#D8CEBC]">
              Traditional campus placement processes suffer from spreadsheet errors, student discontent, and slow matching. Here is how modern automated allocation transforms hiring:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-sm space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#E5BA73]/20 text-[#F3CA68] flex items-center justify-center border border-[#E5BA73]/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#FAF8F5]">Fair &amp; Balanced Allocation</h3>
              <p className="text-xs sm:text-sm text-[#D8CEBC] leading-relaxed">
                Guarantees transparent matching. Allocations are driven strictly by candidate preference rankings and verified qualifications, eliminating back-channel negotiations.
              </p>
            </div>

            <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-sm space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#E5BA73]/20 text-[#F3CA68] flex items-center justify-center border border-[#E5BA73]/30">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#FAF8F5]">Holistic Merit Scoring</h3>
              <p className="text-xs sm:text-sm text-[#D8CEBC] leading-relaxed">
                Does not rely solely on raw CGPA. Integrates verified skill compatibility (40%), academic grades (30%), practical experience (20%), and branch relevance (10%).
              </p>
            </div>

            <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-sm space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#E5BA73]/20 text-[#F3CA68] flex items-center justify-center border border-[#E5BA73]/30">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#FAF8F5]">Instant Transparency</h3>
              <p className="text-xs sm:text-sm text-[#D8CEBC] leading-relaxed">
                Every allocation decision is clearly explained. Students and recruiters see transparent match percentages and seat quotas for complete trust in outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Enterprise Feature Highlights (Replaced academic pseudocode section) */}
        <section className="bg-gradient-to-r from-[#0F1A36] via-[#142247] to-[#0F1A36] border-y border-[#1E3466] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5BA73]/15 text-[#E5BA73] text-xs font-semibold border border-[#E5BA73]/30">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Smart Placement Engine</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[#FAF8F5]">
                  Automated Capacity Matching &amp; Placement Coordination
                </h2>
                <p className="text-sm text-[#D8CEBC] leading-relaxed">
                  Engineered to streamline campus hiring drives. Students rank their preferred positions, while companies define exact candidate criteria. The system calculates optimal matches in seconds, maximizing student satisfaction and filling high-priority seats.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/internships">
                    <Button className="bg-[#E5BA73] hover:bg-[#D4A253] text-[#0A1128] font-bold shadow-md shadow-[#E5BA73]/20">
                      Browse Available Roles
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#0A1128] p-6 rounded-2xl border border-[#1E3466] space-y-4">
                <div className="text-[#E5BA73] font-bold text-sm pb-2 border-b border-[#1E3466] flex items-center justify-between">
                  <span>Engine Features</span>
                  <span className="text-[11px] text-[#D8CEBC]">Production Ready</span>
                </div>
                <ul className="space-y-3 text-xs text-[#D8CEBC]">
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-[#E5BA73] shrink-0 mt-0.5" />
                    <span><strong>Pre-matching Eligibility Gate:</strong> Real-time filtering by branch, cutoff CGPA, and required skill overlaps.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-[#E5BA73] shrink-0 mt-0.5" />
                    <span><strong>Interactive Preference Ranking:</strong> Drag-and-drop candidate list with instant deadline locking.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-[#E5BA73] shrink-0 mt-0.5" />
                    <span><strong>Capacity Quota Management:</strong> Real-time seat tracking and automatic waitlist overflow resolution.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-[#E5BA73] shrink-0 mt-0.5" />
                    <span><strong>Full Audit Ledger:</strong> Detailed allocation records for placement officers and recruiters.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Call To Action */}
        <section className="py-20 bg-[#0A1128] border-b border-[#1E3466]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FAF8F5] tracking-tight">
              Ready to experience smarter placements?
            </h2>
            <p className="text-sm sm:text-base text-[#D8CEBC] max-w-xl mx-auto">
              Sign in with demo accounts to explore the candidate dashboard, administrator control center, and employer recruitment console.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/login">
                <Button size="lg" className="bg-[#E5BA73] hover:bg-[#D4A253] text-[#0A1128] px-8 py-6 text-base font-bold shadow-md shadow-[#E5BA73]/20">
                  Get Started / Sign In
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/internships">
                <Button size="lg" variant="outline" className="border-[#1E3466] bg-[#0F1A36] text-[#FAF8F5] hover:border-[#E5BA73]/50 px-8 py-6 text-base font-semibold">
                  Browse All Internships
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
