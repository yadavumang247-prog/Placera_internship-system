/**
 * Centralized API Client
 * Automatically manages JWT authorization headers and consistent error handling.
 */

const API_BASE_URL = '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('smart_place_token');

  const headers = {
    ...options.headers,
  };

  // If payload is not FormData, default to application/json
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('smart_place_token');
        localStorage.removeItem('smart_place_user');
      }
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) =>
    apiRequest(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (endpoint, body) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),

  // Student portal API methods
  student: {
    getProfile: () => api.get('/students/profile'),
    updateProfile: (data) => api.put('/students/profile', data),
    uploadResume: (formData) => api.post('/students/resume', formData),
    getRecommendations: () => api.get('/students/recommendations'),
    getApplications: () => api.get('/applications/student'),
    getApplicationById: (id) => api.get(`/applications/${id}`),
    withdrawApplication: (id) => api.put(`/applications/${id}/withdraw`),
    respondToOffer: (id, data) => api.put(`/applications/${id}/respond`, data),
    getAssessments: () => api.get('/assessments'),
    getAssessmentById: (id) => api.get(`/assessments/${id}`),
    submitAssessment: (id, data) => api.post(`/assessments/${id}/submit`, data),
    runCode: (data) => api.post('/assessments/coding/run', data),
    submitCode: (id, data) => api.post('/assessments/coding/submit', { ...data, assessmentId: id }),
    getInterviews: () => api.get('/interviews'),
    getNotifications: () => api.get('/notifications'),
    markAllNotificationsRead: () => api.put('/notifications/read-all'),
    markNotificationRead: (id) => api.put(`/notifications/${id}/read`),
  },

  // Recruiter portal API methods
  recruiter: {
    getDashboard: async () => {
      const [oppsRes, analyticsRes] = await Promise.all([
        api.get('/recruiter/opportunities').catch(() => ({ opportunities: [] })),
        api.get('/recruiter/analytics').catch(() => ({ stats: {} })),
      ]);
      const opps = oppsRes.opportunities || [];
      const stats = analyticsRes.stats || {
        activeOpportunities: opps.length,
        totalApplicants: opps.reduce((acc, o) => acc + (o.applicantCount || 0), 0),
        interviewsScheduled: opps.reduce((acc, o) => acc + (o.shortlistedCount || 0), 0),
        offersExtended: opps.reduce((acc, o) => acc + (o.selectedCount || 0), 0),
      };
      return {
        opportunities: opps,
        stats,
      };
    },
    getOpportunities: () => api.get('/recruiter/opportunities'),
    createOpportunity: (data) => api.post('/opportunities', data),
    getOpportunityApplications: (id) => api.get(`/recruiter/opportunities/${id}/applications`),
    rankCandidates: (id, data) => api.post(`/recruiter/opportunities/${id}/rank`, data),
    updateApplicationStatus: (id, data) => api.put(`/recruiter/applications/${id}/status`, data),
    getInterviews: () => api.get('/interviews'),
    scheduleInterview: (data) => api.post('/interviews', data),
    submitInterviewRubric: (id, data) => api.put(`/interviews/${id}/evaluate`, data),
    getAnalytics: () => api.get('/recruiter/analytics'),
  },

  // Admin portal API methods
  admin: {
    getDashboard: async () => {
      const res = await api.get('/admin/dashboard');
      const m = res.metrics || {};
      return {
        ...res,
        stats: res.stats || {
          totalStudents: m.totalStudents || 0,
          verifiedStudents: m.verifiedStudents || 0,
          pendingStudents: m.pendingStudents || 0,
          totalRecruiters: m.totalRecruiters || 0,
          verifiedRecruiters: m.verifiedRecruiters || 0,
          pendingRecruiters: m.pendingRecruiters || 0,
          totalPlacements: m.totalSelected || 0,
          placedStudents: m.totalSelected || 0,
          placementRate: m.overallPlacementRate || 0,
          activeRecruiters: m.verifiedRecruiters || m.totalRecruiters || 0,
          activeOpportunities: m.activeOpportunities || 0,
          totalApplications: m.totalApplications || 0,
          averageCtc: 1240000,
        },
        recentDrives: res.activeDrives || [],
      };
    },
    getAnalytics: () => api.get('/admin/analytics'),
    getStudents: () => api.get('/admin/students'),
    verifyStudent: (id, data) => api.put(`/admin/students/${id}/verify`, data),
    getRecruiters: () => api.get('/admin/recruiters'),
    verifyRecruiter: (id, data) => api.put(`/admin/recruiters/${id}/verify`, data),
    getAlgorithmConfig: () => api.get('/admin/algorithm-config'),
    updateAlgorithmConfig: (data) => api.put('/admin/algorithm-config', data),
    getDrives: () => api.get('/admin/drives'),
    createDrive: (data) => api.post('/admin/drives', data),
  },
};
