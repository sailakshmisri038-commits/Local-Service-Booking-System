import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  Plus,
  MapPin,
  Check,
  AlertCircle,
  ShieldCheck,
  Trash2,
  Wrench,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { mockCategories } from '../../data/mockCategories';

export const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bookings, updateBookingStatus, providers, addProviderService } = useBooking();

  // Find the active provider record (default to prov-1 Rajesh Kumar)
  const currentProvider = providers.find((p) => p.id === 'prov-1') || providers[0];

  const [activeTab, setActiveTab] = useState<'requests' | 'services' | 'schedule'>('requests');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  // New service form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState<number>(499);
  const [newDuration, setNewDuration] = useState<number>(60);
  const [newCategory, setNewCategory] = useState(mockCategories[0].id);

  // Filter bookings for this provider
  const providerBookings = bookings.filter((b) => b.providerId === currentProvider.id);

  const pendingBookings = providerBookings.filter((b) => b.status === 'pending');
  const confirmedBookings = providerBookings.filter((b) => b.status === 'confirmed');
  const completedBookings = providerBookings.filter((b) => b.status === 'completed');

  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addProviderService(currentProvider.id, {
      categoryId: newCategory,
      title: newTitle,
      description: newDesc,
      price: Number(newPrice),
      durationMinutes: Number(newDuration),
    });

    setShowAddServiceModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewPrice(499);
    setNewDuration(60);
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Provider Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentProvider.avatarUrl}
              alt={currentProvider.businessName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                  Service Provider Console
                </span>
                {currentProvider.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle className="w-3 h-3" /> Verified Business
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" /> Verification Pending
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {currentProvider.businessName}
              </h1>
              <p className="text-xs text-slate-500">
                Primary Category: {currentProvider.primaryCategory} • Location: {currentProvider.city}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddServiceModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Pending Requests
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">
                {pendingBookings.length}
              </span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Confirmed Jobs
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-blue-600">
                {confirmedBookings.length}
              </span>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Completed Jobs
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-600">
                {completedBookings.length}
              </span>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Settled Revenue
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                ₹{totalEarnings}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                +100% payout
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 text-xs sm:text-sm font-bold transition relative ${
              activeTab === 'requests'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Appointments & Requests ({providerBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3 text-xs sm:text-sm font-bold transition relative ${
              activeTab === 'services'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Manage Services ({currentProvider.services.length})
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 text-xs sm:text-sm font-bold transition relative ${
              activeTab === 'schedule'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Weekly Schedule & Slots
          </button>
        </div>

        {/* Tab 1: Requests & Bookings */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {providerBookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
                <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No customer booking requests yet</h3>
                <p className="text-xs text-slate-500">
                  When customers book appointments for your services, they will appear here in real time.
                </p>
              </div>
            ) : (
              providerBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {b.id}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            b.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-700'
                              : b.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : b.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{b.serviceTitle}</h3>
                      <p className="text-xs text-slate-600">
                        Client: <strong className="text-slate-800">{b.customerName}</strong> ({b.customerPhone})
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 block">Service Fee</span>
                      <span className="text-xl font-extrabold text-indigo-600">
                        ₹{b.totalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                    <div>
                      <span className="block font-semibold text-slate-800">Date</span>
                      <span>{b.bookingDate}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-800">Time Window</span>
                      <span>{b.timeSlot}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-800">Customer Location</span>
                      <span className="line-clamp-2">{b.customerAddress}</span>
                    </div>
                  </div>

                  {b.notes && (
                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 mb-3">
                      <span className="font-semibold text-slate-700">Customer Note: </span>
                      {b.notes}
                    </div>
                  )}

                  {/* Provider Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'rejected')}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                      </>
                    )}

                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(b.id, 'completed')}
                        className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Service Completed</span>
                      </button>
                    )}

                    {b.status === 'completed' && (
                      <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Fulfilled Successfully
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Manage Services */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Active Service Catalog</h3>
                <p className="text-xs text-slate-500">
                  Customers can book slots for these services directly on your profile.
                </p>
              </div>
              <button
                onClick={() => setShowAddServiceModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs"
              >
                + Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentProvider.services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{srv.title}</h4>
                      <span className="text-base font-extrabold text-indigo-600 shrink-0">
                        ₹{srv.price}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {srv.durationMinutes} minutes
                    </span>
                    <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Weekly Schedule */}
        {activeTab === 'schedule' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-900">Configured Operating Schedule</h3>
              <p className="text-xs text-slate-500">
                These working hours are divided into 60-minute appointment slots for customer booking.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {currentProvider.availability.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="font-bold text-slate-800">
                    {dayNames[item.dayOfWeek]}
                  </div>
                  <div className="font-mono text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                    {item.startTime} - {item.endTime} (60 min blocks)
                  </div>
                  <span className="text-emerald-600 font-semibold">Accepting Bookings</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Service to Catalog</h3>

            <form onSubmit={handleAddServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. RO Water Purifier Filter Replacement"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {mockCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & What's Included
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Briefly describe the scope of work..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Standard Price (₹)
                  </label>
                  <input
                    type="number"
                    min="99"
                    step="50"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
