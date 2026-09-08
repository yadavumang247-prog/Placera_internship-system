'use client';

import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Building2,
  MapPin,
  Clock,
  Award,
  Layers,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Modal } from '../../../components/ui/modal';
import { useToast } from '../../../components/ui/toast';
import { InternshipData, CompanyData } from '../../../lib/types';

export default function AdminInternshipsPage() {
  const { success, error: showError } = useToast();
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<InternshipData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    description: '',
    location: '',
    mode: 'REMOTE' as 'REMOTE' | 'HYBRID' | 'ONSITE',
    stipend: 50000,
    duration: '3 Months',
    minimumCGPA: 7.0,
    requiredSkills: '',
    totalSeats: 2,
    applicationDeadline: '2026-12-31',
  });

  const loadData = async () => {
    try {
      const [internRes, compRes] = await Promise.all([
        fetch('/api/admin/internships').then((r) => r.json()),
        fetch('/api/admin/companies').then((r) => r.json()),
      ]);
      if (internRes.internships) {
        setInternships(internRes.internships);
        setFilteredInternships(internRes.internships);
      }
      if (compRes.companies) {
        setCompanies(compRes.companies);
        if (compRes.companies.length > 0 && !formData.companyId) {
          setFormData((prev) => ({ ...prev, companyId: compRes.companies[0].id }));
        }
      }
    } catch (err) {
      showError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter effect
  useEffect(() => {
    let list = [...internships];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.companyName?.toLowerCase().includes(q) ||
          i.requiredSkills.some((sk) => sk.toLowerCase().includes(q))
      );
    }

    if (companyFilter !== 'ALL') {
      list = list.filter((i) => i.companyId === companyFilter);
    }

    if (modeFilter !== 'ALL') {
      list = list.filter((i) => i.mode === modeFilter);
    }

    setFilteredInternships(list);
  }, [searchQuery, companyFilter, modeFilter, internships]);

  const handleAddInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      success('Internship created successfully');
      setIsAddModalOpen(false);
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleEditInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship) return;

    try {
      const res = await fetch('/api/admin/internships', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedInternship.id, ...formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      success('Internship updated successfully');
      setIsEditModalOpen(false);
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteInternship = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/internships?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete internship');
      success('Internship deleted');
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const openEditModal = (i: InternshipData) => {
    setSelectedInternship(i);
    setFormData({
      companyId: i.companyId,
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            Internship Positions Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure seat capacities, minimum CGPA eligibility cutoffs, and required skill matrices.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Internship
        </Button>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search position, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Company Filter */}
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Companies ({companies.length})</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Modes (Remote/Hybrid/Onsite)</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Internships Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Title &amp; Company</th>
                <th className="py-3.5 px-4">Location &amp; Mode</th>
                <th className="py-3.5 px-4">Stipend &amp; Duration</th>
                <th className="py-3.5 px-4">Min CGPA</th>
                <th className="py-3.5 px-4">Required Skills</th>
                <th className="py-3.5 px-4">Seats</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInternships.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    No internships match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredInternships.map((intern) => (
                  <tr key={intern.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{intern.title}</div>
                      <div className="text-[11px] text-indigo-600 font-medium">
                        {intern.companyName || 'Partner'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium">{intern.location}</span>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                        {intern.mode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-emerald-700">
                        ₹{intern.stipend.toLocaleString()}/mo
                      </div>
                      <span className="text-[11px] text-slate-400">{intern.duration}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs">
                        ≥ {intern.minimumCGPA.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <div className="flex flex-wrap gap-1">
                        {intern.requiredSkills.map((sk) => (
                          <span
                            key={sk}
                            className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {intern.totalSeats} seats
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(intern)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                          title="Edit Position"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInternship(intern.id, intern.title)}
                          className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                          title="Delete Position"
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

      {/* Add Internship Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Internship Role" maxWidth="2xl">
        <form onSubmit={handleAddInternship} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Hosting Company
              </label>
              <select
                required
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Job Role Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Cloud Software Engineer Intern"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Role Description &amp; Responsibilities
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Specify development tools, responsibilities, and team workflow..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Bangalore, Karnataka"
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Mode
              </label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>
            <Input
              label="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="3 Months / 6 Months"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Monthly Stipend (₹)"
              type="number"
              required
              value={formData.stipend}
              onChange={(e) => setFormData({ ...formData, stipend: Number(e.target.value) })}
            />
            <Input
              label="Minimum CGPA Cutoff"
              type="number"
              step="0.1"
              required
              value={formData.minimumCGPA}
              onChange={(e) => setFormData({ ...formData, minimumCGPA: parseFloat(e.target.value) })}
            />
            <Input
              label="Total Seats Quota"
              type="number"
              min="1"
              required
              value={formData.totalSeats}
              onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Required Skills (Comma separated)"
            required
            value={formData.requiredSkills}
            onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
            placeholder="Go, Kubernetes, Docker, Python"
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Role</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Internship Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Internship Position" maxWidth="2xl">
        <form onSubmit={handleEditInternship} className="space-y-4">
          <Input
            label="Role Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
            label="Required Skills"
            value={formData.requiredSkills}
            onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Position</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
