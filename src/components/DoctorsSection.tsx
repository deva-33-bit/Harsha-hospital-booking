import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Clock,
  ShieldCheck,
  Phone,
  Sparkles,
  Award,
  IndianRupee,
  X,
  UserCheck,
  CheckCircle,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Doctor } from '../types';

export const DoctorsSection: React.FC = () => {
  const {
    doctors,
    schedules,
    hospitalInfo,
    setActivePage,
    setSelectedDoctorIdForBooking,
    seedSampleData,
    setShowAuthModal,
    setAuthModalMode,
  } = useHospital();

  const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState<Doctor | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const activeDoctors = doctors.filter((d) => d.active);
  const departments = ['all', ...Array.from(new Set(activeDoctors.map((d) => d.department)))];

  const filteredDoctors =
    departmentFilter === 'all'
      ? activeDoctors
      : activeDoctors.filter((d) => d.department === departmentFilter);

  const handleBookDoctor = (doc: Doctor) => {
    setSelectedDoctorIdForBooking(doc.id);
    const bookingWidget = document.getElementById('quick-booking-section');
    if (bookingWidget) {
      bookingWidget.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActivePage('appointments');
    }
  };

  // Helper to get active consultation days & timings for a doctor
  const getDoctorAvailabilitySummary = (doctorId: string) => {
    const docSchedules = schedules.filter((s) => s.doctorId === doctorId && s.active);
    if (docSchedules.length === 0) return { days: 'Schedule being updated', times: 'Contact reception' };

    const uniqueDays = Array.from(new Set(docSchedules.map((s) => s.day)));
    const sampleTime = `${docSchedules[0].startTime} – ${docSchedules[0].endTime}`;

    const daysText =
      uniqueDays.length >= 5
        ? 'Mon – Sat'
        : uniqueDays.map((d) => d.slice(0, 3)).join(', ');

    return { days: daysText, times: sampleTime };
  };

  return (
    <section id="doctors-section" className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Medical Practitioners & Consultants</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Consulting Physicians & Specialists
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Meet the healthcare team providing medical consultations and patient care at Harsha Hospital, Hiriyur.
            </p>
          </div>

          {activeDoctors.length > 0 && departments.length > 2 && (
            <div className="flex flex-wrap gap-1.5">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDepartmentFilter(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    departmentFilter === dept
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept === 'all' ? 'All Specialists' : dept}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty State vs Doctor Grid */}
        {activeDoctors.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Doctors and consultation schedules will appear here.
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
              In accordance with our strict data-integrity commitment, medical staff listings, qualifications, and consultation hours are populated directly by Harsha Hospital administrators.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                Call Reception: {hospitalInfo.phone}
              </a>
              <button
                onClick={() => {
                  setAuthModalMode('admin');
                  setShowAuthModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Hospital Admin Dashboard
              </button>
              <button
                onClick={seedSampleData}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Sample OPD Doctors (Demo)
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDoctors.map((doc) => {
              const { days, times } = getDoctorAvailabilitySummary(doc.id);
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-300/80 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Doctor Photo */}
                    <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                      <img
                        src={doc.photoUrl}
                        alt={doc.name}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-bold text-teal-800 shadow-xs">
                          {doc.department}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {doc.name}
                        </h3>
                      </div>

                      <p className="text-xs text-teal-800 font-semibold">{doc.qualification}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{doc.specialization}</p>

                      <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 text-slate-500">
                        <span>{doc.experienceYears}+ years exp</span>
                        <span className="font-bold text-slate-900">₹{doc.consultationFee} fee</span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-[11px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-teal-600 shrink-0" />
                          <span className="truncate">{days}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                          <span className="truncate">{times}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedDoctorForProfile(doc)}
                      className="py-2 px-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleBookDoctor(doc)}
                      className="py-2 px-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold text-center shadow-2xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3 h-3" />
                      Book
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctorForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 space-y-5 my-8">
            <button
              onClick={() => setSelectedDoctorForProfile(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <img
                src={selectedDoctorForProfile.photoUrl}
                alt={selectedDoctorForProfile.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-200 shadow-xs"
              />
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200 inline-block">
                  {selectedDoctorForProfile.department}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedDoctorForProfile.name}
                </h3>
                <p className="text-xs font-semibold text-teal-800">
                  {selectedDoctorForProfile.qualification}
                </p>
                {selectedDoctorForProfile.registrationNumber && (
                  <p className="text-[11px] text-slate-500 font-mono">
                    Reg: {selectedDoctorForProfile.registrationNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-900 block mb-1">About Doctor:</span>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedDoctorForProfile.bio}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Specialization & Areas of Practice:</span>
                <p className="leading-relaxed">{selectedDoctorForProfile.specialization}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80">
                  <span className="text-[11px] text-teal-800 font-medium block">Consultation Fee</span>
                  <span className="text-base font-extrabold text-slate-900">
                    ₹{selectedDoctorForProfile.consultationFee}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Payable on-site</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Clinical Experience</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {selectedDoctorForProfile.experienceYears}+ Years
                  </span>
                  <span className="text-[10px] text-slate-500 block">OPD & Inpatient Care</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1.5">Scheduled Consultation Windows:</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {schedules
                    .filter((s) => s.doctorId === selectedDoctorForProfile.id && s.active)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] border border-slate-100"
                      >
                        <span className="font-semibold text-slate-800">{s.day}</span>
                        <span className="text-teal-700 font-mono">
                          {s.startTime} – {s.endTime} ({s.slotDurationMinutes}m slots)
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  const doc = selectedDoctorForProfile;
                  setSelectedDoctorForProfile(null);
                  handleBookDoctor(doc);
                }}
                className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation with {selectedDoctorForProfile.name}
              </button>
              <button
                onClick={() => setSelectedDoctorForProfile(null)}
                className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
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
