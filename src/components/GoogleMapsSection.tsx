import React from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  ExternalLink,
  Car,
  Accessibility,
  Building,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const GoogleMapsSection: React.FC = () => {
  const { hospitalInfo } = useHospital();

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospitalInfo.coordinates.lat},${hospitalInfo.coordinates.lng}`;
  const googleMapsViewUrl = `https://www.google.com/maps/search/?api=1&query=${hospitalInfo.coordinates.lat},${hospitalInfo.coordinates.lng}`;

  // Interactive OpenStreetMap iframe centered exactly on Harsha Hospital Hiriyur (13.9376, 76.6216)
  const mapIframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=76.6080%2C13.9280%2C76.6350%2C13.9470&layer=mapnik&marker=13.9376%2C76.6216`;

  return (
    <section id="location-section" className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Verified Hospital Location</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Location & Directions
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Conveniently situated on Main Road behind Siri Residency in Hiriyur, Chitradurga district, Karnataka.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Driving Directions</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map Viewer */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 min-h-[380px] relative">
            <iframe
              title="Harsha Hospital Hiriyur Location Map"
              src={mapIframeSrc}
              className="w-full h-full min-h-[380px] border-0"
              loading="lazy"
            />
            {/* Map overlay badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-lg text-xs max-w-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
                Harsha Hospital, Hiriyur
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Main Road, Behind Siri Residency (13.9376° N, 76.6216° E)
              </p>
            </div>
          </div>

          {/* Location details card */}
          <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
                  Full Hospital Address
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Harsha Hospital
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Main Road, Behind Siri Residency,<br />
                  Hiriyur, Chitradurga District,<br />
                  Karnataka 577598, India
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Telephone Line</span>
                    <a
                      href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
                      className="text-teal-700 font-bold hover:underline"
                    >
                      {hospitalInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Operational Hours</span>
                    <span className="text-slate-600 text-[11px]">
                      {hospitalInfo.openingHoursText}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Accessibility className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Accessibility</span>
                    <span className="text-slate-600 text-[11px]">
                      Wheelchair ramp entrance & priority parking
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </a>

              <a
                href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-teal-600" />
                <span>Call Before Visiting</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
