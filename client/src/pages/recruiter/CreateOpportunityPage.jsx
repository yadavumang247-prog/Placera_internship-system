import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { 
  Briefcase, Plus, Trash2, ArrowLeft, Save, 
  ShieldCheck, Check, Layers, Code, Award 
} from 'lucide-react';

const BRANCH_OPTIONS = [
  'Computer Science',
  'Information Technology',
  'Data Science & AI',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering'
];

export default function CreateOpportunityPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState('INTERNSHIP');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Bengaluru');
  const [workMode, setWorkMode] = useState('HYBRID');
  const [stipend, setStipend] = useState('');
  const [salary, setSalary] = useState('');
  const [openings, setOpenings] = useState(5);
  const [applicationDeadline, setApplicationDeadline] = useState('');

  // Eligibility
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [allowedBranches, setAllowedBranches] = useState(['Computer Science', 'Information Technology']);
  const [maxActiveBacklogs, setMaxActiveBacklogs] = useState(0);
  const [maxHistoryBacklogs, setMaxHistoryBacklogs] = useState(1);
  const [graduationYears, setGraduationYears] = useState('2026');

  // Skills
  const [skills, setSkills] = useState([
    { name: 'JavaScript', proficiency: 'intermediate', weight: 5 },
    { name: 'React', proficiency: 'intermediate', weight: 4 },
    { name: 'Node.js', proficiency: 'intermediate', weight: 4 }
  ]);
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: 'intermediate', weight: 5 });

  // Recruitment Rounds
  const [rounds, setRounds] = useState([
    { roundNumber: 1, name: 'Resume & Algorithmic Screening', type: 'SCREENING', description: 'Deterministic Top-N candidate ranking based on multi-factor evaluation' },
    { roundNumber: 2, name: 'Online Technical Assessment', type: 'ASSESSMENT', description: 'Timed MCQ & sandboxed coding challenge' },
    { roundNumber: 3, name: 'Technical Interview', type: 'INTERVIEW', description: 'System design and algorithmic problem solving panel' },
    { roundNumber: 4, name: 'HR & Cultural Alignment', type: 'INTERVIEW', description: 'Final leadership and compensation discussion' }
  ]);

  const handleBranchToggle = (branch) => {
    if (allowedBranches.includes(branch)) {
      setAllowedBranches(allowedBranches.filter(b => b !== branch));
    } else {
      setAllowedBranches([...allowedBranches, branch]);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    setSkills([...skills, { ...newSkill, weight: Number(newSkill.weight) || 5 }]);
    setNewSkill({ name: '', proficiency: 'intermediate', weight: 5 });
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddRound = () => {
    const nextNum = rounds.length + 1;
    setRounds([
      ...rounds,
      { roundNumber: nextNum, name: `Round ${nextNum}`, type: 'INTERVIEW', description: 'Recruitment evaluation round' }
    ]);
  };

  const handleRemoveRound = (index) => {
    const updated = rounds.filter((_, i) => i !== index).map((r, i) => ({ ...r, roundNumber: i + 1 }));
    setRounds(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !applicationDeadline) {
      toast.error('Please fill in all required opportunity fields');
      return;
    }
    if (allowedBranches.length === 0) {
      toast.error('Please select at least one eligible academic department');
      return;
    }

    try {
      setSubmitting(true);

      const gradYearsArray = graduationYears.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));

      const payload = {
        title,
        type,
        description,
        location,
        workMode,
        stipend: stipend ? Number(stipend) : undefined,
        salary: salary ? Number(salary) : undefined,
        openings: Number(openings) || 1,
        applicationDeadline: new Date(applicationDeadline).toISOString(),
        eligibilityCriteria: {
          minCgpa: Number(minCgpa),
          allowedBranches,
          maxActiveBacklogs: Number(maxActiveBacklogs),
          maxHistoryBacklogs: Number(maxHistoryBacklogs),
          graduationYears: gradYearsArray
        },
        requiredSkills: skills,
        rounds
      };

      const res = await api.recruiter.createOpportunity(payload);
      toast.success('Opportunity published successfully!');
      navigate(`/recruiter/opportunities/${res.opportunity._id}/applications`);
    } catch (err) {
      toast.error(err.message || 'Failed to publish opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <Link to="/recruiter/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>Create Campus Recruitment Opportunity</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
          Configure strict eligibility requirements, algorithmic weighting attributes, and customized round pipelines.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Basic Details */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0, borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
            1. Role Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            <div>
              <label className="form-label">Job / Internship Title *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Software Development Engineer - Frontend"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Opportunity Type *</label>
              <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                <option value="INTERNSHIP">Internship</option>
                <option value="FULL_TIME">Full-Time Placement</option>
                <option value="BOTH">Internship + PPO (Pre-Placement Offer)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Work Mode</label>
              <select className="form-control" value={workMode} onChange={e => setWorkMode(e.target.value)}>
                <option value="HYBRID">Hybrid</option>
                <option value="ON_SITE">On-Site</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
            <div>
              <label className="form-label">Primary Location</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Bengaluru, Karnataka"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <div>
              <label className="form-label">Stipend (₹/month) - if internship</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="e.g. 50000"
                value={stipend}
                onChange={e => setStipend(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">CTC / Salary (₹/year) - if full time</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="e.g. 1400000"
                value={salary}
                onChange={e => setSalary(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Total Openings</label>
              <input 
                type="number" 
                min="1" 
                className="form-control" 
                value={openings}
                onChange={e => setOpenings(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Application Deadline *</label>
              <input 
                type="datetime-local" 
                className="form-control" 
                value={applicationDeadline}
                onChange={e => setApplicationDeadline(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.2rem' }}>
                Pre-deadline privacy lock expires at this timestamp
              </span>
            </div>
          </div>

          <div>
            <label className="form-label">Role Description & Responsibilities *</label>
            <textarea 
              className="form-control" 
              rows={4} 
              placeholder="Outline mission, key deliverables, expectations, and engineering tech stack..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Deterministic Eligibility Rules */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
            <ShieldCheck size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>
              2. Deterministic Eligibility Criteria
            </h3>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
            The eligibility engine deterministically checks each rule before allowing a student to apply. Students failing any criterion receive clear explanatory feedback.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <div>
              <label className="form-label">Minimum CGPA</label>
              <input 
                type="number" 
                step="0.1" 
                min="0" 
                max="10" 
                className="form-control" 
                value={minCgpa}
                onChange={e => setMinCgpa(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Max Active Backlogs Allowed</label>
              <input 
                type="number" 
                min="0" 
                className="form-control" 
                value={maxActiveBacklogs}
                onChange={e => setMaxActiveBacklogs(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Max Historical Backlogs Allowed</label>
              <input 
                type="number" 
                min="0" 
                className="form-control" 
                value={maxHistoryBacklogs}
                onChange={e => setMaxHistoryBacklogs(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Target Graduation Years</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="2025, 2026"
                value={graduationYears}
                onChange={e => setGraduationYears(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Eligible Academic Departments *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {BRANCH_OPTIONS.map(branch => {
                const checked = allowedBranches.includes(branch);
                return (
                  <label 
                    key={branch} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-2)', 
                      padding: 'var(--space-2) var(--space-3)', 
                      borderRadius: 'var(--radius-sm)', 
                      background: checked ? 'var(--color-primary-light)' : 'var(--color-surface)',
                      border: `1px solid ${checked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      cursor: 'pointer',
                      fontSize: 'var(--text-xs)',
                      fontWeight: checked ? 600 : 400
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={checked} 
                      onChange={() => handleBranchToggle(branch)} 
                    />
                    {branch}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Required Skills & Weights */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
            <Code size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>
              3. Required Technical Skills & Weightings
            </h3>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Skills represent 40% of the candidate evaluation algorithm. Specify skill proficiencies and importance weights (1 = low, 10 = critical).
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {skills.map((s, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-2)', 
                  padding: '0.4rem 0.8rem', 
                  background: 'var(--color-surface)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--color-border)' 
                }}
              >
                <strong style={{ fontSize: 'var(--text-sm)' }}>{s.name}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  ({s.proficiency} · weight {s.weight}/10)
                </span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveSkill(idx)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', display: 'flex', padding: 2 }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)', background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <label className="form-label">Skill Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Docker, Python" 
                value={newSkill.name} 
                onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} 
              />
            </div>
            <div>
              <label className="form-label">Minimum Proficiency</label>
              <select 
                className="form-control" 
                value={newSkill.proficiency} 
                onChange={e => setNewSkill({ ...newSkill, proficiency: e.target.value })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="form-label">Weight (1-10)</label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                className="form-control" 
                value={newSkill.weight} 
                onChange={e => setNewSkill({ ...newSkill, weight: e.target.value })} 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="button" onClick={handleAddSkill} className="btn btn-secondary btn-sm" style={{ height: '38px', width: '100%' }}>
                <Plus size={14} /> Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* Sequential Recruitment Rounds */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Layers size={20} color="var(--color-primary)" />
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>
                4. Recruitment Round Pipeline
              </h3>
            </div>
            <button type="button" onClick={handleAddRound} className="btn btn-secondary btn-sm">
              <Plus size={14} /> Add Round
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {rounds.map((r, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: 'var(--space-3)', 
                  padding: 'var(--space-3) var(--space-4)', 
                  background: 'var(--color-surface)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--color-border)' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ 
                    width: 28, 
                    height: 28, 
                    borderRadius: '50%', 
                    background: 'var(--color-primary)', 
                    color: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 700, 
                    fontSize: '0.8rem' 
                  }}>
                    {r.roundNumber}
                  </div>
                  <div>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{r.name}</strong>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      Type: <code>{r.type}</code> · {r.description}
                    </div>
                  </div>
                </div>

                {rounds.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveRound(idx)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
          <Link to="/recruiter/dashboard" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <Save size={16} /> {submitting ? 'Publishing Opportunity...' : 'Publish Campus Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
}
