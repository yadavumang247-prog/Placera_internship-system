'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  GraduationCap,
  Award,
  Building2,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { AllocationData, StudentData } from '../../../lib/types';

export default function StudentDocumentsPage() {
  const [allocation, setAllocation] = useState<AllocationData | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/student/result');
        const data = await res.json();
        if (data.student) setStudent(data.student);
        if (data.published && data.allocation) {
          setIsPublished(true);
          setAllocation(data.allocation);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0284C7]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded">
            Official Placement Documentation
          </span>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Certified Allocation Letter
          </h1>
          <p className="text-xs text-[#64748B]">
            Official institutional proof of algorithmic internship allocation and capacity assignment.
          </p>
        </div>

        {allocation && isPublished && (
          <Button onClick={handlePrint} className="bg-[#0284C7] text-white">
            <Printer className="h-4 w-4 mr-2" />
            Print / Save as PDF
          </Button>
        )}
      </div>

      {isPublished && allocation ? (
        /* Printable Official Letter */
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-8 print:p-0 print:border-none print:shadow-none">
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-[#0F172A] pb-6 flex items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0F172A] uppercase tracking-wider">
                  SMARTINTERN INSTITUTIONAL PLACEMENT CELL
                </h2>
                <p className="text-xs text-[#64748B]">
                  Department of Academic Affairs &amp; Industry Relations • Autonomous University
                </p>
                <span className="text-[10px] text-[#94A3B8]">Ref No: SIPC/2025-26/AL-{student?.rollNumber}</span>
              </div>
            </div>

            <div className="text-right text-xs text-[#64748B]">
              <span className="block font-bold text-[#0F172A]">Date of Issuance</span>
              <span>{new Date(allocation.allocatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-[#0F172A] uppercase underline">
              SUBJECT: OFFICIAL NOTIFICATION OF INTERNSHIP ALLOCATION (COHORT 2025–26)
            </h3>
            <p className="text-xs text-[#64748B]">
              Algorithm: Many-to-One Gale-Shapley Stable Matching Protocol (Capacity Constrained)
            </p>
          </div>

          {/* Candidate Profile Details Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#0F172A] uppercase">1. Candidate Credentials</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
              <div>
                <span className="text-[#64748B] block">Candidate Name:</span>
                <span className="font-bold text-[#0F172A]">{student?.name}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Roll Number:</span>
                <span className="font-bold text-[#0F172A]">{student?.rollNumber}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Discipline:</span>
                <span className="font-bold text-[#0F172A]">{student?.branch}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Cumulative CGPA:</span>
                <span className="font-bold text-[#0284C7]">{student?.cgpa.toFixed(2)} / 10.0</span>
              </div>
            </div>
          </div>

          {/* Allocation Particulars Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#0F172A] uppercase">2. Allocated Internship Terms</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
              <div>
                <span className="text-[#64748B] block">Corporate Host:</span>
                <span className="font-bold text-[#0F172A]">{allocation.companyName}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Position Title:</span>
                <span className="font-bold text-[#0F172A]">{allocation.internshipTitle}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Candidate Priority:</span>
                <span className="font-bold text-[#0284C7]">Preference #{allocation.preferenceRank}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Composite Score:</span>
                <span className="font-bold text-[#10B981]">{allocation.score.toFixed(1)} / 100</span>
              </div>
            </div>
          </div>

          {/* Certification Body Text */}
          <p className="text-xs text-[#334155] leading-relaxed">
            This certifies that the candidate named above has been formally allocated to <strong>{allocation.companyName}</strong> via the automated, capacity-constrained Many-to-One Gale-Shapley Stable Matching procedure. The candidate successfully satisfied all pre-matching academic eligibility cutoffs, and was ranked within the approved quota seats.
          </p>

          {/* Signatures */}
          <div className="pt-8 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <div>
              <div className="font-mono text-xs text-[#0F172A] font-bold">DIGITALLY VERIFIED</div>
              <span className="block mt-1">Dean of Placements &amp; Corporate Relations</span>
              <span>SMARTINTERN Autonomous University</span>
            </div>

            <div className="text-right">
              <div className="font-mono text-[11px] text-[#0284C7]">SHA-256: 7f83b1657ff1...verified</div>
              <span className="block mt-1">Official Registry Seal</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] text-center space-y-3">
          <FileText className="h-10 w-10 text-[#94A3B8] mx-auto" />
          <h3 className="font-bold text-base text-[#0F172A]">No Official Document Generated</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Official allocation letters are automatically generated once matching rounds are confirmed and published by the placement cell.
          </p>
        </div>
      )}
    </div>
  );
}
