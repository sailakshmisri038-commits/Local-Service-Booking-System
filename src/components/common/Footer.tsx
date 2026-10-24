import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, CheckCircle2, Phone, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                LocalConnect
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A trusted local service booking and management platform bridging verified independent technicians and households.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>B.Tech Final Year Capstone Project</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              Popular Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services?category=cat-1" className="hover:text-white transition">
                  Plumbing & Pipe Repair
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat-2" className="hover:text-white transition">
                  Electrical & Wiring
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat-3" className="hover:text-white transition">
                  House Deep Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat-4" className="hover:text-white transition">
                  AC & Appliance Repair
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat-5" className="hover:text-white transition">
                  Carpentry & Woodwork
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Roles */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              Platform Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/customer" className="hover:text-white transition">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/provider" className="hover:text-white transition">
                  Provider Management Hub
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">
                  Admin Verification Desk
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Service Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              LocalConnect Guarantee
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Verified backgrounds & licensed local technicians</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero double-booking guarantee via atomic scheduling</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Transparent pricing with no hidden visit fees</span>
              </div>
              <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-400" /> +91 (800) 555-0199
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> help@localconnect.app
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LocalConnect Platform. Designed for B.Tech Final Year Evaluation.</p>
          <div className="flex items-center gap-1 text-slate-400">
            Built with React, TypeScript, Tailwind CSS & Supabase
          </div>
        </div>
      </div>
    </footer>
  );
};
