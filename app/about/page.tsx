import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  Award,
  Scale,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A1128] text-[#FAF8F5]">
      <Navbar />

      <main className="flex-1">
        {/* Header Banner */}
        <section className="bg-gradient-to-b from-[#0F1A36] to-[#0A1128] border-b border-[#1E3466] py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F1A36] text-[#E5BA73] text-xs font-semibold border border-[#1E3466] shadow-sm">
              <GraduationCap className="h-4 w-4" />
              <span>Institutional Placement &amp; Career Development</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight">
              About SMARTINTERN
            </h1>
            <p className="text-base text-[#D8CEBC] max-w-2xl mx-auto leading-relaxed">
              Transforming college placement allocation through automated matching, multi-criteria merit scoring, and verifiable transparency.
            </p>
          </div>
        </section>

        {/* Core Mission */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-[#E5BA73] bg-[#E5BA73]/15 px-2.5 py-1 rounded border border-[#E5BA73]/30">
                The Objective
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#FAF8F5] tracking-tight">
                Eliminating Placement Inefficiencies &amp; Subjective Bias
              </h2>
              <p className="text-sm text-[#D8CEBC] leading-relaxed">
                In higher education institutions, allocating hundreds of students to competitive corporate internships has historically relied on manual spreadsheet sorting or first-come-first-served heuristics.
              </p>
              <p className="text-sm text-[#D8CEBC] leading-relaxed">
                These legacy methods frequently lead to student dissatisfaction, mismatched skills, and administrative delays. SMARTINTERN provides a centralized platform that balances student preferences with corporate requirements automatically.
              </p>
            </div>

            <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#E5BA73]/20 text-[#F3CA68] flex items-center justify-center font-bold border border-[#E5BA73]/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#FAF8F5] text-base">Centralized Allocation Engine</h3>
                  <p className="text-xs text-[#D8CEBC]">Capacity-Constrained Placement System</p>
                </div>
              </div>
              <p className="text-xs text-[#D8CEBC] leading-relaxed">
                SMARTINTERN connects student preference rankings, academic credentials, and company seat capacities in a fair and transparent system that ensures every allocation is justified and audit-ready.
              </p>
              <div className="pt-2 border-t border-[#1E3466] flex items-center justify-between text-xs text-[#E5BA73] font-semibold">
                <span>Fair, Multi-Criteria Evaluation</span>
                <Link href="/internships" className="hover:underline flex items-center gap-1">
                  Browse Opportunities &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Guiding Principles */}
          <div className="space-y-6 pt-6 border-t border-[#1E3466]">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h3 className="text-2xl font-bold text-[#FAF8F5]">Core Institutional Pillars</h3>
              <p className="text-xs text-[#D8CEBC]">Our commitment to fairness, transparency, and high-quality recruitment.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#0F1A36] p-5 rounded-2xl border border-[#1E3466] space-y-3">
                <ShieldCheck className="h-6 w-6 text-[#E5BA73]" />
                <h4 className="font-bold text-[#FAF8F5] text-base">1. Transparent Fairness</h4>
                <p className="text-xs text-[#D8CEBC] leading-relaxed">
                  Every decision is based on verified student credentials and ranked preferences. No hidden cutoffs or subjective overrides.
                </p>
              </div>

              <div className="bg-[#0F1A36] p-5 rounded-2xl border border-[#1E3466] space-y-3">
                <Scale className="h-6 w-6 text-[#E5BA73]" />
                <h4 className="font-bold text-[#FAF8F5] text-base">2. Comprehensive Merit</h4>
                <p className="text-xs text-[#D8CEBC] leading-relaxed">
                  Evaluates candidate suitability across skills (40%), academic CGPA (30%), past projects (20%), and branch relevance (10%).
                </p>
              </div>

              <div className="bg-[#0F1A36] p-5 rounded-2xl border border-[#1E3466] space-y-3">
                <Award className="h-6 w-6 text-[#E5BA73]" />
                <h4 className="font-bold text-[#FAF8F5] text-base">3. Audit Compliance</h4>
                <p className="text-xs text-[#D8CEBC] leading-relaxed">
                  Immutable preference locking and complete audit logs ensure integrity and compliance with institutional standards.
                </p>
              </div>
            </div>
          </div>

          {/* Placement Cell Contact Details */}
          <div className="bg-[#0F1A36] p-8 rounded-2xl border border-[#1E3466] space-y-6">
            <h3 className="text-xl font-bold text-[#FAF8F5]">Training &amp; Placement Secretariat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#D8CEBC]">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#E5BA73] mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-[#FAF8F5]">Inquiries &amp; Support</div>
                  <div className="mt-1">placement@smartintern.edu</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#E5BA73] mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-[#FAF8F5]">Placement Helpline</div>
                  <div className="mt-1">+91 (022) 2576-7890 (Mon–Fri, 9am–5pm)</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#E5BA73] mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-[#FAF8F5]">Office Location</div>
                  <div className="mt-1">Placement Cell, Academic Complex, Main Campus</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
