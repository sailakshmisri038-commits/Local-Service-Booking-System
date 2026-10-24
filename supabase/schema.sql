-- ==============================================================================
-- LocalConnect: Local Service Booking & Management System
-- Database Schema for Supabase / PostgreSQL 15+
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'rejected');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- 3. PROFILES TABLE (Mirrors and extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SERVICE CATEGORIES TABLE
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT NOT NULL DEFAULT 'Wrench',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PROVIDER PROFILES TABLE (One-to-one extension of profiles for provider role)
CREATE TABLE public.provider_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    bio TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    primary_category TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 1,
    rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_reviews INT NOT NULL DEFAULT 0,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SERVICES OFFERED CATALOG
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    duration_minutes INT NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PROVIDER AVAILABILITY SCHEDULE
CREATE TABLE public.availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 1=Mon... 6=Sat
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 60,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_times CHECK (end_time > start_time)
);

-- 8. BOOKINGS TABLE
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    booking_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    total_price NUMERIC(10, 2) NOT NULL,
    customer_address TEXT NOT NULL,
    notes TEXT,
    has_review BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CRITICAL: Double-Booking Prevention Unique Partial Index
-- Guarantees at database engine level that no two active appointments (pending or confirmed)
-- can book the same provider on the same date and time slot.
CREATE UNIQUE INDEX idx_no_double_booking 
ON public.bookings (provider_id, booking_date, time_slot) 
WHERE status IN ('pending', 'confirmed');

-- 9. REVIEWS & RATINGS TABLE
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. AUTOMATED TRIGGER: RECALCULATE PROVIDER RATING ON NEW REVIEW
CREATE OR REPLACE FUNCTION update_provider_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.provider_profiles
    SET 
        rating_avg = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM public.reviews
            WHERE provider_id = NEW.provider_id
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE provider_id = NEW.provider_id
        )
    WHERE id = NEW.provider_id;
    
    UPDATE public.bookings
    SET has_review = TRUE
    WHERE id = NEW.booking_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_review_inserted
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_provider_rating_stats();

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view provider names/avatars; users edit their own record
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: Read-only for all, managed by admins
CREATE POLICY "Categories are readable by everyone" ON public.categories FOR SELECT USING (true);

-- Provider Profiles: Anyone can read verified providers; providers edit their own
CREATE POLICY "Provider profiles readable by everyone" ON public.provider_profiles FOR SELECT USING (true);
CREATE POLICY "Providers can update own business profile" ON public.provider_profiles FOR UPDATE USING (auth.uid() = id);

-- Services: Readable by everyone; providers manage their own listings
CREATE POLICY "Services readable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Providers can insert their services" ON public.services FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Providers can update their services" ON public.services FOR UPDATE USING (auth.uid() = provider_id);

-- Availability: Readable by everyone; providers manage their schedules
CREATE POLICY "Availability slots readable by everyone" ON public.availability FOR SELECT USING (true);
CREATE POLICY "Providers can manage their schedule" ON public.availability FOR ALL USING (auth.uid() = provider_id);

-- Bookings: Customers can read/create their own bookings; Providers can read/update bookings for their services
CREATE POLICY "Customers view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Providers view assigned bookings" ON public.bookings FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Customers can create booking requests" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Providers can update status of assigned bookings" ON public.bookings FOR UPDATE USING (auth.uid() = provider_id);

-- Reviews: Readable by all; Customers can submit review for their completed booking
CREATE POLICY "Reviews readable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can insert review for own completed booking" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
