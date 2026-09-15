import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smart_place_token'));
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
        setOrganization(res.organization);
      }
    } catch (err) {
      console.warn('Session expired or not authenticated:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('smart_place_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
      setOrganization(res.organization);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const registerStudent = async (studentData) => {
    const res = await api.post('/auth/register/student', studentData);
    if (res.success) {
      localStorage.setItem('smart_place_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
      return res;
    }
    throw new Error(res.message || 'Student registration failed');
  };

  const registerRecruiter = async (recruiterData) => {
    const res = await api.post('/auth/register/recruiter', recruiterData);
    if (res.success) {
      localStorage.setItem('smart_place_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
      setOrganization(res.organization);
      return res;
    }
    throw new Error(res.message || 'Recruiter registration failed');
  };

  const logout = () => {
    localStorage.removeItem('smart_place_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setOrganization(null);
  };

  const refreshUser = async () => {
    await fetchMe();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        organization,
        token,
        loading,
        login,
        registerStudent,
        registerRecruiter,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isStudent: user?.role === 'STUDENT',
        isRecruiter: user?.role === 'RECRUITER',
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
