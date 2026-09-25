import React from 'react';
import {
  Calendar,
  Phone,
  MapPin,
  Accessibility,
  CheckCircle2,
  Clock,
  Star,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const Hero: React.FC = () => {
  const { hospitalInfo, setActivePage } = useHospital();

  const handleBookClick = () => {
    const bookingWidget = document.getElementById('quick-booking-section');
    if (bookingWidget) {
      bookingWidget.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActivePage('appointments');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-slate-50 to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/60">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Verified Location & Rating Pill */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                Hiriyur, Chitradurga
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                4.3/5 ({hospitalInfo.reviewCount} verified reviews)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-teal-700 font-medium">Main Road facility</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                {hospitalInfo.heroHeadline}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                {hospitalInfo.heroSubheadline}
              </p>
            </div>

            {/* Notice about waiting queues reduction */}
            {hospitalInfo.noticeBanner && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/90 border border-teal-200/80 text-teal-900 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p>
                  <strong className="font-semibold text-teal-950">Reduce Waiting Times: </strong>
                  {hospitalInfo.noticeBanner}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={handleBookClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base shadow-sm shadow-teal-600/30 hover:shadow-teal-600/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <a
                href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-300 shadow-xs hover:border-slate-400 transition-all"
              >
                <Phone className="w-5 h-5 text-teal-600" />
                <span>Call Harsha Hospital</span>
              </a>
            </div>

            {/* Trust Cards Grid */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-teal-700 font-semibold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Hospital</span>
                </div>
                <div className="text-xs text-slate-600">Registered Facility in Hiriyur</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-teal-700 font-semibold text-xs mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Hiriyur</span>
                </div>
                <div className="text-xs text-slate-600">Chitradurga, Karnataka</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-teal-700 font-semibold text-xs mb-1">
                  <Accessibility className="w-4 h-4" />
                  <span>Wheelchair Access</span>
                </div>
                <div className="text-xs text-slate-600">Ramp & Priority Parking</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-1.5 text-teal-700 font-semibold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Online Booking</span>
                </div>
                <div className="text-xs text-slate-600">Real-time Slot Confirmation</div>
              </div>
            </div>
          </div>

          {/* Right Column: Real Exterior Photograph & Verified Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Photo frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-4/3 sm:aspect-16/11 group">
                <img
                  src="https://images.openai.com/static-rsc-4/mqLSJII4ia7TKjSyJPqUokzaZlbnIEy1Bh4dnE-yGsvyoS3avBhUyaXOed72VGGovh6RddWC_EMr86tNwV2Q3peY1q-8NQ5ioSm-VpXGuLyczwrQmvs9k0D-9ObYLNm33W4k4OlHK4zQdbGUagUaI6lAsh75IcjktjgE-cD02iGuT6QPTKQexTq8sHheitRo?purpose=fullsize"
                  alt="Harsha Hospital main exterior building on Main Road behind Siri Residency, Hiriyur"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="eager"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Photo Caption Badge */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold drop-shadow-sm">Harsha Hospital Building</span>
                    <span className="bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-teal-300 font-medium">
                      Hiriyur, Karnataka
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-200 drop-shadow-xs mt-0.5">
                    Main Road, Behind Siri Residency (Photo from verified listing)
                  </p>
                </div>
              </div>

              {/* Floating verified badge */}
              <div className="absolute -bottom-5 -left-4 sm:left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200/90 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                  4.3★
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Patient-Rated Care</div>
                  <div className="text-[11px] text-slate-500">50 Ratings on Justdial Listing</div>
                </div>
              </div>

              {/* Floating 24/7 hours pill */}
              <div className="absolute -top-3 -right-2 bg-slate-900 text-white rounded-lg px-3 py-1.5 shadow-md flex items-center gap-1.5 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mon–Sat 24 Hours Facility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
