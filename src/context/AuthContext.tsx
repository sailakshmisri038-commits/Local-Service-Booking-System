import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | 'guest';
  loginAs: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const mockUsers: Record<UserRole, UserProfile> = {
  customer: {
    id: 'cust-1',
    email: 'ananya.s@example.com',
    fullName: 'Ananya Sharma',
    phone: '+91 98765 11111',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'customer',
    createdAt: '2026-01-15T00:00:00Z',
  },
  provider: {
    id: 'prov-1',
    email: 'rajesh.apex@example.com',
    fullName: 'Rajesh Kumar (Apex Plumbing)',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
    role: 'provider',
    createdAt: '2026-01-10T00:00:00Z',
  },
  admin: {
    id: 'admin-1',
    email: 'admin@localconnect.com',
    fullName: 'Platform Admin',
    phone: '+91 99999 00000',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('localconnect_active_role');
    if (saved && (saved === 'customer' || saved === 'provider' || saved === 'admin')) {
      return mockUsers[saved];
    }
    // Default to customer for immediate intuitive preview
    return mockUsers.customer;
  });

  const loginAs = (targetRole: UserRole) => {
    const newUser = mockUsers[targetRole];
    setUser(newUser);
    localStorage.setItem('localconnect_active_role', targetRole);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('localconnect_active_role');
  };

  const role = user ? user.role : 'guest';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, role, loginAs, logout, isAuthenticated }}>
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
