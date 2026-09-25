import React from 'react';
import {
  Building2,
  Accessibility,
  Clock,
  ShieldCheck,
  CheckCircle,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const AboutSection: React.FC = () => {
  const { hospitalInfo, setActivePage } = useHospital();

  return (
    <div className="py-12 lg:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Healthcare Facility in Hiriyur</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About Harsha Hospital
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
            Serving patients and families across Hiriyur and Chitradurga district with dedicated medical care, accessible facilities, and streamlined appointment scheduling.
          </p>
        </div>

        {/* Verified Copy Statement as mandated in brief */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Our Purpose & Patient Commitment
          </h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Harsha Hospital is a healthcare facility serving patients in Hiriyur, Chitradurga, Karnataka. Our website is designed to make it easier for patients to discover available healthcare services and manage appointments.
          </p>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Recognizing that walk-in patients frequently face uncertainty and waiting times during peak consultation hours, we have introduced a real-time slot scheduling portal. Patients can check when consulting doctors are on duty, reserve a confirmed consultation window, and receive an instant token number before arriving on-site.
          </p>
        </div>

        {/* Real Facility Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-4/3">
            <img
              src="https://images.openai.com/static-rsc-4/WxRGxZ1w0T1sbv_NHq41DgHtx_VCk37bYfskK22Fl1dOtabwU-dreHXBhfDFo_9ATFpW1T0t3YgpioBUida4d-8H5P-bOSO8PhM6XvKN2idh40g8HyBq-jnK_Nxwdv3MnK6be6x29ZnUBJN8tk5oahE6tvYkSSoKCc2zmGvVq8j25G-UGBaUAnPJYsoNJTtf?purpose=fullsize"
              alt="Harsha Hospital building premises on Main Road Hiriyur"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-4/3">
            <img
              src="https://images.openai.com/static-rsc-4/x_T6V_n-arpOkx3kOx8hmxJf0YlsKipPhDtpSud9DUWvDav_TTiHA3LcUwSsczNZwpx54F6BAdyHvQpmVnjAObjAI_tQ5iBhEOsDa8gAZyl1fNncoNOOw3gtU8k26na5z_phKy0BlBjaGg7vhvqPXNlQShP1R47zb08MfJnCVHtMtfnSC1OTuwdV2PFeFqdH?purpose=fullsize"
              alt="Harsha Hospital entrance corridor and reception"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Verified Facts & Community Accessibility */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Strategic Main Road Location</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Located directly behind Siri Residency on Main Road, Hiriyur, ensuring rapid transit access for local residents and surrounding villages.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <Accessibility className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Universal Accessibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verified wheelchair-accessible entrance and reserved parking designed to eliminate physical barriers for patients with reduced mobility.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Predictable Consultation Slots</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time slot engine prevents double booking and gives each patient a confirmed appointment time and queue token.
            </p>
          </div>
        </div>

        {/* Call to action banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-teal-800 to-sky-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Have a Health Consultation Need?</h3>
            <p className="text-xs sm:text-sm text-teal-100">
              Book your doctor appointment in advance to minimize waiting times.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('appointments')}
              className="px-5 py-2.5 rounded-xl bg-white text-teal-900 text-xs font-bold hover:bg-slate-100 transition-colors shadow-xs"
            >
              Book an Appointment
            </button>
            <a
              href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
              className="px-4 py-2.5 rounded-xl bg-teal-900/60 hover:bg-teal-900 border border-white/20 text-white text-xs font-semibold transition-colors"
            >
              Call {hospitalInfo.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
