import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Settings, Sliders, ShieldCheck, Save, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SystemSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Algorithm Weights (must sum to 100)
  const [weights, setWeights] = useState({
    skillWeight: 40,
    academicWeight: 20,
    projectWeight: 15,
    experienceWeight: 15,
    preferenceWeight: 10
  });

  // Policies
  const [policies, setPolicies] = useState({
    enforcePreDeadlineLock: true,
    oneStudentOneJobPolicy: true,
    autoRejectIneligible: true,
    topNDefaultLimit: 10
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getAlgorithmConfig();
      if (res.config) {
        setWeights({
          skillWeight: res.config.skillWeight ?? 40,
          academicWeight: res.config.academicWeight ?? 20,
          projectWeight: res.config.projectWeight ?? 15,
          experienceWeight: res.config.experienceWeight ?? 15,
          preferenceWeight: res.config.preferenceWeight ?? 10
        });
        if (res.config.policies) {
          setPolicies({ ...policies, ...res.config.policies });
        }
      }
    } catch (err) {
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const totalWeight = Number(weights.skillWeight) + Number(weights.academicWeight) + 
                      Number(weights.projectWeight) + Number(weights.experienceWeight) + 
                      Number(weights.preferenceWeight);

  const isValid = totalWeight === 100;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isValid) {
      toast.error(`Total weight must equal exactly 100%. Currently: ${totalWeight}%`);
      return;
    }
    try {
      setSaving(true);
      await api.admin.updateAlgorithmConfig({
        ...weights,
        policies
      });
      toast.success('Algorithm scoring weights calibrated and saved!');
    } catch (err) {
      toast.error(err.message || 'Failed to update algorithm settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setWeights({
      skillWeight: 40,
      academicWeight: 20,
      projectWeight: 15,
      experienceWeight: 15,
      preferenceWeight: 10
    });
    toast.info('Weights reset to standard defaults (40-20-15-15-10)');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>Algorithmic Engine Calibration</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
          Fine-tune multi-factor candidate ranking weights and institutional recruitment fairness policies in real time.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Scoring Weights */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Sliders size={20} color="var(--color-primary)" />
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>
                Candidate Evaluation Formula Weights
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span className={`badge ${isValid ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 'var(--text-sm)' }}>
                Total: {totalWeight}% {isValid ? '✓' : '(Must equal 100%)'}
              </span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleResetDefaults}>
                <RotateCcw size={14} /> Reset Defaults
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Skill Weight */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
                <span><strong>Skills Match Weight (w_skill)</strong> - Technical & Domain proficiency</span>
                <strong>{weights.skillWeight}%</strong>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={weights.skillWeight}
                onChange={e => setWeights({ ...weights, skillWeight: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              />
            </div>

            {/* Academic Weight */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
                <span><strong>Academic Standing Weight (w_acad)</strong> - CGPA & backlog penalty</span>
                <strong>{weights.academicWeight}%</strong>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={weights.academicWeight}
                onChange={e => setWeights({ ...weights, academicWeight: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              />
            </div>

            {/* Project Weight */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
                <span><strong>Projects Portfolio Weight (w_proj)</strong> - Verified codebases & live links</span>
                <strong>{weights.projectWeight}%</strong>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={weights.projectWeight}
                onChange={e => setWeights({ ...weights, projectWeight: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              />
            </div>

            {/* Experience Weight */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
                <span><strong>Experience Weight (w_exp)</strong> - Prior internships & engineering roles</span>
                <strong>{weights.experienceWeight}%</strong>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={weights.experienceWeight}
                onChange={e => setWeights({ ...weights, experienceWeight: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              />
            </div>

            {/* Preference Weight */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
                <span><strong>Preferences Weight (w_pref)</strong> - Role alignment & location match</span>
                <strong>{weights.preferenceWeight}%</strong>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={weights.preferenceWeight}
                onChange={e => setWeights({ ...weights, preferenceWeight: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Platform Policy Toggles */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
            <ShieldCheck size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>
              Placement Cell Institutional Policies
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={policies.enforcePreDeadlineLock} 
                onChange={e => setPolicies({ ...policies, enforcePreDeadlineLock: e.target.checked })} 
                style={{ marginTop: '0.2rem' }}
              />
              <div>
                <strong>Enforce Pre-Deadline Candidate Privacy Lock (Recommended)</strong>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Prevents recruiters from inspecting candidate identities or scores before the application window terminates.
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={policies.oneStudentOneJobPolicy} 
                onChange={e => setPolicies({ ...policies, oneStudentOneJobPolicy: e.target.checked })} 
                style={{ marginTop: '0.2rem' }}
              />
              <div>
                <strong>One-Student One-Job Policy Enforcement</strong>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Students who accept a primary placement offer are automatically frozen from participating in parallel active drives.
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={policies.autoRejectIneligible} 
                onChange={e => setPolicies({ ...policies, autoRejectIneligible: e.target.checked })} 
                style={{ marginTop: '0.2rem' }}
              />
              <div>
                <strong>Deterministic Eligibility Rejection with Transparent Reasons</strong>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Provides students instant, transparent feedback detailing which academic or branch rules failed.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <button type="submit" className="btn btn-primary" disabled={saving || !isValid}>
            <Save size={16} /> {saving ? 'Saving Calibration...' : 'Save Algorithm Calibration'}
          </button>
        </div>
      </form>
    </div>
  );
}
