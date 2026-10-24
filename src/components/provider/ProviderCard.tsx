import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { ProviderProfile } from '../../types';

interface ProviderCardProps {
  provider: ProviderProfile;
  onBookNow?: (provider: ProviderProfile) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onBookNow }) => {
  const lowestPrice = Math.min(...provider.services.map((s) => s.price));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Cover / Header banner */}
        <div className="relative h-32 bg-slate-100 overflow-hidden">
          {provider.coverImage ? (
            <img
              src={provider.coverImage}
              alt={provider.businessName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Verification Badge */}
          <div className="absolute top-3 right-3">
            {provider.verificationStatus === 'verified' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-sm shadow-sm">
                <CheckCircle className="w-3.5 h-3.5" /> Verified Pro
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-white backdrop-blur-sm shadow-sm">
                <Clock className="w-3.5 h-3.5" /> Pending Check
              </span>
            )}
          </div>

          {/* Primary category chip */}
          <div className="absolute bottom-2.5 left-4">
            <span className="text-xs font-medium text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-md">
              {provider.primaryCategory}
            </span>
          </div>
        </div>

        {/* Profile info section */}
        <div className="p-5 pt-3">
          <div className="flex items-start gap-3.5">
            <img
              src={provider.avatarUrl}
              alt={provider.ownerName}
              className="w-14 h-14 rounded-xl object-cover ring-4 ring-white shadow-md -mt-7 bg-white shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {provider.businessName}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{provider.address}, {provider.city}</span>
              </p>
            </div>
          </div>

          {/* Ratings & Experience Row */}
          <div className="mt-4 flex items-center justify-between text-xs py-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{provider.ratingAvg.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({provider.totalReviews} reviews)</span>
            </div>
            <div className="text-slate-600 font-medium">
              {provider.experienceYears} yrs experience
            </div>
          </div>

          {/* Bio Snippet */}
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {provider.bio}
          </p>

          {/* Services Offered list preview */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Popular Services
            </span>
            <div className="space-y-1.5">
              {provider.services.slice(0, 2).map((srv) => (
                <div key={srv.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 truncate max-w-[200px]">{srv.title}</span>
                  <span className="font-semibold text-slate-900">₹{srv.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 block">From</span>
            <span className="text-base font-extrabold text-blue-600">₹{lowestPrice}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/provider/${provider.id}`}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              Details
            </Link>
            <button
              onClick={() => onBookNow?.(provider)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition flex items-center gap-1"
            >
              <span>Book Slot</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
