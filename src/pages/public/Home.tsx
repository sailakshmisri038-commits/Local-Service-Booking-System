import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShieldCheck,
  Clock,
  Sparkles,
  Star,
  CheckCircle2,
  Wrench,
  Zap,
  Cpu,
  Hammer,
  Paintbrush,
  ShieldAlert,
  Camera,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { mockCategories } from '../../data/mockCategories';
import { useBooking } from '../../context/BookingContext';
import { ProviderCard } from '../../components/provider/ProviderCard';
import { BookingModal } from '../../components/booking/BookingModal';
import { ProviderProfile } from '../../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { providers } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<ProviderProfile | null>(null);

  // Icon mapping helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-blue-600" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-emerald-500" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-cyan-600" />;
      case 'Hammer':
        return <Hammer className="w-6 h-6 text-orange-600" />;
      case 'Paintbrush':
        return <Paintbrush className="w-6 h-6 text-purple-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-rose-500" />;
      case 'Camera':
        return <Camera className="w-6 h-6 text-slate-700" />;
      default:
        return <Wrench className="w-6 h-6 text-blue-600" />;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedCity) params.append('city', selectedCity);
    navigate(`/services?${params.toString()}`);
  };

  // Filter top verified & featured providers
  const featuredProviders = providers.filter((p) => p.featured || p.ratingAvg >= 4.8);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200/60 overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-10 -mt-12 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -mb-12 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Reliable, Certified & On-Demand Local Services</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Book Trusted Local Experts in Minutes.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Find top-rated plumbers, electricians, deep cleaners, and appliance technicians near you.
              No endless phone calls. Transparent pricing and guaranteed time slots.
            </p>

            {/* Quick Search & Location Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 p-2.5 sm:p-3 bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200 flex flex-col sm:flex-row items-center gap-2.5"
            >
              {/* Location Select */}
              <div className="w-full sm:w-1/3 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs font-medium text-slate-700 bg-transparent focus:outline-none"
                >
                  <option value="">All Locations / Cities</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              {/* Keyword Search */}
              <div className="w-full sm:flex-1 flex items-center gap-2 px-3 py-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service do you need? (e.g. tap leak, AC jet wash)"
                  className="w-full text-xs font-medium text-slate-700 bg-transparent placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 shrink-0"
              >
                <span>Find Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Trust Pill Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Verified Technicians
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Zero Double-Booking Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                4.8+ Average Rating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Popular Categories
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Our Service Offerings
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>Browse all categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {mockCategories.map((category) => (
            <Link
              key={category.id}
              to={`/services?category=${category.id}`}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 mb-4">
                  {getCategoryIcon(category.iconName)}
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{category.providerCount} Active Pros</span>
                <span className="font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  View &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Service Providers Section */}
      <section className="py-16 bg-slate-100/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                Highest Rated & Verified
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Local Service Providers
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span>See all technicians</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onBookNow={(p) => setSelectedProviderForBooking(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Simple & Transparent
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            How LocalConnect Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Connecting neighborhood customers with verified service specialists seamlessly in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center relative shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Find & Compare</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Search by service or location. Read transparent customer reviews, verify licenses, and review upfront pricing before making a decision.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center relative shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Reserve a Slot</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pick your preferred date and time slot from the provider's live calendar. Our system blocks out conflicting bookings automatically.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center relative shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Service & Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The verified provider visits your doorstep and completes the task. Pay only upon satisfaction and leave your honest review for the community.
            </p>
          </div>
        </div>

        {/* Provider CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold">
              Grow Your Local Business
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Are you a local service technician or contractor?
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Join LocalConnect today to receive direct service booking requests in your city, manage your team schedule, and build your digital reputation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/provider"
              className="px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition"
            >
              Provider Portal Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Global Booking Modal */}
      <BookingModal
        isOpen={!!selectedProviderForBooking}
        onClose={() => setSelectedProviderForBooking(null)}
        provider={selectedProviderForBooking}
        onSuccess={() => {
          navigate('/customer');
        }}
      />
    </div>
  );
};
