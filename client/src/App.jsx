import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import OpportunitiesPage from './pages/public/OpportunitiesPage';
import OpportunityDetailPage from './pages/public/OpportunityDetailPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import { RegisterStudentPage } from './pages/auth/RegisterStudentPage';
import { RegisterRecruiterPage } from './pages/auth/RegisterRecruiterPage';
import { RegisterCollegeAdminPage } from './pages/auth/RegisterCollegeAdminPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentApplicationDetailPage from './pages/student/StudentApplicationDetailPage';
import StudentAssessmentsPage from './pages/student/StudentAssessmentsPage';
import TakeAssessmentPage from './pages/student/TakeAssessmentPage';
import CodingAssessmentPage from './pages/student/CodingAssessmentPage';
import StudentInterviewsPage from './pages/student/StudentInterviewsPage';
import StudentNotificationsPage from './pages/student/StudentNotificationsPage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CreateOpportunityPage from './pages/recruiter/CreateOpportunityPage';
import OpportunityApplicationsPage from './pages/recruiter/OpportunityApplicationsPage';
import ManageInterviewsPage from './pages/recruiter/ManageInterviewsPage';
import RecruiterAnalyticsPage from './pages/recruiter/RecruiterAnalyticsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentVerificationPage from './pages/admin/StudentVerificationPage';
import RecruiterVerificationPage from './pages/admin/RecruiterVerificationPage';
import PlacementDrivesPage from './pages/admin/PlacementDrivesPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="skeleton" style={{ width: 120, height: 120, borderRadius: '50%' }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's authorized dashboard
    if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (user.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
    if (user.role === 'ADMIN' || user.role === 'COLLEGE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/student" element={<RegisterStudentPage />} />
        <Route path="/register/recruiter" element={<RegisterRecruiterPage />} />
        <Route path="/register/college" element={<RegisterCollegeAdminPage />} />
        <Route path="/register/college-admin" element={<RegisterCollegeAdminPage />} />
      </Route>

      {/* Student Portal with DashboardLayout */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="applications" element={<StudentApplicationsPage />} />
        <Route path="applications/:id" element={<StudentApplicationDetailPage />} />
        <Route path="assessments" element={<StudentAssessmentsPage />} />
        <Route path="assessments/:id" element={<TakeAssessmentPage />} />
        <Route path="assessments/:id/code" element={<CodingAssessmentPage />} />
        <Route path="assessments/coding" element={<CodingAssessmentPage />} />
        <Route path="assessments/practice" element={<CodingAssessmentPage />} />
        <Route path="interviews" element={<StudentInterviewsPage />} />
        <Route path="notifications" element={<StudentNotificationsPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Recruiter Portal with DashboardLayout */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN', 'COLLEGE_ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="opportunities" element={<RecruiterDashboard />} />
        <Route path="opportunities/new" element={<CreateOpportunityPage />} />
        <Route path="opportunities/create" element={<CreateOpportunityPage />} />
        <Route path="opportunities/:id/applications" element={<OpportunityApplicationsPage />} />
        <Route path="interviews" element={<ManageInterviewsPage />} />
        <Route path="analytics" element={<RecruiterAnalyticsPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Admin / College Placement Portal with DashboardLayout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COLLEGE_ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentVerificationPage />} />
        <Route path="recruiters" element={<RecruiterVerificationPage />} />
        <Route path="drives" element={<PlacementDrivesPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<SystemSettingsPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* 404 Wildcard */}
      <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
    </Routes>
  );
}
