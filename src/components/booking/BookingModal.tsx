import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  User,
  Phone,
} from 'lucide-react';
import { ProviderProfile, ProviderService } from '../../types';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderProfile | null;
  initialServiceId?: string;
  onSuccess?: () => void;
}

const DEFAULT_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:30 AM - 11:30 AM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:30 PM - 04:30 PM',
  '05:00 PM - 06:00 PM',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  provider,
  initialServiceId,
  onSuccess,
}) => {
  const { createBooking, isSlotAvailable } = useBooking();
  const { user } = useAuth();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default initial date to tomorrow
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setSelectedDate(`${yyyy}-${mm}-${dd}`);

      if (initialServiceId) {
        setSelectedServiceId(initialServiceId);
      } else if (provider?.services && provider.services.length > 0) {
        setSelectedServiceId(provider.services[0].id);
      }

      if (user) {
        setCustomerName(user.fullName);
        setCustomerPhone(user.phone || '+91 98765 00000');
        setCustomerAddress('Flat 301, Lakeview Residency, Main Road');
      }

      setSelectedSlot('');
      setStatusMessage(null);
    }
  }, [isOpen, provider, initialServiceId, user]);

  if (!isOpen || !provider) return null;

  const currentService = provider.services.find((s) => s.id === selectedServiceId) || provider.services[0];

  // Generate next 7 selectable dates
  const nextDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i + 1));
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    return { dateStr, dayName, dayNum: d.getDate(), monthName };
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!selectedSlot) {
      setStatusMessage({ type: 'error', text: 'Please choose an available appointment time slot.' });
      return;
    }

    if (!customerAddress.trim()) {
      setStatusMessage({ type: 'error', text: 'Please specify the service address where technician should visit.' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = createBooking({
        customerId: user?.id || 'cust-anon',
        customerName: customerName || 'Valued Customer',
        customerEmail: user?.email || 'customer@example.com',
        customerPhone: customerPhone || '+91 98765 43210',
        providerId: provider.id,
        providerName: provider.businessName,
        serviceId: currentService.id,
        serviceTitle: currentService.title,
        bookingDate: selectedDate,
        timeSlot: selectedSlot,
        totalPrice: currentService.price,
        customerAddress,
        notes,
      });

      setIsSubmitting(false);

      if (result.success) {
        setStatusMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 1500);
      } else {
        setStatusMessage({ type: 'error', text: result.message });
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Book an Appointment</h2>
            <p className="text-xs text-blue-100 mt-0.5">
              with {provider.businessName} • {provider.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                statusMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span className="font-medium">{statusMessage.text}</span>
            </div>
          )}

          {/* Service Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Select Service Package
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {provider.services.map((srv) => {
                const isSelected = srv.id === selectedServiceId;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {srv.title}
                      </h4>
                      <span className="text-xs font-extrabold text-blue-600 shrink-0">
                        ₹{srv.price}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{srv.durationMinutes} mins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date Picker (Horizontal Carousel) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Select Appointment Date
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {nextDates.map((item) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => {
                      setSelectedDate(item.dateStr);
                      setSelectedSlot(''); // Reset slot on date change
                    }}
                    className={`flex-shrink-0 w-20 py-2.5 px-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold">{item.dayName}</span>
                    <span className="text-base font-extrabold">{item.dayNum}</span>
                    <span className="text-[10px]">{item.monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Picker with Conflict Detection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Choose Available Time Slot
              </label>
              <span className="text-[11px] text-slate-400">
                Real-time conflict prevention active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_SLOTS.map((slot) => {
                const available = isSlotAvailable(provider.id, selectedDate, slot);
                const isSelected = selectedSlot === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={!available}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 px-3 text-xs rounded-xl border font-medium text-center transition relative ${
                      !available
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                        : isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 font-bold'
                        : 'border-slate-200 bg-white hover:border-blue-300 text-slate-700'
                    }`}
                  >
                    {slot}
                    {!available && (
                      <span className="block text-[9px] no-underline font-normal text-rose-500 mt-0.5">
                        Booked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Address & Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Service Address (House/Flat No., Street, Landmark)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Green Glen Layout, Bellandur, Bengaluru"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Notes or Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Leak is near kitchen sink under the counter."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Total & Action Bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Total Payable after Service:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-blue-600">
                  ₹{currentService ? currentService.price : 0}
                </span>
                <span className="text-xs text-slate-400 font-medium">(No prepayment needed)</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
