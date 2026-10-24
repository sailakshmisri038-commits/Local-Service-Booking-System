import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Calendar,
  User,
  ShieldCheck,
  Briefcase,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { user, role, loginAs, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole: UserRole) => {
    loginAs(newRole);
    setRoleDropdownOpen(false);
    if (newRole === 'customer') navigate('/customer');
    if (newRole === 'provider') navigate('/provider');
    if (newRole === 'admin') navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LocalConnect
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-md">
                Verified Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/services" className="hover:text-blue-600 transition-colors">
              Browse Services
            </Link>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How It Works
            </a>
          </nav>

          {/* Action Area & Role Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Tester Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-full border border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-100 transition-colors"
                title="Switch role for demonstration"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Role: <strong className="capitalize">{role}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Project Demo Switcher
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('customer')}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 transition ${
                      role === 'customer' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4 text-blue-500" />
                    Customer (Ananya)
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('provider')}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 transition ${
                      role === 'provider' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-amber-500" />
                    Provider (Rajesh Kumar)
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 transition ${
                      role === 'admin' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Admin (System Admin)
                  </button>
                </div>
              )}
            </div>

            {/* Role-Specific Dashboard Button */}
            {role === 'customer' && (
              <Link
                to="/customer"
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
              >
                <Calendar className="w-4 h-4" />
                <span>My Bookings</span>
              </Link>
            )}

            {role === 'provider' && (
              <Link
                to="/provider"
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
              >
                <Briefcase className="w-4 h-4" />
                <span>Provider Portal</span>
              </Link>
            )}

            {role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg bg-slate-900 hover:bg-black text-white shadow-sm transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}

            {user && (
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium"
          >
            Home
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium"
          >
            Browse Services
          </Link>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold uppercase text-slate-400 mb-2">
              Demo Role Selection
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  handleRoleSwitch('customer');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 text-xs rounded-lg border font-medium ${
                  role === 'customer'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('provider');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 text-xs rounded-lg border font-medium ${
                  role === 'provider'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                Provider
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('admin');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 text-xs rounded-lg border font-medium ${
                  role === 'admin'
                    ? 'border-slate-800 bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            {role === 'customer' && (
              <Link
                to="/customer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm"
              >
                Go to My Bookings
              </Link>
            )}
            {role === 'provider' && (
              <Link
                to="/provider"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm"
              >
                Go to Provider Portal
              </Link>
            )}
            {role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-2.5 rounded-lg bg-slate-900 text-white font-medium text-sm"
              >
                Go to Admin Console
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
