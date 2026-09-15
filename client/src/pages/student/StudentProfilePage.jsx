import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { 
  User, BookOpen, Cpu, Briefcase, Award, FileText, 
  Plus, Trash2, Save, Upload, CheckCircle, AlertCircle 
} from 'lucide-react';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('academics');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  // Form states
  const [academics, setAcademics] = useState({
    rollNumber: '',
    department: 'Computer Science',
    degree: 'B.Tech',
    currentYear: 3,
    cgpa: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    activeBacklogs: 0,
    historyOfBacklogs: 0,
    graduationYear: 2026,
    collegeEmail: ''
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'technical', proficiency: 'intermediate', yearsOfExperience: 1 });

  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', liveUrl: '', githubUrl: '', role: '' });

  const [experience, setExperience] = useState([]);
  const [newExp, setNewExp] = useState({ title: '', company: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '' });

  const [certifications, setCertifications] = useState([]);
  const [newCert, setNewCert] = useState({ name: '', issuer: '', issueDate: '', credentialUrl: '' });

  const [preferences, setPreferences] = useState({
    preferredLocations: '',
    preferredRoles: '',
    minimumSalary: '',
    openToRelocation: true
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.student.getProfile();
      const p = res.profile || {};
      setProfile(p);

      if (p.academics) {
        setAcademics({
          rollNumber: p.academics.rollNumber || '',
          department: p.academics.department || 'Computer Science',
          degree: p.academics.degree || 'B.Tech',
          currentYear: p.academics.currentYear || 3,
          cgpa: p.academics.cgpa || '',
          tenthPercentage: p.academics.tenthPercentage || '',
          twelfthPercentage: p.academics.twelfthPercentage || '',
          activeBacklogs: p.academics.activeBacklogs || 0,
          historyOfBacklogs: p.academics.historyOfBacklogs || 0,
          graduationYear: p.academics.graduationYear || 2026,
          collegeEmail: p.academics.collegeEmail || ''
        });
      }

      if (p.skills) setSkills(p.skills);
      if (p.projects) setProjects(p.projects);
      if (p.experience) setExperience(p.experience);
      if (p.certifications) setCertifications(p.certifications);
      if (p.resumeUrl) setResumeUrl(p.resumeUrl);

      if (p.preferences) {
        setPreferences({
          preferredLocations: (p.preferences.preferredLocations || []).join(', '),
          preferredRoles: (p.preferences.preferredRoles || []).join(', '),
          minimumSalary: p.preferences.minimumSalary || '',
          openToRelocation: p.preferences.openToRelocation !== false
        });
      }
    } catch (err) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAcademics = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.student.updateProfile({ academics });
      toast.success('Academics saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Error saving academics');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    const updated = [...skills, { ...newSkill, yearsOfExperience: Number(newSkill.yearsOfExperience) || 1 }];
    try {
      setSaving(true);
      await api.student.updateProfile({ skills: updated });
      setSkills(updated);
      setNewSkill({ name: '', category: 'technical', proficiency: 'intermediate', yearsOfExperience: 1 });
      toast.success('Skill added');
    } catch (err) {
      toast.error(err.message || 'Failed to add skill');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSkill = async (index) => {
    const updated = skills.filter((_, i) => i !== index);
    try {
      await api.student.updateProfile({ skills: updated });
      setSkills(updated);
      toast.info('Skill removed');
    } catch (err) {
      toast.error('Failed to delete skill');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    const techArray = newProject.technologies.split(',').map(s => s.trim()).filter(Boolean);
    const updated = [...projects, { ...newProject, technologies: techArray }];
    try {
      setSaving(true);
      await api.student.updateProfile({ projects: updated });
      setProjects(updated);
      setNewProject({ title: '', description: '', technologies: '', liveUrl: '', githubUrl: '', role: '' });
      toast.success('Project added');
    } catch (err) {
      toast.error(err.message || 'Failed to add project');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveProject = async (index) => {
    const updated = projects.filter((_, i) => i !== index);
    try {
      await api.student.updateProfile({ projects: updated });
      setProjects(updated);
      toast.info('Project removed');
    } catch (err) {
      toast.error('Failed to remove project');
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    if (!newExp.title.trim() || !newExp.company.trim()) return;
    const updated = [...experience, newExp];
    try {
      setSaving(true);
      await api.student.updateProfile({ experience: updated });
      setExperience(updated);
      setNewExp({ title: '', company: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '' });
      toast.success('Work experience added');
    } catch (err) {
      toast.error('Failed to add experience');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveExperience = async (index) => {
    const updated = experience.filter((_, i) => i !== index);
    try {
      await api.student.updateProfile({ experience: updated });
      setExperience(updated);
      toast.info('Experience removed');
    } catch (err) {
      toast.error('Failed to remove experience');
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!newCert.name.trim()) return;
    const updated = [...certifications, newCert];
    try {
      setSaving(true);
      await api.student.updateProfile({ certifications: updated });
      setCertifications(updated);
      setNewCert({ name: '', issuer: '', issueDate: '', credentialUrl: '' });
      toast.success('Certification added');
    } catch (err) {
      toast.error('Failed to add certification');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveCert = async (index) => {
    const updated = certifications.filter((_, i) => i !== index);
    try {
      await api.student.updateProfile({ certifications: updated });
      setCertifications(updated);
      toast.info('Certification removed');
    } catch (err) {
      toast.error('Failed to remove certification');
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        preferredLocations: preferences.preferredLocations.split(',').map(s => s.trim()).filter(Boolean),
        preferredRoles: preferences.preferredRoles.split(',').map(s => s.trim()).filter(Boolean),
        minimumSalary: preferences.minimumSalary ? Number(preferences.minimumSalary) : 0,
        openToRelocation: preferences.openToRelocation
      };
      await api.student.updateProfile({ preferences: payload });
      toast.success('Preferences saved');
    } catch (err) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const res = await api.student.uploadResume(formData);
      setResumeUrl(res.resumeUrl);
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to upload resume');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  const tabs = [
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'skills', label: 'Skills', icon: Cpu, count: skills.length },
    { id: 'projects', label: 'Projects', icon: FileText, count: projects.length },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: experience.length },
    { id: 'certifications', label: 'Certifications', icon: Award, count: certifications.length },
    { id: 'preferences', label: 'Preferences', icon: User },
    { id: 'resume', label: 'Resume', icon: Upload }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>Student Profile</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
              Keep your profile updated. All application evaluations, eligibility checks, and scoring algorithms draw directly from this verified data.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {profile?.isVerified ? (
              <span className="badge badge-success" style={{ padding: '0.4rem 0.8rem', gap: '0.4rem', fontSize: 'var(--text-sm)' }}>
                <CheckCircle size={16} /> Verified by Placement Cell
              </span>
            ) : (
              <span className="badge badge-warning" style={{ padding: '0.4rem 0.8rem', gap: '0.4rem', fontSize: 'var(--text-sm)' }}>
                <AlertCircle size={16} /> Pending Verification
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-2)', 
          marginTop: 'var(--space-6)', 
          borderBottom: '1px solid var(--color-border)', 
          overflowX: 'auto',
          paddingBottom: 'var(--space-1)'
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  transition: 'var(--transition-fast)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                {tab.label}
                {tab.count !== undefined && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.1rem 0.4rem', 
                    borderRadius: 'var(--radius-full)', 
                    background: isActive ? 'var(--color-primary-light)' : 'var(--color-surface)',
                    color: isActive ? 'var(--color-primary)' : 'inherit'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        {/* ACADEMICS TAB */}
        {activeTab === 'academics' && (
          <form onSubmit={handleSaveAcademics} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>Academic Credentials</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
              <div>
                <label className="form-label">Roll Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={academics.rollNumber} 
                  onChange={e => setAcademics({ ...academics, rollNumber: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label className="form-label">Degree</label>
                <select 
                  className="form-control" 
                  value={academics.degree} 
                  onChange={e => setAcademics({ ...academics, degree: e.target.value })}
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E.">B.E.</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                </select>
              </div>
              <div>
                <label className="form-label">Department / Branch</label>
                <select 
                  className="form-control" 
                  value={academics.department} 
                  onChange={e => setAcademics({ ...academics, department: e.target.value })}
                >
                  <option value="Computer Science">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                </select>
              </div>
              <div>
                <label className="form-label">Current Academic Year</label>
                <select 
                  className="form-control" 
                  value={academics.currentYear} 
                  onChange={e => setAcademics({ ...academics, currentYear: Number(e.target.value) })}
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
              <div>
                <label className="form-label">Graduation Year</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={academics.graduationYear} 
                  onChange={e => setAcademics({ ...academics, graduationYear: Number(e.target.value) })} 
                  required 
                />
              </div>
              <div>
                <label className="form-label">College Email ID</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={academics.collegeEmail} 
                  onChange={e => setAcademics({ ...academics, collegeEmail: e.target.value })} 
                  placeholder="student@college.edu" 
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Performance & Backlogs</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <div>
                  <label className="form-label">Current CGPA (Scale of 10.0)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="10" 
                    className="form-control" 
                    value={academics.cgpa} 
                    onChange={e => setAcademics({ ...academics, cgpa: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">10th Class Percentage (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="100" 
                    className="form-control" 
                    value={academics.tenthPercentage} 
                    onChange={e => setAcademics({ ...academics, tenthPercentage: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="form-label">12th / Diploma Percentage (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="100" 
                    className="form-control" 
                    value={academics.twelfthPercentage} 
                    onChange={e => setAcademics({ ...academics, twelfthPercentage: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="form-label">Active Backlogs</label>
                  <input 
                    type="number" 
                    min="0" 
                    className="form-control" 
                    value={academics.activeBacklogs} 
                    onChange={e => setAcademics({ ...academics, activeBacklogs: Number(e.target.value) })} 
                  />
                </div>
                <div>
                  <label className="form-label">History of Backlogs</label>
                  <input 
                    type="number" 
                    min="0" 
                    className="form-control" 
                    value={academics.historyOfBacklogs} 
                    onChange={e => setAcademics({ ...academics, historyOfBacklogs: Number(e.target.value) })} 
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Academic Details'}
              </button>
            </div>
          </form>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: '0 0 var(--space-2) 0' }}>Technical & Soft Skills</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                Skills account for 40% of candidate evaluation in algorithmic scoring. Add your core competencies and proficiencies accurately.
              </p>
            </div>

            {/* Existing Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              {skills.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No skills added yet. Add your first skill below.</p>
              ) : (
                skills.map((skill, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-2)', 
                      padding: '0.4rem 0.8rem', 
                      background: 'var(--color-surface)', 
                      border: '1px solid var(--color-border)', 
                      borderRadius: 'var(--radius-md)' 
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{skill.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: 'var(--space-2)' }}>
                        ({skill.proficiency} · {skill.yearsOfExperience || 1}y)
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(idx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', display: 'flex', padding: 2 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 600, margin: '0 0 var(--space-3) 0' }}>Add New Skill</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
                <div>
                  <label className="form-label">Skill Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. React, Python, Docker" 
                    value={newSkill.name} 
                    onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select 
                    className="form-control" 
                    value={newSkill.category} 
                    onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                  >
                    <option value="technical">Technical</option>
                    <option value="soft">Soft Skill</option>
                    <option value="tool">Tool / DevOps</option>
                    <option value="domain">Domain Knowledge</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Proficiency</label>
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
                  <label className="form-label">Experience (Years)</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0" 
                    className="form-control" 
                    value={newSkill.yearsOfExperience} 
                    onChange={e => setNewSkill({ ...newSkill, yearsOfExperience: e.target.value })} 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  <Plus size={16} /> Add Skill
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: '0 0 var(--space-2) 0' }}>Portfolio & Projects</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                Projects contribute 15% towards algorithm evaluation. Provide live links and technical details.
              </p>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {projects.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No projects registered yet.</p>
              ) : (
                projects.map((proj, idx) => (
                  <div key={idx} className="card" style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-md)', fontWeight: 600 }}>{proj.title}</h4>
                        {proj.role && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Role: {proj.role}</span>}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveProject(idx)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', margin: 'var(--space-2) 0' }}>
                      {proj.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                      {(proj.technologies || []).map((tech, tIdx) => (
                        <span key={tIdx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{tech}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                          GitHub Repository ↗
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Project Form */}
            <form onSubmit={handleAddProject} style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 600, margin: '0 0 var(--space-3) 0' }}>Add Project</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
                  <div>
                    <label className="form-label">Project Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Distributed Task Queue" 
                      value={newProject.title} 
                      onChange={e => setNewProject({ ...newProject, title: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="form-label">Role</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Lead Backend Engineer" 
                      value={newProject.role} 
                      onChange={e => setNewProject({ ...newProject, role: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="form-label">Technologies (comma-separated)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Node.js, Redis, Docker, React" 
                      value={newProject.technologies} 
                      onChange={e => setNewProject({ ...newProject, technologies: e.target.value })} 
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Description & Architecture</label>
                  <textarea 
                    className="form-control" 
                    rows={3} 
                    placeholder="Briefly describe the problem solved, architecture choices, and impact..."
                    value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div>
                    <label className="form-label">GitHub URL</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="https://github.com/..." 
                      value={newProject.githubUrl} 
                      onChange={e => setNewProject({ ...newProject, githubUrl: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="form-label">Live Demo URL</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="https://..." 
                      value={newProject.liveUrl} 
                      onChange={e => setNewProject({ ...newProject, liveUrl: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  <Plus size={16} /> Add Project
                </button>
              </div>
            </form>
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === 'experience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: '0 0 var(--space-2) 0' }}>Internships & Work Experience</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                Experience contributes 15% to algorithmic evaluation. Add all prior internships, fellowships, and part-time engineering roles.
              </p>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {experience.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No work experience recorded.</p>
              ) : (
                experience.map((exp, idx) => (
                  <div key={idx} className="card" style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-md)', fontWeight: 600 }}>{exp.title}</h4>
                        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                          <strong>{exp.company}</strong> · {exp.location || 'Remote'}
                        </p>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} - {exp.currentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A')}
                        </span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveExperience(idx)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {exp.description && (
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginTop: 'var(--space-2)' }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add Exp Form */}
            <form onSubmit={handleAddExperience} style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 600, margin: '0 0 var(--space-3) 0' }}>Add Work Experience</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                  <div>
                    <label className="form-label">Role Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. SDE Intern" 
                      value={newExp.title} 
                      onChange={e => setNewExp({ ...newExp, title: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="form-label">Company / Organization</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Razorpay" 
                      value={newExp.company} 
                      onChange={e => setNewExp({ ...newExp, company: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="form-label">Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Bengaluru / Remote" 
                      value={newExp.location} 
                      onChange={e => setNewExp({ ...newExp, location: e.target.value })} 
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
                  <div>
                    <label className="form-label">Start Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={newExp.startDate} 
                      onChange={e => setNewExp({ ...newExp, startDate: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="form-label">End Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      disabled={newExp.currentlyWorking}
                      value={newExp.endDate} 
                      onChange={e => setNewExp({ ...newExp, endDate: e.target.value })} 
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 'var(--space-5)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={newExp.currentlyWorking} 
                        onChange={e => setNewExp({ ...newExp, currentlyWorking: e.target.checked })} 
                      />
                      Currently Working Here
                    </label>
                  </div>
                </div>
                <div>
                  <label className="form-label">Work Summary</label>
                  <textarea 
                    className="form-control" 
                    rows={2} 
                    placeholder="Key deliverables, impact, and tooling used..."
                    value={newExp.description}
                    onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  <Plus size={16} /> Add Experience
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: '0 0 var(--space-2) 0' }}>Certifications & Honors</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                Certifications validate domain skills (AWS Certified, Google Cloud, HackerRank, etc.).
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {certifications.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No certifications listed yet.</p>
              ) : (
                certifications.map((c, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div>
                      <strong style={{ fontSize: 'var(--text-sm)' }}>{c.name}</strong>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                        {c.issuer} {c.issueDate && `· ${new Date(c.issueDate).toLocaleDateString()}`}
                      </div>
                      {c.credentialUrl && (
                        <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>
                          Verify Credential ↗
                        </a>
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveCert(idx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddCert} style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 600, margin: '0 0 var(--space-3) 0' }}>Add Certification</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                <div>
                  <label className="form-label">Certification Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. AWS Certified Developer" 
                    value={newCert.name} 
                    onChange={e => setNewCert({ ...newCert, name: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Issuing Authority</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Amazon Web Services" 
                    value={newCert.issuer} 
                    onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="form-label">Credential Verification URL</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="https://..." 
                    value={newCert.credentialUrl} 
                    onChange={e => setNewCert({ ...newCert, credentialUrl: e.target.value })} 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  <Plus size={16} /> Add Certification
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === 'preferences' && (
          <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: '0 0 var(--space-2) 0' }}>Job & Location Preferences</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                Candidate preferences contribute 10% towards recommendation and allocation fit scores.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
              <div>
                <label className="form-label">Preferred Locations (comma-separated)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Bengaluru, Hyderabad, Pune, Remote" 
                  value={preferences.preferredLocations} 
                  onChange={e => setPreferences({ ...preferences, preferredLocations: e.target.value })} 
                />
              </div>
              <div>
                <label className="form-label">Preferred Job Roles (comma-separated)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Frontend Engineer, Full Stack, SRE" 
                  value={preferences.preferredRoles} 
                  onChange={e => setPreferences({ ...preferences, preferredRoles: e.target.value })} 
                />
              </div>
              <div>
                <label className="form-label">Minimum Expected CTC / Stipend (₹/year)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="e.g. 800000" 
                  value={preferences.minimumSalary} 
                  onChange={e => setPreferences({ ...preferences, minimumSalary: e.target.value })} 
                />
              </div>
            </div>
            <div style={{ marginTop: 'var(--space-2)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={preferences.openToRelocation} 
                  onChange={e => setPreferences({ ...preferences, openToRelocation: e.target.checked })} 
                />
                Open to Relocation across India / International
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        )}

        {/* RESUME TAB */}
        {activeTab === 'resume' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: '0 0 var(--space-2) 0' }}>Resume Document</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                Upload your official PDF resume. When applying for an opportunity, an immutable snapshot of this resume is permanently stored with your application.
              </p>
            </div>

            {resumeUrl && (
              <div style={{ 
                padding: 'var(--space-4)', 
                background: 'var(--color-surface)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <FileText size={24} color="var(--color-primary)" />
                  <div>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>Active Resume on File</strong>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>PDF Document uploaded and verified</div>
                  </div>
                </div>
                <a 
                  href={resumeUrl.startsWith('http') ? resumeUrl : `/api${resumeUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary btn-sm"
                >
                  View Document ↗
                </a>
              </div>
            )}

            <form onSubmit={handleResumeUpload} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label className="form-label">Select Resume File (.pdf, max 5MB)</label>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="form-control" 
                  onChange={e => setResumeFile(e.target.files[0])} 
                  required 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={saving || !resumeFile}>
                  <Upload size={16} /> {saving ? 'Uploading...' : 'Upload Resume'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
