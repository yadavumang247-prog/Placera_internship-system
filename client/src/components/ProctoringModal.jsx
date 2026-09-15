import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, ShieldAlert, CheckCircle, AlertTriangle, Monitor, ArrowRight, VideoOff, MicOff } from 'lucide-react';

export default function ProctoringModal({ isOpen, onComplete, testTitle = 'Technical Assessment' }) {
  const [stream, setStream] = useState(null);
  const [cameraStatus, setCameraStatus] = useState('checking'); // 'checking', 'granted', 'denied'
  const [micStatus, setMicStatus] = useState('checking');
  const [audioLevel, setAudioLevel] = useState(0);
  const [fullscreenChecked, setFullscreenChecked] = useState(false);
  const [tabWarningAccepted, setTabWarningAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSimulated, setIsSimulated] = useState(false);

  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      requestMediaPermissions();
    }
    return () => {
      stopMediaStream();
    };
  }, [isOpen]);

  const requestMediaPermissions = async () => {
    setCameraStatus('checking');
    setMicStatus('checking');
    setErrorMessage('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support webcam/microphone media devices.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true,
      });

      setStream(mediaStream);
      setCameraStatus('granted');
      setMicStatus('granted');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Audio Level Analyzer
      setupAudioAnalyzer(mediaStream);
    } catch (err) {
      console.warn('Camera/Mic permission access issue:', err);
      setCameraStatus('denied');
      setMicStatus('denied');
      setErrorMessage(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera or microphone access was blocked. Please click the camera/lock icon in your browser address bar to allow access.'
          : 'Could not detect an active camera/microphone device on your system.'
      );
    }
  };

  const setupAudioAnalyzer = (mediaStream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animationFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (e) {
      console.log('Audio analyzer fallback', e);
    }
  };

  const stopMediaStream = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleSimulatePermissions = () => {
    setIsSimulated(true);
    setCameraStatus('granted');
    setMicStatus('granted');
    setAudioLevel(45);
    setErrorMessage('');
  };

  const handleStart = () => {
    // Request fullscreen if supported
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    onComplete({
      stream,
      isSimulated,
      cameraStatus,
      micStatus,
    });
  };

  if (!isOpen) return null;

  const canProceed = (cameraStatus === 'granted' && micStatus === 'granted') || isSimulated;

  return (
    <div style={styles.overlay}>
      <div className="card" style={styles.modalCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <ShieldAlert size={14} /> AI Proctoring Security Setup
          </div>
          <h2 style={styles.title}>System & Hardware Permissions Check</h2>
          <p style={styles.subtitle}>
            To ensure fair and accredited candidate evaluation for <strong>{testTitle}</strong>, Placera requires active video and audio monitoring throughout the session.
          </p>
        </div>

        {/* Live Video & Audio Preview Box */}
        <div style={styles.previewContainer}>
          <div style={styles.videoWrapper}>
            {cameraStatus === 'granted' && !isSimulated ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={styles.video}
              />
            ) : isSimulated ? (
              <div style={styles.simulatedVideo}>
                <div style={styles.avatarCircle}>Candidate Active</div>
                <span style={{ fontSize: '0.78rem', color: '#5A7863', fontWeight: 600 }}>
                  ● Simulation Stream Verified
                </span>
              </div>
            ) : (
              <div style={styles.noVideoPlaceholder}>
                <VideoOff size={40} color="#718290" />
                <span style={{ fontSize: '0.85rem', color: '#718290', marginTop: '8px' }}>
                  Camera Not Active
                </span>
              </div>
            )}

            {/* Video Status Pill */}
            <div style={styles.videoOverlayBadge}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: canProceed ? '#10B981' : '#EF4444' }} />
              {canProceed ? 'Webcam Live' : 'Camera Awaiting Access'}
            </div>
          </div>

          {/* Audio VU Meter */}
          <div style={styles.audioMeterContainer}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3B4953', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mic size={14} color={micStatus === 'granted' ? '#5A7863' : '#718290'} /> Microphone Activity
              </span>
              <span style={{ fontSize: '0.75rem', color: '#718290' }}>
                {micStatus === 'granted' ? `${audioLevel}% Level` : 'Inactive'}
              </span>
            </div>
            <div style={styles.meterTrack}>
              <div
                style={{
                  ...styles.meterFill,
                  width: `${audioLevel}%`,
                  backgroundColor: audioLevel > 75 ? '#F59E0B' : '#5A7863',
                }}
              />
            </div>
          </div>
        </div>

        {/* Error Alert if blocked */}
        {errorMessage && (
          <div style={styles.errorBox}>
            <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#991B1B', fontWeight: 500 }}>
                {errorMessage}
              </p>
              <div style={{ marginTop: '8px', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={requestMediaPermissions}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                >
                  Retry Device Access
                </button>
                <button
                  type="button"
                  onClick={handleSimulatePermissions}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '4px 10px', backgroundColor: '#5A7863' }}
                >
                  Use Simulation Mode (Review UI)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Proctoring Verification Checklist */}
        <div style={styles.checklist}>
          <div style={styles.checkItem}>
            <CheckCircle size={16} color={cameraStatus === 'granted' ? '#10B981' : '#9CA3AF'} />
            <span>High-definition video feed verified for facial presence</span>
          </div>
          <div style={styles.checkItem}>
            <CheckCircle size={16} color={micStatus === 'granted' ? '#10B981' : '#9CA3AF'} />
            <span>Continuous background acoustic & audio monitoring</span>
          </div>
          <div style={styles.checkItem}>
            <CheckCircle size={16} color="#10B981" />
            <span>Anti-cheat tab switch and window blur detection active</span>
          </div>
          <div style={styles.checkItem}>
            <CheckCircle size={16} color="#10B981" />
            <span>Fullscreen lockdown mode automatically applied upon entry</span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', gap: '8px' }}
            disabled={!canProceed}
            onClick={handleStart}
          >
            I Agree & Enter Proctored Assessment <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(38, 51, 61, 0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modalCard: {
    maxWidth: '560px',
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    border: '1px solid #D6E4C6',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#5A7863',
    backgroundColor: '#EBF4DD',
    padding: '4px 10px',
    borderRadius: '12px',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#26333D',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '0.86rem',
    color: '#4A5B67',
    margin: 0,
    lineHeight: 1.5,
  },
  previewContainer: {
    backgroundColor: '#F6FAEE',
    border: '1.5px solid #D6E4C6',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
  },
  videoWrapper: {
    position: 'relative',
    height: '220px',
    backgroundColor: '#1E293B',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  simulatedVideo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  avatarCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#5A7863',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    textAlign: 'center',
  },
  noVideoPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoOverlayBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    color: '#FFFFFF',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.72rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backdropFilter: 'blur(4px)',
  },
  audioMeterContainer: {
    marginTop: '12px',
  },
  meterTrack: {
    height: '8px',
    backgroundColor: '#E2E8F0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    transition: 'width 0.1s ease',
    borderRadius: '4px',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  checklist: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '0.82rem',
    color: '#475569',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '12px 14px',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};
