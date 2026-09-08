import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Building2,
  Layers,
  MapPin,
  Clock,
  ArrowRight,
  LogIn,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { dataService } from '../lib/db/dataService';

export default async function HomePage() {
  const [internships, students, companies] = await Promise.all([
    dataService.getInternships(),
    dataService.getStudents(),
    dataService.getCompanies(),
  ]);

  const totalSeats = internships.reduce((acc, i) => acc + i.totalSeats, 0);
  const featuredInternships = internships.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* Simple Institutional Hero */}
        <section className="bg-[#0F172A] border-b border-[#1E293B] py-14 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E293B] text-[#38BDF8] text-xs font-semibold border border-[#334155]">
              <GraduationCap className="h-4 w-4" />
              <span>College Training &amp; Placement Cell</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Find the right internship. Build your career.
            </h1>

            <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
              Explore internship opportunities, manage your preferences, verify algorithmic eligibility, and view confirmed allocation results through one centralized college portal.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link href="/internships" className="w-full sm:w-auto">
                <Button size="md" className="w-full sm:w-auto bg-[#0284C7] hover:bg-[#0369A1] text-white">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View Internships
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="md" variant="outline" className="w-full sm:w-auto border-[#334155] bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC]">
                  <LogIn className="h-4 w-4 mr-2" />
                  Portal Login
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Compact Statistics Row */}
        <section className="bg-[#0B1120] border-b border-[#1E293B] py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-[#1E293B]">
              <div className="p-2">
                <div className="text-2xl font-bold text-[#38BDF8]">{internships.length}</div>
                <div className="text-xs text-[#94A3B8] font-medium mt-0.5">Active Internships</div>
              </div>
              <div className="p-2">
                <div className="text-2xl font-bold text-[#38BDF8]">{students.length}</div>
                <div className="text-xs text-[#94A3B8] font-medium mt-0.5">Registered Students</div>
              </div>
              <div className="p-2">
                <div className="text-2xl font-bold text-[#38BDF8]">{companies.length}</div>
                <div className="text-xs text-[#94A3B8] font-medium mt-0.5">Partner Companies</div>
              </div>
              <div className="p-2">
                <div className="text-2xl font-bold text-[#38BDF8]">{totalSeats}</div>
                <div className="text-xs text-[#94A3B8] font-medium mt-0.5">Available Seats</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Internships Section */}
        <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Featured Internships</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Current postings from verified recruiters participating in campus placements.
              </p>
            </div>
            <Link href="/internships" className="text-xs font-semibold text-[#38BDF8] hover:underline flex items-center gap-1">
              <span>View All Positions ({internships.length})</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredInternships.map((intern) => (
              <div
                key={intern.id}
                className="bg-[#1E293B] rounded-lg border border-[#334155] p-4 flex flex-col justify-between hover:border-[#38BDF8] transition-all shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-[#38BDF8] block truncate">
                        {intern.companyName}
                      </span>
                      <h3 className="font-bold text-sm text-[#F8FAFC] leading-snug">
                        {intern.title}
                      </h3>
                    </div>
                    <Badge variant="primary" size="sm">
                      {intern.mode}
                    </Badge>
                  </div>

                  <div className="text-xs text-[#94A3B8] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#64748B]" />
                      <span className="truncate">{intern.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#64748B]" />
                      <span>{intern.duration}</span>
                    </div>
                  </div>

                  {/* Requirements & Stipend Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#334155] text-xs">
                    <div>
                      <span className="text-[10px] text-[#94A3B8] block">Stipend</span>
                      <span className="font-semibold text-[#34D399]">
                        ₹{intern.stipend.toLocaleString()}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#94A3B8] block">Min. CGPA</span>
                      <span className="font-mono font-semibold text-[#F8FAFC]">
                        ≥ {intern.minimumCGPA.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#334155] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#94A3B8]">
                    {intern.totalSeats} seats total
                  </span>
                  <Link href={`/internships`}>
                    <Button size="sm" variant="outline" className="text-xs py-1 h-7 border-[#334155] text-[#F8FAFC] hover:border-[#38BDF8]">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link href="/internships">
              <Button variant="outline" size="sm" className="border-[#334155] text-[#F8FAFC] hover:border-[#38BDF8] bg-[#1E293B]">
                Browse All {internships.length} Available Positions
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-12 bg-[#0F172A] border-t border-[#1E293B]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
            <h2 className="text-lg font-bold text-white">About InternMatch Portal</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
              InternMatch Portal is an institutional internship management platform developed for academic placement cells. It pairs students with verified companies based on transparent eligibility criteria, student preference priority, and academic merit using a deterministic optimization algorithm.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-[#38BDF8] pt-1">
              <span>Departmental Placement Assistance</span>
              <span>•</span>
              <span>Merit-Based Allocation</span>
              <span>•</span>
              <span>Transparent Preference Ranking</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
