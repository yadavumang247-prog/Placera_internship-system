'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Award,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Calendar,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { useToast } from '../../../components/ui/toast';
import { InternshipData, StudentData, UserSession } from '../../../lib/types';
import { checkEligibility } from '../../../lib/algorithm/eligibilityEngine';
import { calculateMeritScore } from '../../../lib/algorithm/meritCalculator';

export default function InternshipDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [internship, setInternship] = useState<InternshipData | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingPreference, setIsAddingPreference] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const internId = params.id as string;
        const res = await fetch(`/api/internships/${internId}`);
        const data = await res.json();
        if (!res.ok || !data.internship) {
          throw new Error(data.error || 'Internship not found');
        }
        setInternship(data.internship);

        // Fetch authenticated student profile if available
        try {
          const authRes = await fetch('/api/auth/me').then((r) => r.json());
          if (authRes.authenticated && authRes.user) {
            setUser(authRes.user);
            if (authRes.user.role === 'STUDENT') {
              const studRes = await fetch('/api/student/profile').then((r) => r.json());
              if (studRes.student) {
                setStudent(studRes.student);
              }
            }
          }
        } catch (authErr) {
          // Public browsing
        }
      } catch (err: any) {
        showError(err.message || 'Error loading internship details.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [params.id, showError]);

  const handleAddToPreferences = async () => {
    if (!user) {
      router.push(`/login?redirect=/internships/${params.id}`);
      return;
    }
    if (user.role !== 'STUDENT') {
      showError('Only students can submit preferences.');
      return;
    }

    setIsAddingPreference(true);
    try {
      // Fetch current preferences
      const prefRes = await fetch('/api/student/preferences').then((r) => r.json());
      const currentPrefs: string[] = (prefRes.preferences || []).map((p: any) => p.internshipId);

      if (currentPrefs.includes(params.id as string)) {
        showError('This internship is already in your preference ranking list.');
        setIsAddingPreference(false);
        return;
      }

      currentPrefs.push(params.id as string);

      const saveRes = await fetch('/api/student/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipIds: currentPrefs }),
      });

      const resData = await saveRes.json();
      if (!saveRes.ok) throw new Error(resData.error);

      success('Internship added to your preference ranking list!');
      router.push('/student/preferences');
    } catch (err: any) {
      showError(err.message || 'Failed to update preferences.');
    } finally {
      setIsAddingPreference(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0284C7]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h1 className="text-2xl font-bold text-[#0F172A]">Internship Not Found</h1>
          <p className="text-sm text-[#64748B]">The requested internship does not exist or has been archived.</p>
          <Link href="/internships">
            <Button className="bg-[#0284C7] text-white">Back to Directory</Button>
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs & Back */}
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link href="/internships" className="hover:text-[#0284C7] flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Directory</span>
            </Link>
            <span>/</span>
            <span className="text-[#0F172A] font-medium">{internship.companyName}</span>
            <span>/</span>
            <span className="truncate">{internship.title}</span>
          </div>

          {/* Hero Header Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-1 rounded">
                    {internship.companyName}
                  </span>
                  <Badge variant="outline" className="border-[#BAE6FD] bg-[#EFF6FF] text-[#0369A1] text-xs">
                    {internship.mode}
                  </Badge>
                  <span className="text-xs text-[#64748B]">• Capacity: {internship.totalSeats} Seats</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  {internship.title}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-[#64748B] pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#94A3B8]" />
                    <span>{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#94A3B8]" />
                    <span>{internship.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                    <span>₹{internship.stipend.toLocaleString()} / month</span>
                  </div>
                </div>
              </div>

              {/* Apply / Add to preferences CTA */}
              <div className="flex flex-col gap-2 shrink-0 sm:w-60">
                <Button
                  onClick={handleAddToPreferences}
                  disabled={isAddingPreference || (eligibility !== null && !eligibility.isEligible)}
                  className={`w-full py-6 font-semibold shadow-sm ${
                    eligibility !== null && !eligibility.isEligible
                      ? 'bg-[#94A3B8] cursor-not-allowed text-white'
                      : 'bg-[#0284C7] hover:bg-[#0369A1] text-white'
                  }`}
                >
                  {isAddingPreference
                    ? 'Saving...'
                    : eligibility !== null && !eligibility.isEligible
                    ? 'Ineligible for Role'
                    : 'Add to My Preferences'}
                </Button>
                {student && (
                  <p className="text-[11px] text-center text-[#64748B]">
                    Ranks in your Gale-Shapley matching schedule
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Overview, Responsibilities, Selection Criteria */}
            <div className="lg:col-span-8 space-y-6">
              {/* Overview */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
                <h2 className="text-lg font-bold text-[#0F172A]">Role Overview</h2>
                <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                  {internship.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#0F172A]">Key Responsibilities</h2>
                <ul className="space-y-2.5 text-sm text-[#475569]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>Architect, implement, and unit-test production-ready code aligned with engineering specifications.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>Collaborate with senior engineering mentors, participate in daily agile standups and code reviews.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>Optimize algorithms for execution latency, resource footprint, and fault tolerance.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>Present a final capstone technical presentation to department engineering leadership.</span>
                  </li>
                </ul>
              </div>

              {/* Required Skills */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
                <h2 className="text-lg font-bold text-[#0F172A]">Required Technical Competencies</h2>
                <p className="text-xs text-[#64748B]">Candidates are evaluated on knowledge and project experience in:</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {internship.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selection & Matching Criteria */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
                <h2 className="text-lg font-bold text-[#0F172A]">Algorithmic Selection Criteria</h2>
                <p className="text-xs text-[#64748B]">
                  Company candidate tie-breaking during the Gale-Shapley matching rounds is governed by the following merit weighting:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                    <div className="text-lg font-extrabold text-[#0284C7]">40%</div>
                    <div className="text-xs text-[#64748B] mt-0.5">Skill Match</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                    <div className="text-lg font-extrabold text-[#0284C7]">30%</div>
                    <div className="text-xs text-[#64748B] mt-0.5">CGPA Cutoff</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                    <div className="text-lg font-extrabold text-[#0284C7]">20%</div>
                    <div className="text-xs text-[#64748B] mt-0.5">Experience</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                    <div className="text-lg font-extrabold text-[#0284C7]">10%</div>
                    <div className="text-xs text-[#64748B] mt-0.5">Branch Fit</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Eligibility Breakdown & Application Stats */}
            <div className="lg:col-span-4 space-y-6">
              {/* Live Eligibility Status Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#0F172A] text-base">Eligibility Check</h3>
                  {student && (
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        eligibility?.isEligible
                          ? 'border-[#34D399] bg-[#ECFDF5] text-[#065F46]'
                          : 'border-[#F87171] bg-[#FEF2F2] text-[#991B1B]'
                      }`}
                    >
                      {eligibility?.isEligible ? 'Eligible' : 'Not Eligible'}
                    </Badge>
                  )}
                </div>

                {student ? (
                  <div className="space-y-3 pt-1">
                    <div className="text-xs text-[#64748B]">
                      Evaluating criteria for <strong className="text-[#0F172A]">{student.name}</strong> ({student.rollNumber}):
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* CGPA */}
                      <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                        <div>
                          <span className="font-semibold text-[#0F172A] block">Minimum CGPA</span>
                          <span className="text-[#64748B]">
                            Required: {internship.minimumCGPA.toFixed(1)} • Your CGPA: {student.cgpa.toFixed(2)}
                          </span>
                        </div>
                        {student.cgpa >= internship.minimumCGPA ? (
                          <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
                        )}
                      </div>

                      {/* Branch */}
                      <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                        <div>
                          <span className="font-semibold text-[#0F172A] block">Allowed Branch</span>
                          <span className="text-[#64748B]">
                            Your Branch: {student.branch}
                          </span>
                        </div>
                        {eligibility?.branchSatisfied ? (
                          <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
                        )}
                      </div>

                      {/* Skills */}
                      <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                        <div>
                          <span className="font-semibold text-[#0F172A] block">Skills Match</span>
                          <span className="text-[#64748B]">
                            {eligibility?.matchedSkills.length} of {internship.requiredSkills.length} matched ({eligibility?.skillMatchPercentage}%)
                          </span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                      </div>

                      {/* Graduation Year */}
                      <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                        <div>
                          <span className="font-semibold text-[#0F172A] block">Graduation Cohort</span>
                          <span className="text-[#64748B]">Year {student.year} (Class of {student.graduationYear || 2026})</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                      </div>
                    </div>

                    {/* Merit preview if eligible */}
                    {merit && eligibility?.isEligible && (
                      <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BAE6FD] text-xs space-y-1 mt-2">
                        <div className="flex items-center justify-between font-bold text-[#0284C7]">
                          <span>Estimated Candidate Merit Score</span>
                          <span>{merit.totalMeritScore.toFixed(1)} / 100</span>
                        </div>
                        <p className="text-[11px] text-[#475569]">
                          Based on 40% skill match ({merit.skillScore}%), 30% CGPA ({merit.cgpaScore}%), 20% experience, and 10% branch relevance.
                        </p>
                      </div>
                    )}

                    {!eligibility?.isEligible && (
                      <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B] space-y-1 mt-2">
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
                    <p className="text-xs text-[#64748B]">
                      Sign in as a student to see your real-time criteria pass/fail status and calculated candidate merit score.
                    </p>
                    <Link href="/login">
                      <Button size="sm" variant="outline" className="text-xs border-[#CBD5E1]">
                        Sign In to Check Eligibility
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Opportunity Metadata Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-[#0F172A] text-sm">Key Specifications</h3>
                <div className="space-y-2 text-[#475569]">
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Quota Seats</span>
                    <span className="font-semibold text-[#0F172A]">{internship.totalSeats} Positions</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Work Mode</span>
                    <span className="font-semibold text-[#0F172A]">{internship.mode}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Compensation</span>
                    <span className="font-semibold text-[#0F172A]">₹{internship.stipend.toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Tenure</span>
                    <span className="font-semibold text-[#0F172A]">{internship.duration}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#64748B]">Deadline</span>
                    <span className="font-semibold text-[#0F172A]">
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
