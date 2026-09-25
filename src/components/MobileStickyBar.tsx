import React from 'react';
import { Phone, Navigation, Calendar } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const MobileStickyBar: React.FC = () => {
  const { hospitalInfo, setActivePage } = useHospital();

  const handleBookClick = () => {
    setActivePage('appointments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-2 px-3">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        <a
          href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
        >
          <Phone className="w-4 h-4 text-teal-600 mb-0.5" />
          <span className="text-[11px] font-bold">Call Now</span>
        </a>

        <a
          href={hospitalInfo.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
        >
          <Navigation className="w-4 h-4 text-sky-600 mb-0.5" />
          <span className="text-[11px] font-bold">Directions</span>
        </a>

        <button
          onClick={handleBookClick}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs transition-colors"
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="text-[11px]">Book Slot</span>
        </button>
      </div>
    </div>
  );
};
