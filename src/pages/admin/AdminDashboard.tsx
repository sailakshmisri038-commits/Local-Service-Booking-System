import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { mockCategories } from '../../data/mockCategories';
import { VerificationStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { providers, bookings, updateProviderVerification } = useBooking();

  const [activeTab, setActiveTab] = useState<'verifications' | 'categories' | 'bookings'>('verifications');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified'>('all');

  // Stats calculation
  const totalProviders = providers.length;
  const verifiedProviders = providers.filter((p) => p.verificationStatus === 'verified').length;
  const pendingVerifications = providers.filter((p) => p.verificationStatus === 'pending').length;
  const totalPlatformBookings = bookings.length;
  const grossVolume = bookings
    .filter((b) => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const filteredProviders = providers.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.verificationStatus === statusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Super Administrator Operations Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs text-slate-400">
              Review technician credentials, manage service categories, and monitor ecosystem health.
            </p>
          </div>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Registered Providers
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{totalProviders}</span>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                {verifiedProviders} Verified
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Verification Queue
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">
                {pendingVerifications}
              </span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Bookings
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-blue-600">
                {totalPlatformBookings}
              </span>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Gross Volume
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                ₹{grossVolume.toLocaleString()}
              </span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`pb-3 text-xs sm:text-sm font-bold transition relative ${
              activeTab === 'verifications'
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Provider Verifications ({pendingVerifications} pending)
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 text-xs sm:text-sm font-bold transition relative ${
              activeTab === 'categories'
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Service Categories ({mockCategories.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 text-xs sm:text-sm font-bold transition relative ${
              activeTab === 'bookings'
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Global Bookings Audit ({bookings.length})
          </button>
        </div>

        {/* Tab 1: Provider Verification Queue */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-slate-500">
                Filter by credential approval status:
              </span>
              <div className="flex gap-2">
                {(['all', 'pending', 'verified'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold capitalize transition ${
                      statusFilter === filter
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredProviders.map((prov) => (
                <div
                  key={prov.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={prov.avatarUrl}
                      alt={prov.ownerName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{prov.businessName}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            prov.verificationStatus === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prov.verificationStatus === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prov.verificationStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {prov.ownerName} • {prov.city} • Category: {prov.primaryCategory}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Contact: {prov.phone} | {prov.email}
                      </p>
                    </div>
                  </div>

                  {/* Verification Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    {prov.verificationStatus !== 'verified' && (
                      <button
                        onClick={() => updateProviderVerification(prov.id, 'verified')}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve Verification</span>
                      </button>
                    )}

                    {prov.verificationStatus !== 'rejected' && (
                      <button
                        onClick={() => updateProviderVerification(prov.id, 'rejected')}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Application</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Service Categories */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-slate-400">{cat.id}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700">
                      Active
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
                  <span>Linked Providers: {cat.providerCount}</span>
                  <span className="text-blue-600 font-semibold">Editable</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Global Bookings Audit */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Platform Transaction Audit Log</h3>
              <span className="text-xs text-slate-400">Live PostgreSQL simulated stream</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">{b.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{b.customerName}</td>
                      <td className="py-3 px-4 text-slate-700">{b.providerName}</td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[150px]">{b.serviceTitle}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {b.bookingDate} ({b.timeSlot})
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            b.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-700'
                              : b.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : b.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">₹{b.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
