import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Cpu, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#0A0F1D] text-[#94A3B8] text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 - Brand & Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#0284C7] to-[#0EA5E9] flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-[#F8FAFC] text-base tracking-tight">
                SMART<span className="text-[#38BDF8]">INTERN</span>
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-semibold">
              Smart Internship Allocation &amp; Placement System
            </p>
            <p className="text-xs text-[#64748B] max-w-md leading-relaxed">
              An institutional placement platform replacing subjective manual assignments with a capacity-constrained Many-to-One Gale-Shapley Stable Matching algorithm, pre-matching eligibility gate, and transparent merit scoring.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#38BDF8]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Provably Stable • Zero Subjective Bias • Capacity Constrained</span>
            </div>
          </div>

          {/* Col 2 - Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#F8FAFC] text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-[#94A3B8]">
              <li>
                <Link href="/" className="hover:text-[#38BDF8] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/internships" className="hover:text-[#38BDF8] transition-colors">
                  Internship Listings
                </Link>
              </li>
              <li>
                <Link href="/algorithm-explanation" className="hover:text-[#38BDF8] transition-colors flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-[#38BDF8]" />
                  <span>Matching Methodology</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#38BDF8] transition-colors">
                  About Placement Cell
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#38BDF8] transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 - Placement Office */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#F8FAFC] text-xs uppercase tracking-wider">
              Training &amp; Placement Cell
            </h4>
            <div className="space-y-1.5 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
                <span>placement@smartintern.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
                <span>+91 (022) 2576-7890</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>Department of Computer Science &amp; Engineering, Academic Complex</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-8 pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} SMARTINTERN. Smart Internship Allocation &amp; Placement System.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#38BDF8] transition-colors">
              Academic Governance
            </Link>
            <Link href="/algorithm-explanation" className="hover:text-[#38BDF8] transition-colors">
              Mathematical Formulations
            </Link>
            <Link href="/login" className="hover:text-[#38BDF8] transition-colors">
              Role Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
