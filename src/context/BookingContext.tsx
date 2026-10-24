import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, BookingStatus, ProviderProfile, ProviderService } from '../types';
import { mockBookings } from '../data/mockBookings';
import { mockProviders } from '../data/mockProviders';

interface BookingContextType {
  bookings: Booking[];
  providers: ProviderProfile[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => { success: boolean; message: string; booking?: Booking };
  updateBookingStatus: (bookingId: string, newStatus: BookingStatus) => void;
  isSlotAvailable: (providerId: string, date: string, timeSlot: string) => boolean;
  addReview: (bookingId: string, rating: number, comment: string) => void;
  getProviderById: (id: string) => ProviderProfile | undefined;
  updateProviderVerification: (providerId: string, status: 'verified' | 'rejected') => void;
  addProviderService: (providerId: string, service: Omit<ProviderService, 'id' | 'providerId' | 'isActive'>) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('localconnect_bookings');
    return saved ? JSON.parse(saved) : mockBookings;
  });

  const [providers, setProviders] = useState<ProviderProfile[]>(() => {
    const saved = localStorage.getItem('localconnect_providers');
    return saved ? JSON.parse(saved) : mockProviders;
  });

  useEffect(() => {
    localStorage.setItem('localconnect_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('localconnect_providers', JSON.stringify(providers));
  }, [providers]);

  // Check double-booking constraint: no overlapping active ('pending' or 'confirmed') bookings on same provider, date, & time slot
  const isSlotAvailable = (providerId: string, date: string, timeSlot: string): boolean => {
    const conflict = bookings.some(
      (b) =>
        b.providerId === providerId &&
        b.bookingDate === date &&
        b.timeSlot === timeSlot &&
        (b.status === 'pending' || b.status === 'confirmed')
    );
    return !conflict;
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    // Conflict Prevention Check
    const available = isSlotAvailable(bookingData.providerId, bookingData.bookingDate, bookingData.timeSlot);
    if (!available) {
      return {
        success: false,
        message: 'This time slot was just taken by another customer. Please choose a different slot.',
      };
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      hasReview: false,
    };

    setBookings((prev) => [newBooking, ...prev]);
    return {
      success: true,
      message: 'Booking request placed successfully! Awaiting provider confirmation.',
      booking: newBooking,
    };
  };

  const updateBookingStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const addReview = (bookingId: string, rating: number, comment: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      bookingId,
      customerId: targetBooking.customerId,
      customerName: targetBooking.customerName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    // Update booking hasReview flag
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, hasReview: true } : b))
    );

    // Update provider profile reviews and calculate average
    setProviders((prev) =>
      prev.map((prov) => {
        if (prov.id === targetBooking.providerId) {
          const updatedReviews = [newReview, ...prov.reviews];
          const avg =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...prov,
            reviews: updatedReviews,
            ratingAvg: Number(avg.toFixed(2)),
            totalReviews: updatedReviews.length,
          };
        }
        return prov;
      })
    );
  };

  const getProviderById = (id: string) => {
    return providers.find((p) => p.id === id);
  };

  const updateProviderVerification = (providerId: string, status: 'verified' | 'rejected') => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, verificationStatus: status } : p))
    );
  };

  const addProviderService = (
    providerId: string,
    serviceData: Omit<ProviderService, 'id' | 'providerId' | 'isActive'>
  ) => {
    const newService: ProviderService = {
      ...serviceData,
      id: `srv-${Date.now()}`,
      providerId,
      isActive: true,
    };

    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, services: [...p.services, newService] } : p
      )
    );
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        providers,
        createBooking,
        updateBookingStatus,
        isSlotAvailable,
        addReview,
        getProviderById,
        updateProviderVerification,
        addProviderService,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
