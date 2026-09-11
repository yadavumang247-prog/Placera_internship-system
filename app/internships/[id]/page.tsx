'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Share2,
} from 'lucide-react';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../components/ui/toast';
import { Internship, Student } from '../../../lib/types';
import { checkEligibility } from '../../../lib/algorithm/eligibilityEngine';
import { calculateMeritScore } from '../../../lib/algorithm/meritCalculator';

export default function InternshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { success, error: showError, warning, info } = useToast();

  const [internship, setInternship] = useState<Internship | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingPreference, setIsAddingPreference] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // 1. Fetch internship details
        const resIntern = await fetch(`/api/internships/${id}`);
        if (!resIntern.ok) throw new Error('Internship not found');
        const dataIntern = await resIntern.json();
        setInternship(dataIntern);

        // 2. Fetch student profile if authenticated
        const resStudent = await fetch('/api/student/profile');
        if (resStudent.ok) {
          const dataStudent = await resStudent.json();
          setStudent(dataStudent);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) loadData();
  }, [id]);

  const handleAddToPreferences = async () => {
    if (!student) {
      router.push(`/login?redirect=/internships/${id}`);
      return;
    }

    if (!internship) return;

    // Pre-check eligibility
    const elig = checkEligibility(student, internship);
    if (!elig.isEligible) {
      warning('Eligibility Requirements Not Met', elig.failedCriteria.join('; '));
      return;
    }

    try {
      setIsAddingPreference(true);
      // Fetch existing preferences to append to the bottom
      const prefRes = await fetch('/api/student/preferences');
      let currentPrefs: string[] = [];
      if (prefRes.ok) {
        const prefData = await prefRes.json();
        currentPrefs = prefData.map((p: any) => p.internshipId);
      }

      if (currentPrefs.includes(internship.id)) {
        info('Already in Preferences', 'This internship is already in your preference ranking list.');
        setIsAddingPreference(false);
        return;
      }

      const updatedList = [...currentPrefs, internship.id];

      const saveRes = await fetch('/api/student/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferenceIds: updatedList }),
      });

      if (!saveRes.ok) {
        const errData = await saveRes.json();
        throw new Error(errData.error || 'Failed to update preferences');
      }

      success(
        'Added to Preferences!',
        `Ranked #${updatedList.length} in your allocation matching schedule.`
      );
    } catch (err: any) {
      showError('Could not save preference', err.message);
    } finally {
      setIsAddingPreference(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0A1128]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E5BA73]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0A1128]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-rose-400" />
          <h1 className="text-2xl font-bold text-[#FAF8F5]">Internship Not Found</h1>
          <p className="text-sm text-[#A8B2D1]">The requested internship does not exist or has been archived.</p>
          <Link href="/internships">
            <Button className="bg-[#E5BA73] hover:bg-[#F3CA68] text-[#0A1128] font-bold">Back to Directory</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate live eligibility if student profile is loaded
  const eligibility = student ? checkEligibility(student, internship) : null;
  const merit = student ? calculateMeritScore(student, internship) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1128] text-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs & Back */}
          <div className="flex items-center gap-2 text-xs text-[#A8B2D1]">
            <Link href="/internships" className="hover:text-[#E5BA73] flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Directory</span>
            </Link>
            <span>/</span>
            <span className="text-[#FAF8F5] font-medium">{internship.companyName}</span>
            <span>/</span>
            <span className="truncate">{internship.title}</span>
          </div>

          {/* Hero Header Card */}
          <div className="bg-[#0F1A36] p-6 sm:p-8 rounded-2xl border border-[#1E3466] shadow-md">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#E5BA73] bg-[#E5BA73]/15 border border-[#E5BA73]/30 px-2.5 py-1 rounded">
                    {internship.companyName}
                  </span>
                  <Badge variant="outline" className="border-[#1E3466] bg-[#142247] text-[#FAF8F5] text-xs">
                    {internship.mode}
                  </Badge>
                  <span className="text-xs text-[#A8B2D1]">• Capacity: {internship.totalSeats} Seats</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FAF8F5] tracking-tight">
                  {internship.title}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-[#A8B2D1] pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#E5BA73]" />
                    <span>{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#E5BA73]" />
                    <span>{internship.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-[#FAF8F5]">
                    <span>₹{internship.stipend.toLocaleString()} / month</span>
                  </div>
                </div>
              </div>

              {/* Apply / Add to preferences CTA */}
              <div className="flex flex-col gap-2 shrink-0 sm:w-60">
                <Button
                  onClick={handleAddToPreferences}
                  disabled={isAddingPreference || (eligibility !== null && !eligibility.isEligible)}
                  className={`w-full py-6 font-bold shadow-sm ${
                    eligibility !== null && !eligibility.isEligible
                      ? 'bg-[#142247] border border-[#1E3466] cursor-not-allowed text-[#A8B2D1]'
                      : 'bg-[#E5BA73] hover:bg-[#F3CA68] text-[#0A1128]'
                  }`}
                >
                  {isAddingPreference
                    ? 'Saving...'
                    : eligibility !== null && !eligibility.isEligible
                    ? 'Ineligible for Role'
                    : 'Add to My Preferences'}
                </Button>
                {student && (
                  <p className="text-[11px] text-center text-[#A8B2D1]">
                    Ranks in your placement matching schedule
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Overview, Responsibilities, Selection Criteria */}
            <div className="lg:col-span-8 space-y-6">
              {/* Overview */}
              <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md space-y-3">
                <h2 className="text-lg font-bold text-[#FAF8F5]">Role Overview</h2>
                <p className="text-sm text-[#D8CEBC] leading-relaxed whitespace-pre-line">
                  {internship.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md space-y-4">
                <h2 className="text-lg font-bold text-[#FAF8F5]">Key Responsibilities</h2>
                <ul className="space-y-2.5 text-sm text-[#D8CEBC]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#E5BA73] shrink-0 mt-0.5" />
                    <span>Architect, implement, and unit-test production-ready code aligned with engineering specifications.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#E5BA73] shrink-0 mt-0.5" />
                    <span>Collaborate with senior engineering mentors, participate in daily agile standups and code reviews.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#E5BA73] shrink-0 mt-0.5" />
                    <span>Optimize algorithms for execution latency, resource footprint, and fault tolerance.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#E5BA73] shrink-0 mt-0.5" />
                    <span>Present a final capstone technical presentation to department engineering leadership.</span>
                  </li>
                </ul>
              </div>

              {/* Required Skills */}
              <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md space-y-3">
                <h2 className="text-lg font-bold text-[#FAF8F5]">Required Technical Competencies</h2>
                <p className="text-xs text-[#A8B2D1]">Candidates are evaluated on knowledge and project experience in:</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {internship.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-[#142247] border border-[#1E3466] text-xs font-semibold text-[#FAF8F5]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selection & Matching Criteria */}
              <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md space-y-3">
                <h2 className="text-lg font-bold text-[#FAF8F5]">Selection Merit Weights</h2>
                <p className="text-xs text-[#A8B2D1]">
                  Candidate priority during matching rounds is governed by the following merit weighting:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#142247] border border-[#1E3466] text-center">
                    <div className="text-lg font-extrabold text-[#E5BA73]">40%</div>
                    <div className="text-xs text-[#A8B2D1] mt-0.5">Skill Match</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#142247] border border-[#1E3466] text-center">
                    <div className="text-lg font-extrabold text-[#E5BA73]">30%</div>
                    <div className="text-xs text-[#A8B2D1] mt-0.5">CGPA Cutoff</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#142247] border border-[#1E3466] text-center">
                    <div className="text-lg font-extrabold text-[#E5BA73]">20%</div>
                    <div className="text-xs text-[#A8B2D1] mt-0.5">Experience</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#142247] border border-[#1E3466] text-center">
                    <div className="text-lg font-extrabold text-[#E5BA73]">10%</div>
                    <div className="text-xs text-[#A8B2D1] mt-0.5">Branch Fit</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Eligibility Breakdown & Application Stats */}
            <div className="lg:col-span-4 space-y-6">
              {/* Live Eligibility Status Card */}
              <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#FAF8F5] text-base">Eligibility Check</h3>
                  {student && (
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        eligibility?.isEligible
                          ? 'border-emerald-500/30 bg-emerald-900/30 text-emerald-400'
                          : 'border-rose-500/30 bg-rose-900/30 text-rose-400'
                      }`}
                    >
                      {eligibility?.isEligible ? 'Eligible' : 'Not Eligible'}
                    </Badge>
                  )}
                </div>

                {student ? (
                  <div className="space-y-3 pt-1">
                    <div className="text-xs text-[#A8B2D1]">
                      Evaluating criteria for <strong className="text-[#FAF8F5]">{student.name}</strong> ({student.rollNumber}):
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* CGPA */}
                      <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#142247] border border-[#1E3466]">
                        <div>
                          <span className="font-semibold text-[#FAF8F5] block">Minimum CGPA</span>
                          <span className="text-[#A8B2D1]">
                            Required: {internship.minimumCGPA.toFixed(1)} • Your CGPA: {student.cgpa.toFixed(2)}
                          </span>
                        </div>
                        {student.cgpa >= internship.minimumCGPA ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                      </div>

                      {/* Branch */}
                      <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#142247] border border-[#1E3466]">
                        <div>
                          <span className="font-semibold text-[#FAF8F5] block">Allowed Branch</span>
                          <span className="text-[#A8B2D1]">
                            Your Branch: {student.branch}
                          </span>
                        </div>
                        {eligibility?.branchSatisfied ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                      </div>

                      {/* Skills */}
                      <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#142247] border border-[#1E3466]">
                        <div>
                          <span className="font-semibold text-[#FAF8F5] block">Skills Match</span>
                          <span className="text-[#A8B2D1]">
                            {eligibility?.matchedSkills.length} of {internship.requiredSkills.length} matched ({eligibility?.skillMatchPercentage}%)
                          </span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      </div>

                      {/* Graduation Cohort */}
                      <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#142247] border border-[#1E3466]">
                        <div>
                          <span className="font-semibold text-[#FAF8F5] block">Graduation Cohort</span>
                          <span className="text-[#A8B2D1]">Year {student.year} (Class of {student.graduationYear || 2026})</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      </div>
                    </div>

                    {/* Merit preview if eligible */}
                    {merit && eligibility?.isEligible && (
                      <div className="p-3 rounded-xl bg-[#E5BA73]/10 border border-[#E5BA73]/30 text-xs space-y-1 mt-2">
                        <div className="flex items-center justify-between font-bold text-[#E5BA73]">
                          <span>Estimated Candidate Merit Score</span>
                          <span>{merit.totalMeritScore.toFixed(1)} / 100</span>
                        </div>
                        <p className="text-[11px] text-[#A8B2D1]">
                          Based on 40% skill match ({merit.skillScore}%), 30% CGPA ({merit.cgpaScore}%), 20% experience, and 10% branch relevance.
                        </p>
                      </div>
                    )}

                    {!eligibility?.isEligible && (
                      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 space-y-1 mt-2">
                        <span className="font-bold block">Why not eligible?</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                          {eligibility?.failedCriteria.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <p className="text-xs text-[#A8B2D1]">
                      Sign in as a student to see your real-time criteria pass/fail status and calculated candidate merit score.
                    </p>
                    <Link href="/login">
                      <Button size="sm" variant="outline" className="text-xs border-[#1E3466] bg-[#142247] text-[#FAF8F5] hover:bg-[#1E3466]">
                        Sign In to Check Eligibility
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Opportunity Metadata Card */}
              <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md space-y-3 text-xs">
                <h3 className="font-bold text-[#FAF8F5] text-sm">Key Specifications</h3>
                <div className="space-y-2 text-[#A8B2D1]">
                  <div className="flex justify-between py-1 border-b border-[#1E3466]">
                    <span>Quota Seats</span>
                    <span className="font-semibold text-[#FAF8F5]">{internship.totalSeats} Positions</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E3466]">
                    <span>Work Mode</span>
                    <span className="font-semibold text-[#FAF8F5]">{internship.mode}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E3466]">
                    <span>Compensation</span>
                    <span className="font-semibold text-[#FAF8F5]">₹{internship.stipend.toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E3466]">
                    <span>Tenure</span>
                    <span className="font-semibold text-[#FAF8F5]">{internship.duration}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Deadline</span>
                    <span className="font-semibold text-[#FAF8F5]">
                      {new Date(internship.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
