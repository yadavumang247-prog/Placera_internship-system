import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  Award,
  Cpu,
  Scale,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1">
        {/* Header Banner */}
        <section className="bg-gradient-to-b from-[#EFF6FF] to-[#F8FAFC] border-b border-[#E2E8F0] py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0284C7] text-xs font-semibold border border-[#BAE6FD] shadow-sm">
              <GraduationCap className="h-4 w-4" />
              <span>Institutional Placement &amp; Academic Research Cell</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              About SMARTINTERN
            </h1>
            <p className="text-base text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Transforming college placement allocation through deterministic stable matching, multi-criteria merit scoring, and verifiable algorithmic equity.
            </p>
          </div>
        </section>

        {/* Core Mission & AoA Problem */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-1 rounded">
                The Core Challenge
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                Eliminating Placement Inefficiencies and Subjective Bias
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed">
                In higher education institutions, allocating hundreds of engineering students to competitive corporate internships has historically relied on manual spreadsheet sorting or naive first-come-first-served heuristics.
              </p>
              <p className="text-sm text-[#475569] leading-relaxed">
                These legacy methods frequently lead to high student dissatisfaction, blocking pairs (where a qualified student and company both preferred each other over their assigned outcome), and administrative opacity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-base">Algorithmic Placement Engine</h3>
                  <p className="text-xs text-[#64748B]">Capacity-Constrained Bipartite Matching</p>
                </div>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                SMARTINTERN was engineered as an advanced smart internship allocation system to implement and evaluate the <strong>Many-to-One Gale-Shapley (Hospital-Residents)</strong> algorithm in real-world university placement environments.
              </p>
              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#0284C7] font-semibold">
                <span>Theoretical Guarantees: O(|S| · |I|)</span>
                <Link href="/algorithm-explanation" className="hover:underline">
                  Read Proofs &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Guiding Principles */}
          <div className="space-y-6 pt-6 border-t border-[#E2E8F0]">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h3 className="text-2xl font-bold text-[#0F172A]">Core Institutional Pillars</h3>
              <p className="text-xs text-[#64748B]">Our commitment to academic rigour and transparent governance.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] space-y-3">
                <ShieldCheck className="h-6 w-6 text-[#0284C7]" />
                <h4 className="font-bold text-[#0F172A] text-base">1. Mathematical Stability</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Provably prevents blocking pairs. If student A was not allocated to company B, it is guaranteed that B's quota was filled by candidates B strictly preferred over A.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] space-y-3">
                <Scale className="h-6 w-6 text-[#0284C7]" />
                <h4 className="font-bold text-[#0F172A] text-base">2. Multi-Factor Merit</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Scoring balances 40% technical skill overlap, 30% CGPA, 20% verified project/internship experience, and 10% branch compatibility.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] space-y-3">
                <CheckCircle2 className="h-6 w-6 text-[#0284C7]" />
                <h4 className="font-bold text-[#0F172A] text-base">3. Full Explainability</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Students and recruiting partners receive detailed breakdown cards explaining exactly which criteria, weights, and rounds determined their final allocation.
                </p>
              </div>
            </div>
          </div>

          {/* Placement Cell Coordinates */}
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white p-8 rounded-2xl shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#334155] pb-4">
              <div>
                <h3 className="text-xl font-bold">Training &amp; Placement Cell Contact</h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Academic Affairs &amp; Corporate Relations Division
                </p>
              </div>
              <Link href="/login">
                <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-3 bg-[#0B1329] p-3 rounded-lg border border-[#334155]">
                <Mail className="h-4 w-4 text-[#38BDF8]" />
                <div>
                  <span className="block text-white font-semibold">Email Enquiries</span>
                  <span>placement@smartintern.edu</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#0B1329] p-3 rounded-lg border border-[#334155]">
                <Phone className="h-4 w-4 text-[#38BDF8]" />
                <div>
                  <span className="block text-white font-semibold">Phone Support</span>
                  <span>+91 (022) 2576-7890</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#0B1329] p-3 rounded-lg border border-[#334155]">
                <MapPin className="h-4 w-4 text-[#38BDF8]" />
                <div>
                  <span className="block text-white font-semibold">Office Location</span>
                  <span>CSE Academic Complex, Level 3</span>
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
