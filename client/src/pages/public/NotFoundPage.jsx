import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{ backgroundColor: '#EBF4DD', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <AlertTriangle size={32} color="#DC2626" />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontFamily: "'Bebas Neue', sans-serif", color: '#3B4953' }}>404 - Page Not Found</h1>
        <p style={{ color: '#4A5B67', fontSize: '0.95rem', margin: '10px 0 28px' }}>
          The recruitment page or application resource you requested does not exist or has been archived.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
