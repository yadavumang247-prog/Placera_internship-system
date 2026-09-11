'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  Plus,
  Briefcase,
  Globe,
  ExternalLink,
  Edit2,
  Trash2,
  Layers,
  Users,
  Search,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Modal } from '../../../components/ui/modal';
import { useToast } from '../../../components/ui/toast';
import { CompanyData, InternshipData } from '../../../lib/types';

export default function AdminCompaniesPage() {
  const { success, error: showError } = useToast();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logoUrl: '',
  });

  const loadCompanies = async () => {
    try {
      const res = await fetch('/api/admin/companies');
      const data = await res.json();
      if (data.companies) setCompanies(data.companies);
    } catch (err) {
      showError('Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      success('Company added successfully');
      setIsAddModalOpen(false);
      setFormData({ name: '', description: '', website: '', logoUrl: '' });
      loadCompanies();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleEditCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    try {
      const res = await fetch('/api/admin/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedCompany.id, ...formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      success('Company updated successfully');
      setIsEditModalOpen(false);
      loadCompanies();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteCompany = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This will remove all associated internship roles.`)) return;

    try {
      const res = await fetch(`/api/admin/companies?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete company');
      success('Company deleted');
      loadCompanies();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const openEditModal = (c: CompanyData) => {
    setSelectedCompany(c);
    setFormData({
      name: c.name,
      description: c.description,
      website: c.website || '',
      logoUrl: c.logoUrl || '',
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (c: CompanyData) => {
    setSelectedCompany(c);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-6 rounded-xl border border-[#334155] shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#E5BA73]" />
            Recruiter &amp; Company Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Manage industry partners, active position quotas, and corporate recruitment credentials.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#E5BA73] hover:bg-[#F3CA68] text-[#0A1128] font-bold shadow-md">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Company
        </Button>
      </div>

      {/* Search Filter */}
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search companies by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#0F172A] border border-[#334155] rounded-lg text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((c) => {
          const totalSeats = c.internships?.reduce((acc, i) => acc + i.totalSeats, 0) || 0;
          const filledSeats = c.internships?.reduce((acc, i) => acc + (i.totalSeats - i.availableSeats), 0) || 0;

          return (
            <Card key={c.id} className="flex flex-col justify-between hover:border-[#38BDF8] transition-all border-[#334155] bg-[#1E293B]">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-[#0F172A] border border-[#334155] flex items-center justify-center font-bold text-[#38BDF8] text-lg overflow-hidden shrink-0">
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.name} className="h-full w-full object-cover" />
                      ) : (
                        c.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{c.name}</h3>
                      {c.website && (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#38BDF8] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Globe className="h-3 w-3" />
                          <span>Website</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1 rounded hover:bg-[#0F172A] text-[#94A3B8] hover:text-[#38BDF8]"
                      title="Edit Company"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(c.id, c.name)}
                      className="p-1 rounded hover:bg-rose-950/40 text-[#94A3B8] hover:text-rose-400"
                      title="Delete Company"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#94A3B8] line-clamp-3 leading-relaxed mb-4">
                  {c.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-[#0F172A] rounded-xl border border-[#334155] text-center mb-4">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Active Roles</span>
                    <p className="text-sm font-bold text-white">{c.internships?.length || 0}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Total Seats</span>
                    <p className="text-sm font-bold text-[#38BDF8]">{totalSeats}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#334155] flex items-center justify-between">
                <span className="text-[11px] text-[#94A3B8] font-medium">
                  {c.internships?.length || 0} Open Positions
                </span>
                <Button variant="outline" size="sm" onClick={() => openViewModal(c)} className="border-[#334155] bg-[#0F172A] text-[#38BDF8] hover:bg-[#1E293B]">
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  View Internships
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Company Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Industry Partner">
        <form onSubmit={handleAddCompany} className="space-y-4">
          <Input
            label="Company Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Google Cloud / Microsoft"
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
              placeholder="Corporate overview, technology domain, and recruitment vision..."
              className="w-full px-3 py-2 text-sm bg-[#0F172A] border border-[#334155] rounded-lg text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
          <Input
            label="Official Website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://careers.google.com"
          />
          <Input
            label="Logo URL"
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            placeholder="https://..."
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#334155]">
            <Button type="button" variant="outline" className="border-[#334155] text-[#94A3B8]" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#E5BA73] hover:bg-[#F3CA68] text-[#0A1128] font-bold">Save Company</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Company Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Company Details">
        <form onSubmit={handleEditCompany} className="space-y-4">
          <Input
            label="Company Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              className="w-full px-3 py-2 text-sm bg-[#0F172A] border border-[#334155] rounded-lg text-white placeholder-[#64748B] focus:outline-none focus:border-[#E5BA73]"
            />
          </div>
          <Input
            label="Website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
          <Input
            label="Logo URL"
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#334155]">
            <Button type="button" variant="outline" className="border-[#334155] text-[#94A3B8]" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#E5BA73] hover:bg-[#F3CA68] text-[#0A1128] font-bold">Update Company</Button>
          </div>
        </form>
      </Modal>

      {/* View Company Internships Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedCompany ? `${selectedCompany.name} - Internships` : 'Company Details'}
        maxWidth="2xl"
      >
        {selectedCompany && (
          <div className="space-y-4">
            <div className="p-4 bg-[#0F172A] rounded-xl border border-[#334155]">
              <p className="text-xs text-[#94A3B8] leading-relaxed">{selectedCompany.description}</p>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-white pt-2">
              Listed Internship Positions ({selectedCompany.internships?.length || 0})
            </h4>

            <div className="space-y-3">
              {selectedCompany.internships && selectedCompany.internships.length > 0 ? (
                selectedCompany.internships.map((intern) => (
                  <div
                    key={intern.id}
                    className="p-4 rounded-xl border border-[#334155] bg-[#0F172A] hover:border-[#E5BA73] transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-white text-sm">{intern.title}</h5>
                        <p className="text-xs text-[#94A3B8]">
                          {intern.location} • Mode: {intern.mode} • Duration: {intern.duration}
                        </p>
                      </div>
                      <Badge variant="primary" size="sm">
                        ₹{intern.stipend.toLocaleString()}/mo
                      </Badge>
                    </div>
                    <p className="text-xs text-[#94A3B8] line-clamp-2">{intern.description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#334155] text-xs">
                      <span className="font-semibold text-white">Min CGPA: {intern.minimumCGPA}</span>
                      <span className="font-semibold text-[#E5BA73]">Total Seats: {intern.totalSeats}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#94A3B8] italic">No internships currently posted by this company.</p>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#334155]">
              <Button onClick={() => setIsViewModalOpen(false)} className="bg-[#E5BA73] hover:bg-[#F3CA68] text-[#0A1128] font-bold">Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
