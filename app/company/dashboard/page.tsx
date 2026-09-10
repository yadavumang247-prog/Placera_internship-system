'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  Briefcase,
  Layers,
  Users,
  CheckCircle2,
  Plus,
  Edit2,
  Clock,
  ExternalLink,
  Award,
  MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Modal } from '../../../components/ui/modal';
import { Input } from '../../../components/ui/input';
import { useToast } from '../../../components/ui/toast';
import { CompanyData, InternshipData, AllocationData, StudentData } from '../../../lib/types';

export default function CompanyDashboardPage() {
  const { success, error: showError } = useToast();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [allocations, setAllocations] = useState<AllocationData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<InternshipData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: 'Bangalore, Karnataka',
    mode: 'HYBRID' as 'REMOTE' | 'HYBRID' | 'ONSITE',
    stipend: 75000,
    duration: '6 Months',
    minimumCGPA: 8.0,
    requiredSkills: 'Go, Kubernetes, Docker, Python',
    totalSeats: 2,
    applicationDeadline: '2026-12-31',
  });

  const loadData = async () => {
    try {
      const [compRes, internRes, allocRes, studRes] = await Promise.all([
        fetch('/api/admin/companies').then((r) => r.json()),
        fetch('/api/admin/internships').then((r) => r.json()),
        fetch('/api/admin/algorithm/run').then((r) => r.json()),
        fetch('/api/admin/students').then((r) => r.json()),
      ]);

      if (compRes.companies && compRes.companies.length > 0) {
        setCompany(compRes.companies[0]);
      }
      if (internRes.internships) {
        setInternships(internRes.internships);
      }
      if (allocRes.result?.allocations) {
        setAllocations(allocRes.result.allocations);
      }
      if (studRes.students) {
        setStudents(studRes.students);
      }
    } catch (err) {
      showError('Failed to load company dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const companyId = company?.id || 'comp_google';
  const companyInternships = internships.filter((i) => i.companyId === companyId);
  const companyAllocations = allocations.filter((a) => a.companyName?.includes(company?.name || 'Google'));

  const totalSeats = companyInternships.reduce((acc, i) => acc + i.totalSeats, 0);
  const filledSeats = companyAllocations.length;
  const remainingSeats = Math.max(0, totalSeats - filledSeats);

  const handleCreateInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          companyId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      success('New internship position created successfully');
      setIsAddModalOpen(false);
      loadData();
    } catch (err: any) {
      showError(err.message || 'Creation failed');
    }
  };

  const handleEditInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship) return;

    try {
      const res = await fetch('/api/admin/internships', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedInternship.id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      success('Internship updated successfully');
      setIsEditModalOpen(false);
      loadData();
    } catch (err: any) {
      showError(err.message || 'Update failed');
    }
  };

  const openEditModal = (i: InternshipData) => {
    setSelectedInternship(i);
    setFormData({
      title: i.title,
      description: i.description,
      location: i.location,
      mode: i.mode,
      stipend: i.stipend,
      duration: i.duration,
      minimumCGPA: i.minimumCGPA,
      requiredSkills: i.requiredSkills.join(', '),
      totalSeats: i.totalSeats,
      applicationDeadline:
        typeof i.applicationDeadline === 'string'
          ? i.applicationDeadline.split('T')[0]
          : '2026-12-31',
    });
    setIsEditModalOpen(true);
  };

  const openApplicantsModal = (i: InternshipData) => {
    setSelectedInternship(i);
    setIsApplicantsModalOpen(true);
  };

  // Compute eligible students for selected internship
  const eligibleApplicants = selectedInternship
    ? students.filter((s) => s.cgpa >= selectedInternship.minimumCGPA)
    : [];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-6 rounded-xl border border-[#334155] shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center font-bold text-[#38BDF8] text-lg overflow-hidden shrink-0">
            {company?.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-6 w-6 text-[#38BDF8]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {company?.name || 'Corporate Partner'}
              </h1>
              <Badge variant="success">Verified Recruiter</Badge>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              College Placement &amp; Corporate Internship Management Portal
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md shadow-sky-950"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Post Internship Opening
        </Button>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-[#334155] bg-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Active Roles
          </span>
          <div className="text-2xl font-bold text-white mt-2">{companyInternships.length}</div>
          <span className="text-[11px] text-[#94A3B8]">Position tracks</span>
        </Card>

        <Card className="border-[#334155] bg-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Total Seats
          </span>
          <div className="text-2xl font-bold text-[#38BDF8] mt-2">{totalSeats}</div>
          <span className="text-[11px] text-[#94A3B8]">Allocated quota</span>
        </Card>

        <Card className="border-emerald-800/40 bg-emerald-950/20">
          <span className="text-xs font-semibold text-[#34D399] uppercase tracking-wider block">
            Filled Seats
          </span>
          <div className="text-2xl font-bold text-[#34D399] mt-2">{filledSeats}</div>
          <span className="text-[11px] text-[#34D399]">Matched candidates</span>
        </Card>

        <Card className="border-[#334155] bg-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Available Vacancies
          </span>
          <div className="text-2xl font-bold text-white mt-2">{remainingSeats}</div>
          <span className="text-[11px] text-[#94A3B8]">Unfilled positions</span>
        </Card>
      </div>

      {/* Active Internships Table */}
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardHeader className="pb-3 border-b border-[#334155]">
          <CardTitle className="text-base font-bold text-white">
            Active Internship Openings
          </CardTitle>
          <CardDescription className="text-xs text-[#94A3B8]">
            Review applicant pools, minimum eligibility requirements, and modify seat capacities.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#334155] bg-[#0F172A] text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Title &amp; Location</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Stipend &amp; Duration</th>
                <th className="py-3 px-4">Min CGPA</th>
                <th className="py-3 px-4">Required Skills</th>
                <th className="py-3 px-4">Seats</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {companyInternships.map((intern) => (
                <tr key={intern.id} className="hover:bg-[#0F172A]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{intern.title}</div>
                    <div className="text-[11px] text-[#94A3B8]">{intern.location}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        intern.mode === 'REMOTE' ? 'success' : intern.mode === 'HYBRID' ? 'warning' : 'secondary'
                      }
                      size="sm"
                    >
                      {intern.mode}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#34D399]">
                      ₹{intern.stipend.toLocaleString()}/mo
                    </div>
                    <span className="text-[10px] text-[#94A3B8]">{intern.duration}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#38BDF8]">
                    ≥ {intern.minimumCGPA.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {intern.requiredSkills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] bg-[#0F172A] text-[#38BDF8] px-1.5 py-0.5 rounded border border-[#334155]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-white">
                    {intern.totalSeats} seats
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openApplicantsModal(intern)}
                        className="text-xs border-[#334155] bg-[#0F172A] text-[#38BDF8] hover:bg-[#1E293B]"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Applicants
                      </Button>
                      <button
                        onClick={() => openEditModal(intern)}
                        className="p-1.5 rounded hover:bg-[#0F172A] text-[#94A3B8] hover:text-[#38BDF8]"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Confirmed Placements Ledger */}
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardHeader className="pb-3 border-b border-[#334155]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#34D399]" />
                Allocated Student Cohort
              </CardTitle>
              <CardDescription className="text-xs text-[#94A3B8]">
                Students officially matched to {company?.name || 'Company'} positions by the placement algorithm
              </CardDescription>
            </div>
            <Badge variant="success">{companyAllocations.length} Assigned Candidates</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#334155] bg-[#0F172A] text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Assigned Internship</th>
                <th className="py-3 px-4">Preference Rank</th>
                <th className="py-3 px-4">Skill Match</th>
                <th className="py-3 px-4 font-bold">Merit Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {companyAllocations.map((a) => (
                <tr key={a.id} className="hover:bg-[#0F172A]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{a.studentName}</td>
                  <td className="py-3 px-4 font-mono text-[#94A3B8]">{a.studentRollNumber}</td>
                  <td className="py-3 px-4 text-[#94A3B8]">{a.studentBranch}</td>
                  <td className="py-3 px-4 font-semibold text-[#38BDF8]">{a.internshipTitle}</td>
                  <td className="py-3 px-4 font-semibold text-white">Rank #{a.preferenceRank}</td>
                  <td className="py-3 px-4 font-mono text-[#34D399]">{a.skillMatchScore}%</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#38BDF8] text-sm">{a.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Post Internship Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Post New Internship Track" maxWidth="2xl">
        <form onSubmit={handleCreateInternship} className="space-y-4">
          <Input
            label="Position Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="AI Platform Systems Intern"
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Role Description
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#0F172A] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Stipend (₹)"
              type="number"
              value={formData.stipend}
              onChange={(e) => setFormData({ ...formData, stipend: Number(e.target.value) })}
            />
            <Input
              label="Min CGPA"
              type="number"
              step="0.1"
              value={formData.minimumCGPA}
              onChange={(e) => setFormData({ ...formData, minimumCGPA: parseFloat(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Seats"
              type="number"
              min="1"
              value={formData.totalSeats}
              onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
            />
            <Input
              label="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
          <Input
            label="Required Skills (comma separated)"
            value={formData.requiredSkills}
            onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#334155]">
            <Button type="button" variant="outline" className="border-[#334155] text-[#94A3B8]" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0284C7] hover:bg-[#0369A1] text-white">
              Publish Opening
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Position Details">
        <form onSubmit={handleEditInternship} className="space-y-4">
          <Input
            label="Position Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#0F172A] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Stipend (₹)"
              type="number"
              value={formData.stipend}
              onChange={(e) => setFormData({ ...formData, stipend: Number(e.target.value) })}
            />
            <Input
              label="Min CGPA"
              type="number"
              step="0.1"
              value={formData.minimumCGPA}
              onChange={(e) => setFormData({ ...formData, minimumCGPA: parseFloat(e.target.value) })}
            />
          </div>
          <Input
            label="Required Skills"
            value={formData.requiredSkills}
            onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#334155]">
            <Button type="button" variant="outline" className="border-[#334155] text-[#94A3B8]" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0284C7] hover:bg-[#0369A1] text-white">
              Update Position
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Eligible Applicants Modal */}
      <Modal
        isOpen={isApplicantsModalOpen}
        onClose={() => setIsApplicantsModalOpen(false)}
        title={selectedInternship ? `${selectedInternship.title} - Eligible Pool` : 'Applicants Pool'}
        maxWidth="2xl"
      >
        {selectedInternship && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#334155] flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">Minimum Cutoff: ≥ {selectedInternship.minimumCGPA.toFixed(1)} CGPA</p>
                <p className="text-[11px] text-[#94A3B8]">Total Seats Quota: {selectedInternship.totalSeats}</p>
              </div>
              <Badge variant="primary">{eligibleApplicants.length} Eligible Students</Badge>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-[#334155]">
              {eligibleApplicants.map((stud) => (
                <div key={stud.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{stud.name}</span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {stud.rollNumber} • {stud.branch}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#38BDF8] block">{(stud.cgpa || 0).toFixed(2)} CGPA</span>
                    <span className="text-[10px] text-[#94A3B8]">{(stud.skills || []).slice(0, 3).join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#334155]">
              <Button variant="outline" className="border-[#334155] text-white" onClick={() => setIsApplicantsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
