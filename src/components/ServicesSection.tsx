import React, { useState } from 'react';
import {
  Activity,
  HeartPulse,
  Stethoscope,
  Bone,
  Baby,
  Syringe,
  ShieldCheck,
  Calendar,
  Info,
  X,
  PlusCircle,
  Clock,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Service } from '../types';

export const ServicesSection: React.FC = () => {
  const {
    services,
    hospitalInfo,
    setActivePage,
    setSelectedServiceIdForBooking,
    seedSampleData,
    setShowAuthModal,
    setAuthModalMode,
  } = useHospital();

  const [activeDepartment, setActiveDepartment] = useState<string>('all');
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<Service | null>(null);

  const activeServices = services.filter((s) => s.active);

  const departments = ['all', ...Array.from(new Set(activeServices.map((s) => s.department)))];

  const filteredServices =
    activeDepartment === 'all'
      ? activeServices
      : activeServices.filter((s) => s.department === activeDepartment);

  const handleBookService = (service: Service) => {
    setSelectedServiceIdForBooking(service.id);
    const bookingWidget = document.getElementById('quick-booking-section');
    if (bookingWidget) {
      bookingWidget.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActivePage('appointments');
    }
  };

  const getServiceIcon = (name: string, dept: string) => {
    const text = (name + ' ' + dept).toLowerCase();
    if (text.includes('bone') || text.includes('ortho') || text.includes('joint')) {
      return <Bone className="w-5 h-5 text-teal-600" />;
    }
    if (text.includes('child') || text.includes('pediatric') || text.includes('baby')) {
      return <Baby className="w-5 h-5 text-teal-600" />;
    }
    if (text.includes('women') || text.includes('gynec') || text.includes('matern')) {
      return <HeartPulse className="w-5 h-5 text-teal-600" />;
    }
    if (text.includes('wound') || text.includes('emergency') || text.includes('dress')) {
      return <Syringe className="w-5 h-5 text-teal-600" />;
    }
    return <Stethoscope className="w-5 h-5 text-teal-600" />;
  };

  return (
    <section id="services-section" className="py-14 lg:py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/70 text-teal-900 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5 text-teal-700" />
              <span>Clinical Care & OPD Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hospital Services & Consultation
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Verified clinical consultations available at Harsha Hospital in Hiriyur. All services are maintained directly by hospital administration.
            </p>
          </div>

          {activeServices.length > 0 && departments.length > 2 && (
            <div className="flex flex-wrap gap-1.5">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeDepartment === dept
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dept === 'all' ? 'All Services' : dept}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Services List / Empty State */}
        {activeServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Services Directory Under Hospital Review
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
              To adhere to data integrity, clinical service categories and specialist OPD consultation timings are populated directly by Harsha Hospital administrators.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                Call Desk: {hospitalInfo.phone}
              </a>
              <button
                onClick={() => {
                  setAuthModalMode('admin');
                  setShowAuthModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Manage in Admin Panel
              </button>
              <button
                onClick={seedSampleData}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Sample OPD Services (Demo)
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-300/80 transition-all p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getServiceIcon(service.name, service.department)}
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {service.department}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-teal-800 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      ~{service.consultationDurationMinutes} mins consultation
                    </span>
                    <span className="text-emerald-700 font-semibold">Slots Available</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedServiceForModal(service)}
                      className="py-2 px-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition-colors"
                    >
                      View Details
                    </button>

                    {service.bookingEnabled ? (
                      <button
                        onClick={() => handleBookService(service)}
                        className="py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold text-center shadow-2xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        Book Slot
                      </button>
                    ) : (
                      <button
                        disabled
                        className="py-2 px-3 rounded-lg bg-slate-100 text-slate-400 text-xs font-medium text-center cursor-not-allowed"
                      >
                        Walk-in Only
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Details Modal */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <button
              onClick={() => setSelectedServiceForModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                {getServiceIcon(
                  selectedServiceForModal.name,
                  selectedServiceForModal.department
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
                  {selectedServiceForModal.department}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedServiceForModal.name}
                </h3>
              </div>
            </div>

            <div className="text-sm text-slate-600 leading-relaxed space-y-2">
              <p>{selectedServiceForModal.description}</p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800">
                    Harsha Hospital OPD, Hiriyur
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Average Duration:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedServiceForModal.consultationDurationMinutes} Minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Facility:</span>
                  <span className="font-semibold text-slate-800">Wheelchair Accessible</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  const s = selectedServiceForModal;
                  setSelectedServiceForModal(null);
                  handleBookService(s);
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Consultation Now
              </button>
              <button
                onClick={() => setSelectedServiceForModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
