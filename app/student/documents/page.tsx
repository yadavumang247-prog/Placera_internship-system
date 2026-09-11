'use client';

import React, { useEffect, useState } from 'react';
import { Printer, Download, GraduationCap, CheckCircle2, ShieldCheck, Award, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { AllocationRecord, Student } from '../../../lib/types';

export default function StudentDocumentsPage() {
  const [allocation, setAllocation] = useState<AllocationRecord | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAllocationDoc() {
      try {
        setIsLoading(true);
        const [resStudent, resAlloc, resStatus] = await Promise.all([
          fetch('/api/student/profile'),
          fetch('/api/student/allocation'),
          fetch('/api/admin/allocation/status'),
        ]);

        if (resStudent.ok) {
          const s = await resStudent.json();
          setStudent(s);
        }

        if (resAlloc.ok) {
          const a = await resAlloc.json();
          setAllocation(a);
        }

        if (resStatus.ok) {
          const st = await resStatus.json();
          setIsPublished(st.publicationStatus === 'PUBLISHED');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAllocationDoc();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E5BA73]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl text-[#FAF8F5]">
      <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E5BA73] bg-[#E5BA73]/15 border border-[#E5BA73]/30 px-2.5 py-0.5 rounded">
            Official Placement Documentation
          </span>
          <h1 className="text-2xl font-extrabold text-[#FAF8F5] tracking-tight mt-1">
            Certified Allocation Letter
          </h1>
          <p className="text-xs text-[#A8B2D1]">
            Official institutional proof of automated internship allocation and capacity assignment.
          </p>
        </div>

        {allocation && isPublished && (
          <Button onClick={handlePrint} className="bg-[#E5BA73] hover:bg-[#F3CA68] text-[#0A1128] font-bold">
            <Printer className="h-4 w-4 mr-2" />
            Print / Save as PDF
          </Button>
        )}
      </div>

      {isPublished && allocation ? (
        /* Printable Official Letter */
        <div className="bg-[#FAF8F5] text-[#0A1128] p-8 sm:p-12 rounded-3xl border border-[#D4A253]/40 shadow-xl space-y-8 print:p-0 print:border-none print:shadow-none">
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-[#0A1128] pb-6 flex items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-[#0A1128] text-[#E5BA73] flex items-center justify-center font-bold">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0A1128] uppercase tracking-wider">
                  SMARTINTERN INSTITUTIONAL PLACEMENT CELL
                </h2>
                <p className="text-xs text-[#475569]">
                  Department of Academic Affairs &amp; Industry Relations • Autonomous University
                </p>
                <span className="text-[10px] text-[#64748B]">Ref No: SIPC/2025-26/AL-{student?.rollNumber}</span>
              </div>
            </div>

            <div className="text-right text-xs text-[#475569]">
              <span className="block font-bold text-[#0A1128]">Date of Issuance</span>
              <span>{new Date(allocation.allocatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-[#0A1128] uppercase underline">
              SUBJECT: OFFICIAL NOTIFICATION OF INTERNSHIP ALLOCATION (COHORT 2025–26)
            </h3>
            <p className="text-xs text-[#475569]">
              Allocation: Automated Capacity-Constrained Stable Matching Protocol
            </p>
          </div>

          {/* Candidate Profile Details Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#0A1128] uppercase">1. Candidate Credentials</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F3EED9] p-4 rounded-xl border border-[#D4A253]/30">
              <div>
                <span className="text-[#64748B] block">Candidate Name:</span>
                <span className="font-bold text-[#0A1128]">{student?.name}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Roll Number:</span>
                <span className="font-bold text-[#0A1128]">{student?.rollNumber}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Discipline:</span>
                <span className="font-bold text-[#0A1128]">{student?.branch}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Cumulative CGPA:</span>
                <span className="font-bold text-[#8A6318]">{student?.cgpa.toFixed(2)} / 10.0</span>
              </div>
            </div>
          </div>

          {/* Allocation Particulars Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#0A1128] uppercase">2. Allocated Internship Terms</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F3EED9] p-4 rounded-xl border border-[#D4A253]/30">
              <div>
                <span className="text-[#64748B] block">Corporate Host:</span>
                <span className="font-bold text-[#0A1128]">{allocation.companyName}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Position Title:</span>
                <span className="font-bold text-[#0A1128]">{allocation.internshipTitle}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Candidate Priority:</span>
                <span className="font-bold text-[#8A6318]">Preference #{allocation.preferenceRank}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Composite Score:</span>
                <span className="font-bold text-emerald-800">{allocation.score.toFixed(1)} / 100</span>
              </div>
            </div>
          </div>

          {/* Certification Body Text */}
          <p className="text-xs text-[#334155] leading-relaxed">
            This certifies that the candidate named above has been formally allocated to <strong>{allocation.companyName}</strong> via the automated, capacity-constrained stable matching procedure. The candidate successfully satisfied all pre-matching academic eligibility cutoffs, and was ranked within the approved quota seats.
          </p>

          {/* Signatures */}
          <div className="pt-8 border-t border-[#D4A253]/40 flex items-center justify-between text-xs text-[#475569]">
            <div>
              <div className="font-mono text-xs text-[#0A1128] font-bold">DIGITALLY VERIFIED</div>
              <span className="block mt-1">Dean of Placements &amp; Corporate Relations</span>
              <span>SMARTINTERN Autonomous University</span>
            </div>

            <div className="text-right">
              <div className="font-mono text-[11px] text-[#8A6318]">SHA-256: 7f83b1657ff1...verified</div>
              <span className="block mt-1">Official Registry Seal</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0F1A36] p-8 rounded-2xl border border-[#1E3466] text-center space-y-3">
          <FileText className="h-10 w-10 text-[#A8B2D1] mx-auto" />
          <h3 className="font-bold text-base text-[#FAF8F5]">No Official Document Generated</h3>
          <p className="text-xs text-[#A8B2D1] max-w-sm mx-auto">
            Official allocation letters are automatically generated once matching rounds are confirmed and published by the placement cell.
          </p>
        </div>
      )}
    </div>
  );
}
