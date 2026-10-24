import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Shield,
  ArrowLeft,
  Calendar,
  Wrench,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { BookingModal } from '../../components/booking/BookingModal';

export const ProviderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProviderById } = useBooking();
  const provider = getProviderById(id || '');

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-slate-800">Provider Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested service provider could not be found or may have been unlisted.
        </p>
        <Link
          to="/services"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white"
        >
          Back to Service Directory
        </Link>
      </div>
    );
  }

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Technicians</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
          <div className="h-48 sm:h-64 relative">
            {provider.coverImage ? (
              <img
                src={provider.coverImage}
                alt={provider.businessName}
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-700 to-indigo-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          {/* Banner Floating Card */}
          <div className="p-6 sm:p-8 relative -mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <img
                src={provider.avatarUrl}
                alt={provider.ownerName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-xl bg-white"
              />
              <div className="space-y-1.5 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {provider.businessName}
                  </h1>
                  {provider.verificationStatus === 'verified' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-xs">
                      <CheckCircle className="w-3 h-3" /> Verified Pro
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300">
                  Owned & operated by <strong className="text-white">{provider.ownerName}</strong> • {provider.experienceYears} Years in Service
                </p>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{provider.address}, {provider.city}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedServiceId('');
                  setBookingModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/30 transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Services & About) */}
        <div className="lg:col-span-2 space-y-8">
          {/* About section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>About the Business</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {provider.bio}
            </p>
          </div>

          {/* Service Offerings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>Service Packages & Upfront Rates</span>
              </h2>
              <span className="text-xs text-slate-400">
                {provider.services.length} services available
              </span>
            </div>

            <div className="space-y-4">
              {provider.services.map((service) => (
                <div
                  key={service.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-lg">
                    <h3 className="text-sm font-bold text-slate-900">{service.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Estimated Duration: {service.durationMinutes} mins</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-lg font-black text-blue-600">
                      ₹{service.price}
                    </div>
                    <button
                      onClick={() => handleBookService(service.id)}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Verified Customer Reviews</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real feedback from completed appointments on LocalConnect
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 font-extrabold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{provider.ratingAvg.toFixed(1)}</span>
                <span className="text-xs text-amber-700 font-normal">
                  ({provider.totalReviews})
                </span>
              </div>
            </div>

            {provider.reviews.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No reviews yet for this provider. Be the first customer to book and rate!
              </div>
            ) : (
              <div className="space-y-4">
                {provider.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {rev.customerAvatar ? (
                          <img
                            src={rev.customerAvatar}
                            alt={rev.customerName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                            {rev.customerName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-slate-900">{rev.customerName}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (Availability Schedule & Contact Info) */}
        <div className="space-y-6">
          {/* Working Hours */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Standard Operating Hours</span>
            </h3>

            <div className="space-y-2 text-xs">
              {provider.availability.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-b-0"
                >
                  <span className="font-semibold text-slate-700">
                    {dayNames[slot.dayOfWeek]}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Verification badge */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Verification Details</span>
            </h3>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Identity & Skill Check Approved</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Verified through LocalConnect Admin Onboarding protocol.
              </p>
            </div>

            <div className="pt-2 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{provider.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{provider.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        provider={provider}
        initialServiceId={selectedServiceId}
      />
    </div>
  );
};
