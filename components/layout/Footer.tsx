import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1E3466] bg-[#060B1B] text-[#D8CEBC] text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 - Brand & Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#D4A253] to-[#F3CA68] flex items-center justify-center text-[#0A1128] shadow-sm shadow-[#E5BA73]/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-[#FAF8F5] text-base tracking-tight">
                SMART<span className="text-[#E5BA73]">INTERN</span>
              </span>
            </div>
            <p className="text-xs text-[#E5BA73] font-semibold">
              Smart Internship Allocation System
            </p>
            <p className="text-xs text-[#D8CEBC] max-w-md leading-relaxed">
              A centralized internship allocation platform connecting qualified candidates with top corporate opportunities through fair, automated capacity matching and multi-factor merit scoring.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#E5BA73]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Transparent Matching • Zero Subjective Bias • Capacity Constrained</span>
            </div>
          </div>

          {/* Col 2 - Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#FAF8F5] text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-[#D8CEBC]">
              <li>
                <Link href="/" className="hover:text-[#E5BA73] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/internships" className="hover:text-[#E5BA73] transition-colors">
                  Internship Listings
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E5BA73] transition-colors">
                  About Placement Cell
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#E5BA73] transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 - Placement Office */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#FAF8F5] text-xs uppercase tracking-wider">
              Training &amp; Placement Cell
            </h4>
            <div className="space-y-1.5 text-xs text-[#D8CEBC]">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#E5BA73] shrink-0" />
                <span>placement@smartintern.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#E5BA73] shrink-0" />
                <span>+91 (022) 2576-7890</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#E5BA73] shrink-0 mt-0.5" />
                <span>Department of Computer Science &amp; Engineering, Academic Complex</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-8 pt-6 border-t border-[#1E3466] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8CEBC]/70">
          <p>© {new Date().getFullYear()} SMARTINTERN. Smart Internship Allocation System.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#E5BA73] transition-colors">
              Platform Overview
            </Link>
            <Link href="/internships" className="hover:text-[#E5BA73] transition-colors">
              Explore Opportunities
            </Link>
            <Link href="/login" className="hover:text-[#E5BA73] transition-colors">
              Account Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
