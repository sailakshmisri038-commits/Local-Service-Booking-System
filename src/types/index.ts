export type UserRole = 'customer' | 'provider' | 'admin';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  providerCount?: number;
  isActive: boolean;
}

export interface ProviderService {
  id: string;
  providerId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface AvailabilitySlot {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "17:00"
  slotDurationMinutes: number; // e.g. 60
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  coverImage?: string;
  bio: string;
  address: string;
  city: string;
  ratingAvg: number;
  totalReviews: number;
  experienceYears: number;
  verificationStatus: VerificationStatus;
  primaryCategory: string;
  services: ProviderService[];
  availability: AvailabilitySlot[];
  reviews: Review[];
  featured?: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceTitle: string;
  bookingDate: string; // YYYY-MM-DD
  timeSlot: string;    // e.g. "10:00 AM - 11:00 AM"
  status: BookingStatus;
  totalPrice: number;
  customerAddress: string;
  notes?: string;
  createdAt: string;
  hasReview?: boolean;
}

export interface FilterState {
  searchQuery: string;
  categoryId: string;
  city: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy: 'rating_desc' | 'price_asc' | 'price_desc' | 'popular';
}
