'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  RotateCcw,
  Mail,
  GraduationCap,
  Building2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Modal } from '../../../components/ui/modal';
import { useToast } from '../../../components/ui/toast';
import { StudentData } from '../../../lib/types';

export default function AdminStudentsPage() {
  const { success, error: showError } = useToast();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    branch: 'Computer Engineering',
    year: 3,
    cgpa: 8.0,
    skills: '',
    resumeUrl: '',
  });

  const loadStudents = async () => {
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (data.students) {
        setStudents(data.students);
        setFilteredStudents(data.students);
      }
    } catch (err) {
      showError('Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Collect unique skills across all students
  const allSkills = Array.from(
    new Set(students.flatMap((s) => s.skills))
  ).sort();

  const branches = Array.from(new Set(students.map((s) => s.branch))).sort();

  // Filter and Search effect
  useEffect(() => {
    let result = [...students];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.skills.some((sk) => sk.toLowerCase().includes(q))
      );
    }

    if (branchFilter !== 'ALL') {
      result = result.filter((s) => s.branch === branchFilter);
    }

    if (skillFilter !== 'ALL') {
      result = result.filter((s) => s.skills.includes(skillFilter));
    }

    if (minCgpaFilter > 0) {
      result = result.filter((s) => s.cgpa >= minCgpaFilter);
    }

    if (statusFilter === 'ALLOCATED') {
      result = result.filter((s) => !!s.allocation);
    } else if (statusFilter === 'UNALLOCATED') {
      result = result.filter((s) => !s.allocation);
    }

    setFilteredStudents(result);
  }, [searchQuery, branchFilter, skillFilter, minCgpaFilter, statusFilter, students]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setBranchFilter('ALL');
    setSkillFilter('ALL');
    setMinCgpaFilter(0);
    setStatusFilter('ALL');
  };

  // Add Student Handler
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      success('Student registered successfully');
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        rollNumber: '',
        branch: 'Computer Engineering',
        year: 3,
        cgpa: 8.0,
        skills: '',
        resumeUrl: '',
      });
      loadStudents();
    } catch (err: any) {
      showError(err.message || 'Failed to add student');
    }
  };

  // Edit Student Handler
  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedStudent.id, ...formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      success('Student profile updated successfully');
      setIsEditModalOpen(false);
      loadStudents();
    } catch (err: any) {
      showError(err.message || 'Failed to update student');
    }
  };

  // Delete Student Handler
  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the student cohort?`)) return;

    try {
      const res = await fetch(`/api/admin/students?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete student');
      success('Student record deleted');
      loadStudents();
    } catch (err: any) {
      showError(err.message || 'Delete operation failed');
    }
  };

  const openEditModal = (s: StudentData) => {
    setSelectedStudent(s);
    setFormData({
      name: s.name,
      email: s.email,
      rollNumber: s.rollNumber,
      branch: s.branch,
      year: s.year,
      cgpa: s.cgpa,
      skills: s.skills.join(', '),
      resumeUrl: s.resumeUrl || '',
    });
    setIsEditModalOpen(true);
  };

  const openDetailModal = (s: StudentData) => {
    setSelectedStudent(s);
    setIsDetailModalOpen(true);
  };

  const allocatedCount = students.filter((s) => !!s.allocation).length;
  const unallocatedCount = students.length - allocatedCount;
  const avgCgpa = students.length
    ? (students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-6 rounded-lg border border-[#334155] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Academic Records
            </span>
            <span className="text-[#334155]">•</span>
            <span className="text-xs text-[#34D399] font-medium">Verified Cohort</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <Users className="h-7 w-7 text-[#38BDF8]" />
            Student Cohort &amp; Profiles
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Comprehensive directory of participating students, verified skill proficiencies, CGPA credentials, and allocation dossiers.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0284C7] hover:bg-[#0369A1] text-white"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Register Student
        </Button>
      </div>

      {/* Cohort Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-[#334155] bg-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Total Students
          </span>
          <div className="text-2xl font-bold text-[#F8FAFC] mt-1.5">{students.length}</div>
          <span className="text-[11px] text-[#94A3B8]">Registered applicants</span>
        </Card>

        <Card className="border-[#334155] bg-[#1E293B]">
          <span className="text-xs font-semibold text-[#34D399] uppercase tracking-wider block">
            Allocated Students
          </span>
          <div className="text-2xl font-bold text-[#34D399] mt-1.5">{allocatedCount}</div>
          <span className="text-[11px] text-[#94A3B8]">Placed in round 1</span>
        </Card>

        <Card className="border-[#334155] bg-[#1E293B]">
          <span className="text-xs font-semibold text-[#F87171] uppercase tracking-wider block">
            Unallocated
          </span>
          <div className="text-2xl font-bold text-[#F87171] mt-1.5">{unallocatedCount}</div>
          <span className="text-[11px] text-[#94A3B8]">Awaiting next cycle</span>
        </Card>

        <Card className="border-[#334155] bg-[#1E293B]">
          <span className="text-xs font-semibold text-[#FBBF24] uppercase tracking-wider block">
            Cohort Mean CGPA
          </span>
          <div className="text-2xl font-bold text-[#F8FAFC] mt-1.5">
            {avgCgpa} <span className="text-xs text-[#94A3B8] font-normal">/ 10.0</span>
          </div>
          <span className="text-[11px] text-[#94A3B8]">Academic standing</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardContent className="p-4 space-y-3">
          {/* Main Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search student by name, roll number, or technical skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 focus:border-[#38BDF8]"
            />
          </div>

          {/* Filter Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Branch Filter */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                Engineering Discipline
              </label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All Branches ({students.length})</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Skill Filter */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                Technical Skill
              </label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All Technical Skills ({allSkills.length})</option>
                {allSkills.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
            </div>

            {/* CGPA Eligibility Filter */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                Minimum CGPA
              </label>
              <select
                value={minCgpaFilter}
                onChange={(e) => setMinCgpaFilter(Number(e.target.value))}
                className="w-full py-1.5 px-2.5 text-xs bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value={0}>Any CGPA (All)</option>
                <option value={7.0}>≥ 7.0 CGPA</option>
                <option value={7.5}>≥ 7.5 CGPA</option>
                <option value={8.0}>≥ 8.0 CGPA</option>
                <option value={8.5}>≥ 8.5 CGPA</option>
                <option value={9.0}>≥ 9.0 CGPA</option>
              </select>
            </div>

            {/* Allocation Status Filter */}
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                Allocation Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All Allocation Statuses</option>
                <option value="ALLOCATED">Allocated ({allocatedCount})</option>
                <option value="UNALLOCATED">Unallocated ({unallocatedCount})</option>
              </select>
            </div>
          </div>

          {/* Results Count & Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-[#334155] text-xs text-[#94A3B8]">
            <span>
              Showing <strong className="text-[#F8FAFC]">{filteredStudents.length}</strong> of{' '}
              <strong className="text-[#F8FAFC]">{students.length}</strong> students
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[#38BDF8] hover:underline font-medium cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Filters
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Students Data Table */}
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#334155] bg-[#0F172A] text-[#94A3B8] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Profile</th>
                <th className="py-3 px-4">Branch &amp; Year</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Technical Skills</th>
                <th className="py-3 px-4">Allocated Internship</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#94A3B8] text-sm">
                    No students match the selected search &amp; filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-[#334155]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#38BDF8]">
                      {s.rollNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#F8FAFC]">{s.name}</div>
                      <div className="text-[11px] text-[#94A3B8]">{s.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#CBD5E1]">{s.branch}</span>
                      <span className="text-[11px] text-[#94A3B8] block">Year {s.year}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          s.cgpa >= 9.0
                            ? 'bg-[#065F46]/30 text-[#34D399] border border-[#059669]/40'
                            : s.cgpa >= 8.0
                            ? 'bg-[#0369A1]/30 text-[#38BDF8] border border-[#0284C7]/40'
                            : 'bg-[#78350F]/30 text-[#FBBF24] border border-[#D97706]/40'
                        }`}
                      >
                        {s.cgpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {s.skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk}
                            className="text-[10px] bg-[#0F172A] text-[#CBD5E1] border border-[#334155] px-1.5 py-0.5 rounded"
                          >
                            {sk}
                          </span>
                        ))}
                        {s.skills.length > 3 && (
                          <span className="text-[10px] text-[#94A3B8]">+{s.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {s.allocation ? (
                        <div>
                          <p className="font-semibold text-[#38BDF8] text-xs truncate max-w-[180px]">
                            {s.allocation.internshipTitle}
                          </p>
                          <span className="text-[10px] text-[#94A3B8]">
                            at {s.allocation.companyName} • Rank #{s.allocation.preferenceRank}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#64748B] text-xs italic">Unallocated</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {s.allocation ? (
                        <Badge variant="success" size="sm">
                          Allocated
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          Unallocated
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openDetailModal(s)}
                          className="p-1.5 rounded hover:bg-[#0F172A] text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
                          title="View Profile Dossier"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded hover:bg-[#0F172A] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                          title="Edit Student"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="p-1.5 rounded hover:bg-[#EF4444]/20 text-[#94A3B8] hover:text-[#F87171] transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Student Profile Dossier Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Student Profile Dossier"
        description="Comprehensive academic background, verified proficiencies, and placement ranking"
        maxWidth="2xl"
      >
        {selectedStudent && (
          <div className="space-y-5 text-xs text-[#F8FAFC]">
            {/* Header info */}
            <div className="p-4 rounded-lg bg-[#0F172A] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#F8FAFC]">{selectedStudent.name}</h3>
                <p className="text-xs text-[#94A3B8]">
                  {selectedStudent.email} • Roll No: <strong className="text-[#38BDF8]">{selectedStudent.rollNumber}</strong>
                </p>
                <p className="text-xs text-[#CBD5E1] mt-0.5">
                  {selectedStudent.branch} • Year {selectedStudent.year}
                </p>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-[11px] text-[#94A3B8] block">Academic CGPA</span>
                <span className="text-2xl font-bold font-mono text-[#34D399]">
                  {selectedStudent.cgpa.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#94A3B8] block">/ 10.0</span>
              </div>
            </div>

            {/* Technical Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                Verified Technical Proficiencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 bg-[#0F172A] text-[#38BDF8] text-xs font-semibold rounded-md border border-[#334155]"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Allocation Status Card */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                Placement Allocation Result
              </h4>
              {selectedStudent.allocation ? (
                <div className="p-4 rounded-lg bg-[#065F46]/20 border border-[#059669]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#059669] text-white">
                        Confirmed Allocation
                      </span>
                      <h4 className="text-base font-bold text-[#F8FAFC] mt-1">
                        {selectedStudent.allocation.internshipTitle}
                      </h4>
                      <p className="text-xs text-[#CBD5E1]">
                        at <strong className="text-white">{selectedStudent.allocation.companyName}</strong>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#94A3B8] block">Overall Merit Score</span>
                      <span className="text-2xl font-bold font-mono text-[#38BDF8]">
                        {selectedStudent.allocation.score}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] block">Preference #{selectedStudent.allocation.preferenceRank}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#059669]/30 text-center text-xs">
                    <div className="p-2 bg-[#0F172A] rounded border border-[#334155]">
                      <span className="text-[10px] text-[#94A3B8] block">CGPA Points (40%)</span>
                      <span className="font-bold text-[#38BDF8]">{selectedStudent.allocation.cgpaScore} pts</span>
                    </div>
                    <div className="p-2 bg-[#0F172A] rounded border border-[#334155]">
                      <span className="text-[10px] text-[#94A3B8] block">Skill Match (30%)</span>
                      <span className="font-bold text-[#34D399]">{selectedStudent.allocation.skillMatchScore}%</span>
                    </div>
                    <div className="p-2 bg-[#0F172A] rounded border border-[#334155]">
                      <span className="text-[10px] text-[#94A3B8] block">Preference Priority</span>
                      <span className="font-bold text-[#FBBF24]">Rank #{selectedStudent.allocation.preferenceRank}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-[#0F172A] border border-[#334155] text-center text-xs text-[#94A3B8]">
                  <p>No internship allocated in current round.</p>
                  <span className="text-[11px] text-[#64748B] block mt-1">
                    Student remains eligible for subsequent rounds or spot round clearing.
                  </span>
                </div>
              )}
            </div>

            {/* Ranked Preferences */}
            {selectedStudent.preferences && selectedStudent.preferences.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                  Submitted Preference Rankings
                </h4>
                <div className="space-y-1.5">
                  {selectedStudent.preferences.map((p) => {
                    const isAlloc = selectedStudent.allocation?.internshipId === p.internshipId;
                    return (
                      <div
                        key={p.id}
                        className={`p-2.5 rounded-md border flex items-center justify-between text-xs ${
                          isAlloc
                            ? 'bg-[#065F46]/20 border-[#059669]/50'
                            : 'bg-[#0F172A] border-[#334155]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-5 w-5 rounded flex items-center justify-center font-bold text-[11px] ${
                              p.rank === 1
                                ? 'bg-[#0284C7] text-white'
                                : 'bg-[#1E293B] text-[#94A3B8]'
                            }`}
                          >
                            #{p.rank}
                          </span>
                          <span className="font-medium text-[#F8FAFC]">
                            {p.internship?.title || 'Internship Track'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#94A3B8]">
                            {p.internship?.companyName || 'Corporate Partner'}
                          </span>
                          {isAlloc && (
                            <Badge variant="success" size="sm">
                              Matched
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-[#334155]">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Student Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student">
        <form onSubmit={handleAddStudent} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
          <Input
            label="College Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="student@university.edu"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Roll Number"
              required
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              placeholder="CS2024099"
            />
            <Input
              label="Academic Year"
              type="number"
              min="1"
              max="5"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                Engineering Discipline
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#0F172A] border border-[#334155] rounded-md text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="AI & Data Science">AI &amp; Data Science</option>
                <option value="Electronics & Telecom">Electronics &amp; Telecom</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>
            <Input
              label="CGPA (out of 10.0)"
              type="number"
              step="0.01"
              min="0"
              max="10"
              required
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
            />
          </div>
          <Input
            label="Technical Skills (comma-separated)"
            required
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="Python, React, Docker, SQL, Machine Learning"
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#334155]">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0284C7] hover:bg-[#0369A1] text-white">
              Save Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Student Profile">
        <form onSubmit={handleEditStudent} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Roll Number"
              required
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            />
            <Input
              label="Cumulative CGPA"
              type="number"
              step="0.01"
              required
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
            />
          </div>
          <Input
            label="Technical Skills"
            required
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#334155]">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0284C7] hover:bg-[#0369A1] text-white">
              Update Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
