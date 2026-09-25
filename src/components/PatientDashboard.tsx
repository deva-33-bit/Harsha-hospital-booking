import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  Edit2,
  CalendarCheck,
  RotateCcw,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Appointment } from '../types';

export const PatientDashboard: React.FC = () => {
  const {
    currentUser,
    appointments,
    doctors,
    hospitalInfo,
    cancelAppointment,
    rescheduleAppointment,
    setShowAppointmentSlipModal,
    getAvailableSlots,
    setActivePage,
    setShowAuthModal,
    setAuthModalMode,
  } = useHospital();

  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="py-16 px-4 max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Patient Account Portal</h2>
        <p className="text-slate-600 text-xs sm:text-sm mb-6">
          Sign in or register with your mobile number to view and manage your booked appointments at Harsha Hospital.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setShowAuthModal(true);
            }}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-all"
          >
            Sign In with Mobile / Email
          </button>
          <button
            onClick={() => {
              setAuthModalMode('register');
              setShowAuthModal(true);
            }}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
          >
            Create New Patient Account
          </button>
        </div>
      </div>
    );
  }

  // Filter appointments for this patient (by patientId or matching email/phone)
  const patientAppointments = appointments.filter((apt) => {
    if (apt.patientId && apt.patientId === currentUser.id) return true;
    if (currentUser.email && apt.email.toLowerCase() === currentUser.email.toLowerCase()) return true;
    if (currentUser.phone && apt.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')) return true;
    return false;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingAppointments = patientAppointments.filter(
    (apt) => apt.status !== 'Cancelled' && apt.status !== 'Completed' && apt.appointmentDate >= todayStr
  );

  const pastAppointments = patientAppointments.filter(
    (apt) => apt.status === 'Cancelled' || apt.status === 'Completed' || apt.appointmentDate < todayStr
  );

  // Available slots for rescheduling
  const availableRescheduleSlots =
    reschedulingApt && newDate ? getAvailableSlots(reschedulingApt.doctorId, newDate) : [];

  const handleConfirmReschedule = () => {
    if (!reschedulingApt || !newDate || !newTime) {
      setRescheduleError('Please choose a valid date and available time slot.');
      return;
    }

    const res = rescheduleAppointment(reschedulingApt.id, newDate, newTime);
    if (!res.success) {
      setRescheduleError(res.error || 'Failed to reschedule.');
    } else {
      setReschedulingApt(null);
      setNewDate('');
      setNewTime('');
      setRescheduleError(null);
    }
  };

  const handleConfirmCancel = () => {
    if (!cancellingApt) return;
    cancelAppointment(cancellingApt.id, cancelReason);
    setCancellingApt(null);
    setCancelReason('');
  };

  return (
    <div className="py-10 lg:py-16 bg-slate-50 min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top welcome profile bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  Patient Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.phone} • {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('appointments')}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              + Book New Appointment
            </button>
            <a
              href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              Call Desk
            </a>
          </div>
        </div>

        {/* Dashboard 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Visits</span>
              <Calendar className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {upcomingAppointments.length}
            </div>
            <span className="text-[11px] text-teal-700 font-medium">Scheduled consultations</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Previous Visits</span>
              <RotateCcw className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {pastAppointments.length}
            </div>
            <span className="text-[11px] text-slate-500">Completed or archived</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Hospital Desk</span>
              <Phone className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-sm font-bold text-slate-900 truncate">
              {hospitalInfo.phone}
            </div>
            <span className="text-[11px] text-slate-500">24/7 Telephone Support</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Accessibility</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-sm font-bold text-emerald-700">
              Verified Step-Free
            </div>
            <span className="text-[11px] text-slate-500">Ramp & Reserved Parking</span>
          </div>
        </div>

        {/* Section: Upcoming Appointments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-teal-600" />
              Upcoming Scheduled Consultations
            </h2>
            <span className="text-xs text-slate-500">
              {upcomingAppointments.length} active reservation(s)
            </span>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-600 mb-3">
                You have no upcoming appointments scheduled at Harsha Hospital.
              </p>
              <button
                onClick={() => setActivePage('appointments')}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
              >
                Schedule an Appointment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map((apt) => {
                const doctor = doctors.find((d) => d.id === apt.doctorId);
                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                            Ref: {apt.appointmentNumber}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-0.5">
                            {doctor ? doctor.name : 'Consulting Doctor'}
                          </h3>
                          <span className="text-xs font-medium text-teal-700 block">
                            {apt.department}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 font-mono font-bold text-xs border border-teal-200">
                            Token #{apt.tokenNumber}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 block">Date</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-teal-600" />
                            {apt.appointmentDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Time Slot</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-teal-600" />
                            {apt.appointmentTime}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">Reason: </span>
                        {apt.reason}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setShowAppointmentSlipModal(apt)}
                        className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5 text-teal-600" />
                        Slip
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setReschedulingApt(apt);
                            setNewDate(apt.appointmentDate);
                            setNewTime('');
                          }}
                          className="py-1.5 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => setCancellingApt(apt)}
                          className="py-1.5 px-3 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Past Appointments */}
        {pastAppointments.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Past & Cancelled Consultations</h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="divide-y divide-slate-100">
                {pastAppointments.map((apt) => {
                  const doctor = doctors.find((d) => d.id === apt.doctorId);
                  return (
                    <div
                      key={apt.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {doctor ? doctor.name : 'Hospital Physician'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              apt.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <div className="text-slate-500">
                          {apt.department} • {apt.appointmentDate} at {apt.appointmentTime}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-600">#{apt.appointmentNumber}</span>
                        <button
                          onClick={() => setShowAppointmentSlipModal(apt)}
                          className="py-1 px-2.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-medium"
                        >
                          View Receipt
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <button
              onClick={() => setReschedulingApt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Reschedule Consultation</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Ref #{reschedulingApt.appointmentNumber} with {doctors.find((d) => d.id === reschedulingApt.doctorId)?.name}
              </p>
            </div>

            {rescheduleError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {rescheduleError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose New Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(e.target.value);
                    setNewTime('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose New Available Slot
                </label>
                {availableRescheduleSlots.length === 0 ? (
                  <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    No open consultation slots on this date. Please pick another date.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {availableRescheduleSlots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        type="button"
                        onClick={() => setNewTime(slot.time)}
                        className={`py-1.5 text-xs rounded-lg font-semibold transition-all ${
                          !slot.available
                            ? 'bg-slate-100 text-slate-400 line-through cursor-not-allowed'
                            : newTime === slot.time
                            ? 'bg-teal-600 text-white font-bold'
                            : 'bg-white border border-slate-200 hover:border-teal-500'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                disabled={!newDate || !newTime}
                onClick={handleConfirmReschedule}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white font-bold text-xs transition-colors"
              >
                Confirm Reschedule
              </button>
              <button
                onClick={() => setReschedulingApt(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancellingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Cancel Appointment?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel appointment <strong>#{cancellingApt.appointmentNumber}</strong> on {cancellingApt.appointmentDate} at {cancellingApt.appointmentTime}?
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for cancellation (optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Symptoms resolved, travel conflict..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Yes, Cancel Appointment
              </button>
              <button
                onClick={() => setCancellingApt(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Keep Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
