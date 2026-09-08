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
  Clock,
  Sparkles,
  ExternalLink,
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
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(0);
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

    if (minCgpaFilter > 0) {
      result = result.filter((s) => s.cgpa >= minCgpaFilter);
    }

    setFilteredStudents(result);
  }, [searchQuery, branchFilter, minCgpaFilter, students]);

  const branches = Array.from(new Set(students.map((s) => s.branch)));

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

      success('Student added successfully');
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
      showError(err.message);
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

      success('Student updated successfully');
      setIsEditModalOpen(false);
      loadStudents();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // Delete Student Handler
  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/students?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete student');
      success('Student deleted');
      loadStudents();
    } catch (err: any) {
      showError(err.message);
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Student Cohort Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directory of participating students, technical skill proficiencies, and allocation statuses.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Student
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, roll no, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Branch Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Branches ({students.length})</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* CGPA Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Min CGPA:</span>
              <select
                value={minCgpaFilter}
                onChange={(e) => setMinCgpaFilter(Number(e.target.value))}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={0}>Any CGPA</option>
                <option value={7.0}>≥ 7.0 CGPA</option>
                <option value={8.0}>≥ 8.0 CGPA</option>
                <option value={8.5}>≥ 8.5 CGPA</option>
                <option value={9.0}>≥ 9.0 CGPA</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Data Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">Name &amp; Email</th>
                <th className="py-3.5 px-4">Branch &amp; Year</th>
                <th className="py-3.5 px-4">CGPA</th>
                <th className="py-3.5 px-4">Key Skills</th>
                <th className="py-3.5 px-4">Allocation</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                    No students match the current query criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      {s.rollNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-400">{s.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{s.branch}</span>
                      <span className="text-[11px] text-slate-400 block">Year {s.year}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          s.cgpa >= 9.0
                            ? 'bg-purple-50 text-purple-700'
                            : s.cgpa >= 8.0
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-slate-100 text-slate-700'
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
                            className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            {sk}
                          </span>
                        ))}
                        {s.skills.length > 3 && (
                          <span className="text-[10px] text-slate-400">+{s.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {s.allocation ? (
                        <div>
                          <p className="font-semibold text-indigo-600 text-xs truncate max-w-[180px]">
                            {s.allocation.internshipTitle}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            Rank #{s.allocation.preferenceRank} • Score: {s.allocation.score}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Unallocated</span>
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
                          className="p-1.5 rounded hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="View Profile & Preferences"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          title="Edit Student"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
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
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="student@example.com"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Roll Number"
              required
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              placeholder="CS2024021"
            />
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
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Branch / Discipline
            </label>
            <select
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="AI & Data Science">AI &amp; Data Science</option>
              <option value="Electronics & Telecom">Electronics &amp; Telecom</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
            </select>
          </div>
          <Input
            label="Technical Skills (Comma separated)"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="Python, React, Docker, SQL, TypeScript"
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Student</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Student Record">
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
              label="CGPA"
              type="number"
              step="0.01"
              required
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Branch
            </label>
            <select
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="AI & Data Science">AI &amp; Data Science</option>
              <option value="Electronics & Telecom">Electronics &amp; Telecom</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
            </select>
          </div>
          <Input
            label="Skills (comma separated)"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Record</Button>
          </div>
        </form>
      </Modal>

      {/* View Student Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Student Allocation Profile"
      >
        {selectedStudent && (
          <div className="space-y-5 text-sm">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedStudent.rollNumber} • {selectedStudent.branch} (Year {selectedStudent.year})
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Academic CGPA</span>
                <span className="text-lg font-bold font-mono text-indigo-600">
                  {selectedStudent.cgpa.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.skills.map((sk) => (
                  <Badge key={sk} variant="default">
                    {sk}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Current Allocation */}
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Current Allocation Status
              </h4>
              {selectedStudent.allocation ? (
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-slate-900 text-sm">
                    {selectedStudent.allocation.internshipTitle}
                  </p>
                  <p className="text-slate-600">Company: {selectedStudent.allocation.companyName}</p>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="bg-white p-2 rounded border border-indigo-100">
                      <span className="text-slate-400 block text-[10px]">Preference Rank</span>
                      <span className="font-bold text-indigo-700">#{selectedStudent.allocation.preferenceRank}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-indigo-100">
                      <span className="text-slate-400 block text-[10px]">Skill Match</span>
                      <span className="font-bold text-emerald-600">{selectedStudent.allocation.skillMatchScore}%</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-indigo-100">
                      <span className="text-slate-400 block text-[10px]">Final Score</span>
                      <span className="font-bold text-indigo-600">{selectedStudent.allocation.score}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-rose-600 italic">
                  Not currently allocated (all preferred capacities filled or minimum CGPA cutoff not met).
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setIsDetailModalOpen(false)}>Close Profile</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
