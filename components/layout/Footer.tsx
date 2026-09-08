import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#0A0F1D] text-[#94A3B8] text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 - Brand & Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-md bg-[#0284C7] flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-[#F8FAFC] text-base">
                InternMatch Portal
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-medium">
              College Internship &amp; Placement Management Portal
            </p>
            <p className="text-xs text-[#64748B] max-w-md leading-relaxed">
              A centralized platform for managing internship opportunities, student preferences, eligibility, and internship allocation across academic departments.
            </p>
          </div>

          {/* Col 2 - Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#F8FAFC] text-xs uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-[#94A3B8]">
              <li>
                <Link href="/" className="hover:text-[#38BDF8] transition-colors">
                  Portal Home
                </Link>
              </li>
              <li>
                <Link href="/internships" className="hover:text-[#38BDF8] transition-colors">
                  Internship Listings
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#38BDF8] transition-colors">
                  Student &amp; Staff Login
                </Link>
              </li>
              <li>
                <Link href="/algorithm-explanation" className="hover:text-[#38BDF8] transition-colors">
                  Allocation Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 - Placement Office */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#F8FAFC] text-xs uppercase tracking-wider">
              Placement Cell
            </h4>
            <div className="space-y-1.5 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
                <span>placement@university.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
                <span>+91 22 2576 7000</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>Training &amp; Placement Office, Admin Block</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-8 pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} InternMatch Portal. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/#about" className="hover:text-[#38BDF8] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/#about" className="hover:text-[#38BDF8] transition-colors">
              Placement Guidelines
            </Link>
            <Link href="/#about" className="hover:text-[#38BDF8] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
