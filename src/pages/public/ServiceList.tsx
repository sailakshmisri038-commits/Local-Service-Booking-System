import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Filter,
  Star,
  SlidersHorizontal,
  X,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { mockCategories } from '../../data/mockCategories';
import { useBooking } from '../../context/BookingContext';
import { ProviderCard } from '../../components/provider/ProviderCard';
import { BookingModal } from '../../components/booking/BookingModal';
import { ProviderProfile } from '../../types';

export const ServiceList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { providers } = useBooking();

  const initialCategory = searchParams.get('category') || '';
  const initialCity = searchParams.get('city') || '';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating_desc' | 'price_asc' | 'price_desc'>('rating_desc');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<ProviderProfile | null>(null);

  // Filter logic
  const filteredProviders = useMemo(() => {
    return providers
      .filter((provider) => {
        // City match
        if (selectedCity && provider.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }

        // Category match
        if (selectedCategory) {
          const categoryObj = mockCategories.find((c) => c.id === selectedCategory);
          if (categoryObj && !provider.primaryCategory.toLowerCase().includes(categoryObj.name.toLowerCase().split(' ')[0])) {
            // Also check if any service in provider matches this category ID
            const hasServiceInCat = provider.services.some((s) => s.categoryId === selectedCategory);
            if (!hasServiceInCat) return false;
          }
        }

        // Rating match
        if (minRating > 0 && provider.ratingAvg < minRating) {
          return false;
        }

        // Search text match (checks business name, owner name, service titles, and bio)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = provider.businessName.toLowerCase().includes(query);
          const matchesOwner = provider.ownerName.toLowerCase().includes(query);
          const matchesBio = provider.bio.toLowerCase().includes(query);
          const matchesServices = provider.services.some(
            (s) => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)
          );
          if (!matchesName && !matchesOwner && !matchesBio && !matchesServices) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating_desc') {
          return b.ratingAvg - a.ratingAvg;
        }
        if (sortBy === 'price_asc') {
          const minA = Math.min(...a.services.map((s) => s.price));
          const minB = Math.min(...b.services.map((s) => s.price));
          return minA - minB;
        }
        if (sortBy === 'price_desc') {
          const maxA = Math.max(...a.services.map((s) => s.price));
          const maxB = Math.max(...b.services.map((s) => s.price));
          return maxB - maxA;
        }
        return 0;
      });
  }, [providers, selectedCity, selectedCategory, minRating, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setMinRating(0);
    setSortBy('rating_desc');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Local Service Specialists
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {filteredProviders.length} verified technician businesses available in your area.
          </p>
        </div>

        {/* Top Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by specialty, service title (e.g. pipe, geyser, wiring)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-1/2 md:w-44">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                <option value="">All Cities</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <div className="relative w-1/2 md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                <option value="rating_desc">Sort: Highest Rated</option>
                <option value="price_asc">Sort: Price (Low to High)</option>
                <option value="price_desc">Sort: Price (High to Low)</option>
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Layout with Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 h-fit sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                Filter Catalog
              </span>
              {(selectedCategory || selectedCity || minRating > 0 || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-rose-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-2.5">Category</span>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition ${
                    selectedCategory === ''
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {mockCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition truncate ${
                      selectedCategory === c.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block mb-2.5">
                Minimum Customer Rating
              </span>
              <div className="space-y-1.5">
                {[
                  { label: 'Any Rating', val: 0 },
                  { label: '4.8 Stars & Above', val: 4.8 },
                  { label: '4.5 Stars & Above', val: 4.5 },
                  { label: '4.0 Stars & Above', val: 4.0 },
                ].map((item) => (
                  <label
                    key={item.val}
                    className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === item.val}
                      onChange={() => setMinRating(item.val)}
                      className="text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="flex items-center gap-1">
                      {item.val > 0 && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Provider Grid Area */}
          <div className="col-span-1 md:col-span-3">
            {filteredProviders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  No service providers match your search
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try broadening your search keywords, switching cities, or resetting your filter criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onBookNow={(p) => setSelectedProviderForBooking(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!selectedProviderForBooking}
        onClose={() => setSelectedProviderForBooking(null)}
        provider={selectedProviderForBooking}
      />
    </div>
  );
};
