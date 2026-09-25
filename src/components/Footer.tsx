import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Accessibility,
  Activity,
  HeartPulse,
  ExternalLink,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const Footer: React.FC = () => {
  const { hospitalInfo, setActivePage } = useHospital();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospitalInfo.coordinates.lat},${hospitalInfo.coordinates.lng}`;

  const handleNav = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800 text-xs">
          {/* Col 1 & 2: Hospital Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight">
                  Harsha Hospital
                </span>
                <span className="block text-[11px] text-teal-400">
                  Hiriyur, Chitradurga, Karnataka
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Harsha Hospital is a healthcare facility serving patients in Hiriyur, Chitradurga, Karnataka. Our website is designed to make it easier for patients to discover available healthcare services and manage appointments.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                <Accessibility className="w-3 h-3 text-teal-400" />
                Wheelchair Accessible
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Justdial 4.3★
              </span>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors"
                >
                  About Hospital
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-white transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('doctors')}
                  className="hover:text-white transition-colors"
                >
                  Doctors
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('facilities')}
                  className="hover:text-white transition-colors"
                >
                  Facilities & Accessibility
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="hover:text-white transition-colors"
                >
                  Premises Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Directions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Address & Phone */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Hospital Address</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <p>
                  Main Road, Behind Siri Residency,<br />
                  Hiriyur, Chitradurga,<br />
                  Karnataka 577598, India
                </p>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
                    className="font-bold text-white hover:text-teal-300"
                  >
                    {hospitalInfo.phone}
                  </a>
                  <span className="block text-[11px] text-slate-500">24/7 Receiving Desk</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-400 hover:underline text-[11px]"
                >
                  <span>Google Maps Directions (13.9376, 76.6216)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 5: Operating Hours */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Hours & Emergency</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Operating Schedule</span>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {hospitalInfo.openingHoursText}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-2">
                Prior appointment booking is recommended to secure allocated consultation times and prevent waiting delays.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Harsha Hospital, Hiriyur, Chitradurga, Karnataka. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPrivacy(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setShowTerms(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => handleNav('admin-dashboard')}
              className="hover:text-teal-400 transition-colors"
            >
              Staff Admin
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">Privacy Policy</h3>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Harsha Hospital ("we", "hospital") respects the confidentiality of personal health information. When booking an appointment on our portal, we collect patient name, contact number, age, gender, and reason for consultation.
              </p>
              <p>
                This information is used strictly to reserve outpatient consultation slots, assign queue tokens, and send appointment confirmation notifications (SMS and WhatsApp). We do not share or sell your details to third parties.
              </p>
              <p>
                Patients can request cancellation or record updates directly through the patient portal or by contacting the reception desk at +91 97410 49192.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacy(false)}
              className="w-full py-2 bg-teal-600 text-white font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">Terms of Service</h3>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                1. Online appointment bookings represent confirmed consultation windows. In emergency situations requiring immediate hospital triage, scheduled consults may undergo brief delays.
              </p>
              <p>
                2. Patients are requested to arrive at Harsha Hospital, Main Road, Hiriyur at least 10 minutes prior to their scheduled slot with their assigned token number.
              </p>
              <p>
                3. Consultation fees are payable on-site at the reception desk during physical check-in.
              </p>
            </div>
            <button
              onClick={() => setShowTerms(false)}
              className="w-full py-2 bg-teal-600 text-white font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
