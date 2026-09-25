import React from 'react';
import { Star, MessageSquareQuote, ShieldCheck, ExternalLink } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const PatientReviewsSection: React.FC = () => {
  const { reviews, hospitalInfo } = useHospital();

  return (
    <section className="py-14 lg:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>Sourced Patient Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Experience & Feedback
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Selected excerpts faithfully referenced from Harsha Hospital’s public reviews directory on Justdial (Overall 4.3/5 based on 50 community ratings).
          </p>
        </div>

        {/* Rating Score Banner */}
        <div className="mb-10 max-w-xl mx-auto p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-around text-center">
          <div>
            <div className="text-3xl font-black text-slate-900">4.3</div>
            <div className="flex items-center justify-center gap-0.5 text-amber-500 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">Overall Rating</span>
          </div>

          <div className="h-10 w-px bg-slate-200" />

          <div>
            <div className="text-3xl font-black text-teal-700">50+</div>
            <span className="text-xs font-semibold text-slate-700 block mt-1">Ratings Count</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Hiriyur Patients</span>
          </div>

          <div className="h-10 w-px bg-slate-200" />

          <div>
            <div className="text-3xl font-black text-emerald-600">100%</div>
            <span className="text-xs font-semibold text-slate-700 block mt-1">Wheelchair Access</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Verified Entry</span>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {rev.date}
                  </span>
                </div>

                <div className="relative mb-4">
                  <MessageSquareQuote className="w-6 h-6 text-teal-100 absolute -top-2 -left-1 -z-10" />
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 block">{rev.author}</span>
                <span className="text-[11px] text-teal-700 font-medium flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  {rev.source}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Real listing note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            Reviews from Google / third-party listing. Harsha Hospital does not publish altered testimonials or unverified promotional ratings.
          </p>
        </div>
      </div>
    </section>
  );
};
