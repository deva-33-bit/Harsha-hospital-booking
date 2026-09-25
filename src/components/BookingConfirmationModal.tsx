import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Download,
  Printer,
  X,
  Share2,
  MessageSquare,
  Building,
  Database,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Appointment } from '../types';

export const BookingConfirmationModal: React.FC = () => {
  const {
    lastBookedAppointment,
    setLastBookedAppointment,
    hospitalInfo,
    doctors,
    setShowAppointmentSlipModal,
    supabaseStatus,
    supabaseSyncState,
    supabaseProjectId,
    supabaseLastError,
  } = useHospital();

  if (!lastBookedAppointment) return null;

  const apt = lastBookedAppointment;
  const doctor = doctors.find((d) => d.id === apt.doctorId);
  const doctorName = doctor ? doctor.name : 'Attending Consultant';

  // Generate .ics calendar download
  const handleAddToCalendar = () => {
    const [hours, minutes] = apt.appointmentTime.split(':').map(Number);
    const [year, month, day] = apt.appointmentDate.split('-').map(Number);

    const startDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 mins

    const formatTime = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Harsha Hospital Hiriyur//Appointment//EN',
      'BEGIN:VEVENT',
      `UID:${apt.id}@harshahospital.in`,
      `DTSTAMP:${formatTime(new Date())}`,
      `DTSTART:${formatTime(startDate)}`,
      `DTEND:${formatTime(endDate)}`,
      `SUMMARY:Medical Appointment with ${doctorName} at Harsha Hospital`,
      `DESCRIPTION:Harsha Hospital Appointment #${apt.appointmentNumber} for ${apt.patientName}. Token #${apt.tokenNumber}. Department: ${apt.department}. Phone: ${hospitalInfo.phone}`,
      `LOCATION:Harsha Hospital, Main Road, Behind Siri Residency, Hiriyur, Chitradurga, Karnataka 577598`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Harsha-Hospital-Appointment-${apt.appointmentNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download text confirmation summary
  const handleDownloadConfirmation = () => {
    const summaryText = `
======================================================
HARSHA HOSPITAL - APPOINTMENT CONFIRMATION SLIP
Main Road, Behind Siri Residency, Hiriyur, Karnataka 577598
Helpline: ${hospitalInfo.phone} | Wheelchair Accessible
======================================================

Appointment ID   : ${apt.appointmentNumber}
Token Number     : #${apt.tokenNumber}
Status           : ${apt.status}

PATIENT DETAILS:
Name             : ${apt.patientName}
Mobile           : ${apt.phone}
Age / Gender     : ${apt.age} yrs / ${apt.gender}
Reason for Visit : ${apt.reason}

CONSULTATION DETAILS:
Doctor           : ${doctorName}
Department       : ${apt.department}
Date             : ${apt.appointmentDate}
Time             : ${apt.appointmentTime}
Consultation Fee : ₹${doctor ? doctor.consultationFee : 'Standard OPD'} (Payable at desk)

HOSPITAL LOCATION & DIRECTIONS:
Harsha Hospital
Main Road, Behind Siri Residency
Hiriyur, Chitradurga, Karnataka 577598
Contact: ${hospitalInfo.phone}
Map Link: ${hospitalInfo.googleMapsUrl}

PATIENT INSTRUCTIONS:
1. Please arrive 10-15 minutes prior to your allocated slot.
2. Present this token number (#${apt.tokenNumber}) at the reception counter.
3. Bring any prior prescription or investigation records if available.
4. Designated wheelchair ramp and priority parking are available at the main gate.
======================================================
`;

    const blob = new Blob([summaryText.trim()], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Harsha-Hospital-Slip-${apt.appointmentNumber}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    setShowAppointmentSlipModal(apt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-6 text-center relative">
          <button
            onClick={() => setLastBookedAppointment(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white text-teal-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight">Appointment Confirmed</h3>
          <p className="text-xs text-teal-100 mt-1">
            Harsha Hospital, Main Road, Hiriyur, Chitradurga
          </p>
        </div>

        {/* Appointment Key Metrics */}
        <div className="p-6 space-y-5">
          {/* Token & ID Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-teal-50 border border-teal-200">
            <div>
              <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                Appointment ID
              </span>
              <span className="text-lg font-mono font-bold text-slate-900">
                {apt.appointmentNumber}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                Queue Token
              </span>
              <span className="inline-block px-3 py-0.5 rounded-md bg-teal-700 text-white font-mono font-extrabold text-base">
                #{apt.tokenNumber}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Patient Name</span>
              <p className="font-bold text-slate-900 text-sm">{apt.patientName}</p>
              <p className="text-slate-500">
                {apt.age} yrs • {apt.gender}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Doctor / Specialist</span>
              <p className="font-bold text-slate-900 text-sm">{doctorName}</p>
              <p className="text-teal-700 font-medium">{apt.department}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Date & Time</span>
              <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>{apt.appointmentDate}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-700 font-semibold">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{apt.appointmentTime}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Hospital Contact</span>
              <p className="font-bold text-slate-900 text-sm">{hospitalInfo.phone}</p>
              <p className="text-slate-500 text-[11px]">Behind Siri Residency</p>
            </div>
          </div>

          {/* Notification simulated message alert */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Instant SMS & WhatsApp Notification</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Confirmation details and token #{apt.tokenNumber} have been logged for <strong>{apt.phone}</strong>.
              </p>
            </div>
          </div>

          {/* Supabase Database Sync Status */}
          <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <Database className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-emerald-900">Supabase Database Connected</p>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-200/60 text-emerald-900">
                  {supabaseProjectId}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                {supabaseSyncState === 'syncing'
                  ? 'Saving record directly to Supabase appointments table...'
                  : supabaseSyncState === 'error'
                  ? `Saved locally. Supabase: ${supabaseLastError || 'Table ready for sync'}`
                  : `Appointment #${apt.appointmentNumber} automatically saved to Supabase 'appointments' table.`}
              </p>
            </div>
          </div>

          {/* Three Required Action CTAs (Add to Calendar, Print Appointment, Download Confirmation) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={handleAddToCalendar}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-300 hover:border-teal-500 hover:bg-teal-50 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>Add to Calendar</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-300 hover:border-teal-500 hover:bg-teal-50 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-teal-600" />
              <span>Print Slip</span>
            </button>

            <button
              onClick={handleDownloadConfirmation}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Download Slip</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => setLastBookedAppointment(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium underline cursor-pointer"
            >
              Done & Return to Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
