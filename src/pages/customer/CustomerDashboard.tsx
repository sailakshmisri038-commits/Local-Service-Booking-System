import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Star,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Phone,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Booking, BookingStatus } from '../../types';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bookings, updateBookingStatus, addReview } = useBooking();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // Filter bookings for this customer
  const myBookings = bookings.filter(
    (b) => b.customerId === user?.id || user?.role === 'customer'
  );

  const upcomingBookings = myBookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed'
  );

  const historyBookings = myBookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected'
  );

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      updateBookingStatus(bookingId, 'cancelled');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalBooking) return;
    addReview(reviewModalBooking.id, rating, reviewComment);
    setReviewModalBooking(null);
    setReviewComment('');
    setRating(5);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
            <Clock className="w-3.5 h-3.5" /> Awaiting Provider
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Service Completed
          </span>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
            <XCircle className="w-3.5 h-3.5" /> {status === 'cancelled' ? 'Cancelled' : 'Declined'}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt={user?.fullName || 'User'}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold mb-1">
                <User className="w-3 h-3" /> Customer Account
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Welcome back, {user?.fullName || 'Customer'}!
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your appointments, track service status, and leave provider reviews.
              </p>
            </div>
          </div>

          <Link
            to="/services"
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <span>Book New Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 text-xs sm:text-sm font-bold transition relative ${
              activeTab === 'upcoming'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Upcoming & In-Progress ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-xs sm:text-sm font-bold transition relative ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Completed & History ({historyBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {activeTab === 'upcoming' && upcomingBookings.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No active bookings right now</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Need help with a leak, electrical issue, or house cleaning? Book a local pro now.
              </p>
              <Link
                to="/services"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white"
              >
                Browse Available Services
              </Link>
            </div>
          )}

          {activeTab === 'history' && historyBookings.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No past bookings found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Completed jobs will appear here where you can review your technician.
              </p>
            </div>
          )}

          {(activeTab === 'upcoming' ? upcomingBookings : historyBookings).map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      ID: {booking.id}
                    </span>
                    {getStatusBadge(booking.status)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {booking.serviceTitle}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Provider: <strong className="text-slate-800">{booking.providerName}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Total Amount</span>
                  <span className="text-xl font-extrabold text-blue-600">
                    ₹{booking.totalPrice}
                  </span>
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-800">Date</span>
                    <span>{booking.bookingDate}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-800">Time Slot</span>
                    <span>{booking.timeSlot}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-800">Service Location</span>
                    <span className="line-clamp-2">{booking.customerAddress}</span>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 mb-3">
                  <span className="font-semibold text-slate-700">Special Notes: </span>
                  {booking.notes}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400">
                  Booked on {new Date(booking.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2">
                  {/* Cancel Button */}
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                    >
                      Cancel Appointment
                    </button>
                  )}

                  {/* Leave Review Button */}
                  {booking.status === 'completed' && !booking.hasReview && (
                    <button
                      onClick={() => setReviewModalBooking(booking)}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Write Review</span>
                    </button>
                  )}

                  {booking.status === 'completed' && booking.hasReview && (
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Review Submitted
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Review {reviewModalBooking.providerName}
            </h3>
            <p className="text-xs text-slate-500">
              How was your experience with "{reviewModalBooking.serviceTitle}"?
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400 scale-110'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Feedback
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about technician punctuality, work quality, cleanliness..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalBooking(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
