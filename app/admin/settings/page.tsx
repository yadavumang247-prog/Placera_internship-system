'use client';

import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Calendar,
  Building,
  Save,
  CheckCircle2,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useToast } from '../../../components/ui/toast';

export default function AdminSettingsPage() {
  const { success } = useToast();
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [driveRound, setDriveRound] = useState('Round 1 (Regular Allocation)');
  const [maxPreferences, setMaxPreferences] = useState(5);
  const [minCgpaCutoff, setMinCgpaCutoff] = useState('6.0');
  const [deadline, setDeadline] = useState('2026-10-31');

  // Algorithm Weights
  const [cgpaWeight, setCgpaWeight] = useState(40);
  const [skillWeight, setSkillWeight] = useState(30);
  const [prefWeight, setPrefWeight] = useState(20);
  const [branchWeight, setBranchWeight] = useState(10);

  // Placement Office Info
  const [officerName, setOfficerName] = useState('Dr. Arvind Kumar');
  const [officerEmail, setOfficerEmail] = useState('placement@university.edu');
  const [officerPhone, setOfficerPhone] = useState('+91 22 2576 7000');
  const [officeLocation, setOfficeLocation] = useState('Training & Placement Cell, Admin Block Room 204');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('System settings and allocation parameters updated successfully.');
  };

  const totalWeight = cgpaWeight + skillWeight + prefWeight + branchWeight;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#E5BA73]">
            System Administration
          </span>
          <span className="text-[#1E3466]">•</span>
          <span className="text-xs text-[#34D399] font-medium">Placement Drive Controls</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#FAF8F5] tracking-tight">
          System Settings &amp; Parameters
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Configure academic cycle parameters, algorithm scoring weights, preference constraints, and placement office details.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic Drive Settings */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <CardHeader className="pb-3 border-b border-[#334155]">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#38BDF8]" />
              Placement Cycle Parameters
            </CardTitle>
            <CardDescription className="text-xs text-[#94A3B8]">
              Operational schedule and baseline constraints for student participation
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-white mb-1">Academic Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-white mb-1">Drive Round</label>
                <select
                  value={driveRound}
                  onChange={(e) => setDriveRound(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                >
                  <option value="Round 1 (Regular Allocation)">Round 1 (Regular Allocation)</option>
                  <option value="Round 2 (Supplementary Drive)">Round 2 (Supplementary Drive)</option>
                  <option value="Spot Round (Final Clearing)">Spot Round (Final Clearing)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-white mb-1">
                  Maximum Preferences per Student
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={maxPreferences}
                  onChange={(e) => setMaxPreferences(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
                <p className="text-[11px] text-[#94A3B8] mt-1">Standard institutional default is 5 ranked choices.</p>
              </div>

              <div>
                <label className="block font-semibold text-white mb-1">
                  Application Cutoff Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Weights Preset */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <CardHeader className="pb-3 border-b border-[#334155]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[#E5BA73]" />
                  Allocation Merit Weights
                </CardTitle>
                <CardDescription className="text-xs text-[#94A3B8]">
                  Mathematical scoring coefficients summing to 100%
                </CardDescription>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  totalWeight === 100
                    ? 'bg-emerald-950/60 text-[#34D399] border border-emerald-700/50'
                    : 'bg-rose-950/60 text-rose-400 border border-rose-700/50'
                }`}
              >
                Total: {totalWeight}%
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-white mb-1">CGPA Merit Weight (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={cgpaWeight}
                  onChange={(e) => setCgpaWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
                <p className="text-[11px] text-[#94A3B8] mt-1">Weight for normalized academic GPA.</p>
              </div>

              <div>
                <label className="block font-semibold text-white mb-1">Skill Match Weight (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={skillWeight}
                  onChange={(e) => setSkillWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
                <p className="text-[11px] text-[#94A3B8] mt-1">Direct overlap with required competencies.</p>
              </div>

              <div>
                <label className="block font-semibold text-white mb-1">Student Preference Weight (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={prefWeight}
                  onChange={(e) => setPrefWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
                <p className="text-[11px] text-[#94A3B8] mt-1">Score multiplier based on student ranking.</p>
              </div>

              <div>
                <label className="block font-semibold text-white mb-1">Branch Compatibility (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={branchWeight}
                  onChange={(e) => setBranchWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
                <p className="text-[11px] text-[#94A3B8] mt-1">Discipline alignment coefficient.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placement Office Coordinates */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <CardHeader className="pb-3 border-b border-[#334155]">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Building className="h-4 w-4 text-[#38BDF8]" />
              Placement Cell Information
            </CardTitle>
            <CardDescription className="text-xs text-[#94A3B8]">
              Official university contact channels displayed on student notices and reports
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-white mb-1">Placement Officer</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-white mb-1">Official Email</label>
                <input
                  type="email"
                  value={officerEmail}
                  onChange={(e) => setOfficerEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-white mb-1">Helpline Phone</label>
                <input
                  type="text"
                  value={officerPhone}
                  onChange={(e) => setOfficerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-white mb-1">Office Location</label>
                <input
                  type="text"
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            className="bg-[#E5BA73] hover:bg-[#D4A253] text-[#0A1128] px-6 font-bold shadow-md shadow-[#E5BA73]/20"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
