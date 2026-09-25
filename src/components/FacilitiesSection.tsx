import React from 'react';
import {
  Accessibility,
  Car,
  Stethoscope,
  Users,
  Bed,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building,
  HeartHandshake,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const FacilitiesSection: React.FC = () => {
  const { facilities, hospitalInfo } = useHospital();

  const getFacilityIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'accessibility':
        return <Accessibility className="w-6 h-6 text-teal-600" />;
      case 'car':
        return <Car className="w-6 h-6 text-teal-600" />;
      case 'stethoscope':
        return <Stethoscope className="w-6 h-6 text-teal-600" />;
      case 'users':
        return <Users className="w-6 h-6 text-teal-600" />;
      case 'bed':
        return <Bed className="w-6 h-6 text-teal-600" />;
      case 'clock':
        return <Clock className="w-6 h-6 text-teal-600" />;
      default:
        return <Building className="w-6 h-6 text-teal-600" />;
    }
  };

  return (
    <section id="facilities-section" className="py-14 lg:py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-semibold mb-3">
            <Accessibility className="w-3.5 h-3.5 text-teal-700" />
            <span>Patient Accessibility & Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hospital Facilities & Accessibility
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Harsha Hospital is engineered for inclusive access, patient comfort, and smooth outpatient navigation on Main Road, Hiriyur.
          </p>
        </div>

        {/* Highlight Verified Accessibility */}
        <div className="mb-10 bg-gradient-to-r from-teal-800 to-sky-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-300 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                Verified Listing Amenity
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                100% Wheelchair-Accessible Entrance & Dedicated Parking
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Patients with reduced mobility or visiting on wheelchairs have seamless step-free entry directly from the hospital main gate on Main Road, Hiriyur, along with reserved vehicle drop-off parking.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/20">
              <Accessibility className="w-10 h-10 text-teal-300" />
              <div>
                <span className="text-xs font-bold block text-white">Full Accessibility</span>
                <span className="text-[11px] text-teal-200">Ramp + Wide Corridors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-teal-300/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                    {getFacilityIcon(fac.iconName)}
                  </div>
                  {fac.verified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Facility
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600">
                      Admin Configured
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">{fac.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="capitalize">{fac.category} category</span>
                <span className="text-teal-700 font-medium">Harsha Hospital, Hiriyur</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
