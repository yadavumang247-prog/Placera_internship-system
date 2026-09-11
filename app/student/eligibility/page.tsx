'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Student, Internship } from '../../../lib/types';
import { checkEligibility } from '../../../lib/algorithm/eligibilityEngine';
import { calculateMeritScore } from '../../../lib/algorithm/meritCalculator';

export default function StudentEligibilityPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [resStudent, resInterns] = await Promise.all([
          fetch('/api/student/profile'),
          fetch('/api/internships'),
        ]);

        if (resStudent.ok) {
          const sData = await resStudent.json();
          setStudent(sData);
        }

        if (resInterns.ok) {
          const iData = await resInterns.json();
          setInternships(iData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E5BA73]" />
      </div>
    );
  }

  const eligibleTracks = student
    ? internships.filter((i) => checkEligibility(student, i).isEligible)
    : [];

  return (
    <div className="space-y-8 max-w-5xl text-[#FAF8F5]">
      {/* Header */}
      <div className="bg-[#0F1A36] p-6 sm:p-8 rounded-2xl border border-[#1E3466] shadow-md space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E5BA73] bg-[#E5BA73]/15 border border-[#E5BA73]/30 px-2.5 py-0.5 rounded">
            Pre-Matching Engine
          </span>
          <span className="text-xs text-emerald-400 font-semibold">
            {eligibleTracks.length} of {internships.length} Tracks Eligible
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FAF8F5] tracking-tight">
          Eligibility Matrix &amp; Verification
        </h1>
        <p className="text-xs sm:text-sm text-[#A8B2D1]">
          Before proposing candidates to internships, the SMARTINTERN engine filters out any pair that violates academic regulations. Below is your personalized status across every track.
        </p>
      </div>

      {/* Student Credentials Strip */}
      <div className="bg-[#142247] border border-[#1E3466] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-[#A8B2D1] block">Candidate:</span>
          <span className="font-bold text-[#FAF8F5] text-sm">{student?.name} ({student?.rollNumber})</span>
        </div>
        <div>
          <span className="text-[#A8B2D1] block">Department:</span>
          <span className="font-bold text-[#FAF8F5]">{student?.branch}</span>
        </div>
        <div>
          <span className="text-[#A8B2D1] block">Verified CGPA:</span>
          <span className="font-bold text-[#E5BA73] text-sm">{student?.cgpa.toFixed(2)} / 10.0</span>
        </div>
        <div>
          <span className="text-[#A8B2D1] block">Skills Registered:</span>
          <span className="font-bold text-[#FAF8F5]">{student?.skills.length} Technical Skills</span>
        </div>
        <Link href="/student/profile">
          <Button size="sm" variant="outline" className="border-[#E5BA73]/50 text-[#E5BA73] bg-[#0F1A36] hover:bg-[#E5BA73] hover:text-[#0A1128] font-semibold">
            Update Profile
          </Button>
        </Link>
      </div>

      {/* Matrix Table */}
      <div className="bg-[#0F1A36] rounded-2xl border border-[#1E3466] shadow-md overflow-hidden">
        <div className="p-4 border-b border-[#1E3466] font-bold text-sm text-[#FAF8F5]">
          Internship Eligibility Breakdown
        </div>

        <div className="divide-y divide-[#1E3466]">
          {internships.map((intern) => {
            const elig = student ? checkEligibility(student, intern) : null;
            const merit = student && elig?.isEligible ? calculateMeritScore(student, intern) : null;

            return (
              <div key={intern.id} className="p-5 hover:bg-[#142247]/50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#E5BA73] uppercase">{intern.companyName}</span>
                    <h3 className="font-bold text-base text-[#FAF8F5]">{intern.title}</h3>
                    <p className="text-xs text-[#A8B2D1]">
                      {intern.mode} • ₹{intern.stipend.toLocaleString()}/mo • {intern.totalSeats} seats
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {elig?.isEligible ? (
                      <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-500/30 text-xs font-semibold px-3 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                        Eligible ({elig.skillMatchPercentage}% skills)
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-900/30 text-rose-400 border-rose-500/30 text-xs font-semibold px-3 py-1">
                        <XCircle className="h-3.5 w-3.5 mr-1 text-rose-400" />
                        Not Eligible
                      </Badge>
                    )}

                    <Link href={`/internships/${intern.id}`}>
                      <Button size="sm" variant="outline" className="text-xs border-[#1E3466] bg-[#142247] text-[#FAF8F5] hover:bg-[#1E3466]">
                        View Role
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Criteria Checklist Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  {/* CGPA */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#142247] border border-[#1E3466]">
                    {student && student.cgpa >= intern.minimumCGPA ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold block text-[#FAF8F5]">CGPA Requirement</span>
                      <span className="text-[11px] text-[#A8B2D1]">
                        Min {intern.minimumCGPA.toFixed(1)} (You: {student?.cgpa.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  {/* Branch */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#142247] border border-[#1E3466]">
                    {elig?.branchSatisfied ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold block text-[#FAF8F5]">Branch Match</span>
                      <span className="text-[11px] text-[#A8B2D1] truncate block max-w-[200px]">
                        {elig?.branchSatisfied ? 'Approved discipline' : 'Branch excluded'}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Merit */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#142247] border border-[#1E3466]">
                    <Sparkles className="h-4 w-4 text-[#E5BA73] shrink-0" />
                    <div>
                      <span className="font-semibold block text-[#FAF8F5]">Estimated Merit</span>
                      <span className="text-[11px] text-[#E5BA73] font-bold">
                        {merit ? `${merit.totalMeritScore.toFixed(1)} / 100` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {!elig?.isEligible && (
                  <div className="text-xs text-rose-300 bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/30">
                    <strong>Rejection reason: </strong>
                    {elig?.failedCriteria.join('; ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
