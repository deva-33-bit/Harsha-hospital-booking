import React from 'react';
import {
  Printer,
  X,
  Building2,
  Calendar,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  Accessibility,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const AppointmentSlipModal: React.FC = () => {
  const { showAppointmentSlipModal, setShowAppointmentSlipModal, hospitalInfo, doctors } =
    useHospital();

  if (!showAppointmentSlipModal) return null;

  const apt = showAppointmentSlipModal;
  const doctor = doctors.find((d) => d.id === apt.doctorId);
  const doctorName = doctor ? doctor.name : 'Attending Medical Officer';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-8 print:m-0 print:border-0 print:shadow-none animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Controls (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold">Official Consultation Slip</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Slip
            </button>
            <button
              onClick={() => setShowAppointmentSlipModal(null)}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div className="p-6 sm:p-8 space-y-6 print:p-0">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
                Harsha Hospital
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700">
              Healthcare & Outpatient Consultation Center
            </p>
            <p className="text-[11px] text-slate-500">
              Main Road, Behind Siri Residency, Hiriyur, Chitradurga, Karnataka 577598
            </p>
            <p className="text-[11px] font-bold text-teal-800">
              Helpline: {hospitalInfo.phone} • Wheelchair Accessible Facility
            </p>
          </div>

          {/* Token & Ref Banner */}
          <div className="flex items-center justify-between p-3.5 bg-slate-100 rounded-xl border border-slate-300">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Appointment Reference
              </span>
              <span className="text-sm font-mono font-bold text-slate-900">
                {apt.appointmentNumber}
              </span>
              <span className="text-[10px] text-slate-500 block">Status: {apt.status}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Queue Token No.
              </span>
              <span className="text-2xl font-mono font-black text-teal-800">
                #{apt.tokenNumber}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 border-r border-slate-200 pr-2">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Patient Info
              </span>
              <p className="font-bold text-slate-900 text-sm">{apt.patientName}</p>
              <p className="text-slate-600">
                {apt.age} yrs • {apt.gender}
              </p>
              <p className="text-slate-600">Ph: {apt.phone}</p>
              {apt.email && <p className="text-slate-500 truncate">{apt.email}</p>}
            </div>

            <div className="space-y-1 pl-2">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Doctor & Schedule
              </span>
              <p className="font-bold text-slate-900 text-sm">{doctorName}</p>
              <p className="text-teal-800 font-semibold">{apt.department}</p>
              <p className="text-slate-700 font-bold">
                Date: {apt.appointmentDate}
              </p>
              <p className="text-slate-700 font-bold">
                Time: {apt.appointmentTime}
              </p>
            </div>
          </div>

          {/* Reason & Notes */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-800">Chief Complaint / Reason for Visit:</span>
            <p className="text-slate-700 italic">{apt.reason}</p>
            {apt.notes && (
              <p className="text-[11px] text-slate-500 mt-1">Note: {apt.notes}</p>
            )}
          </div>

          {/* Patient Instructions */}
          <div className="border-t border-slate-200 pt-3 space-y-1 text-[11px] text-slate-500">
            <p className="font-bold text-slate-700">Patient Instructions:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Please present this slip at the Harsha Hospital reception desk 10 minutes prior to slot.</li>
              <li>Consultation fee: ₹{doctor ? doctor.consultationFee : 300} payable at the counter.</li>
              <li>Designated wheelchair ramp entrance and priority parking are available at front.</li>
            </ul>
          </div>

          {/* Bottom Hospital Stamp Placeholder */}
          <div className="border-t border-dashed border-slate-300 pt-4 flex items-center justify-between text-[10px] text-slate-400">
            <div>
              <span>Generated: {new Date(apt.createdAt).toLocaleString()}</span>
              <span className="block font-mono">Hiriyur, Chitradurga, Karnataka</span>
            </div>
            <div className="text-center border border-dashed border-slate-300 px-3 py-1 rounded">
              <span className="font-bold uppercase text-slate-500 block">Harsha Hospital</span>
              <span className="text-[9px]">Verified Booking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
