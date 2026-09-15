import React from 'react';
import {
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  Video,
  FileCheck,
  Send,
  AlertCircle,
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'APPLIED':
      return (
        <span className="badge badge-neutral">
          <Send size={12} /> Applied
        </span>
      );
    case 'SHORTLISTED':
      return (
        <span className="badge badge-sage">
          <Award size={12} /> Top Shortlist
        </span>
      );
    case 'ROUND_PENDING':
      return (
        <span className="badge badge-warning">
          <Clock size={12} /> Round Pending
        </span>
      );
    case 'ROUND_IN_PROGRESS':
      return (
        <span className="badge badge-warning">
          <Clock size={12} /> In Progress
        </span>
      );
    case 'ROUND_PASSED':
      return (
        <span className="badge badge-success">
          <CheckCircle2 size={12} /> Round Passed
        </span>
      );
    case 'ROUND_FAILED':
    case 'REJECTED':
      return (
        <span className="badge badge-danger">
          <XCircle size={12} /> Not Selected
        </span>
      );
    case 'INTERVIEW_SCHEDULED':
      return (
        <span className="badge" style={{ backgroundColor: '#EDE9FE', color: '#6D28D9', border: '1px solid #DDD6FE' }}>
          <Video size={12} /> Interview Scheduled
        </span>
      );
    case 'SELECTED':
      return (
        <span className="badge badge-success" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
          <Award size={12} /> Selected
        </span>
      );
    case 'OFFER_RELEASED':
      return (
        <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }}>
          <FileCheck size={12} /> Offer Released
        </span>
      );
    case 'WITHDRAWN':
      return (
        <span className="badge badge-neutral">
          <AlertCircle size={12} /> Withdrawn
        </span>
      );
    default:
      return <span className="badge badge-neutral">{status || 'Pending'}</span>;
  }
};

export default StatusBadge;
