import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const QuickBookingWidget: React.FC = () => {
  const {
    doctors,
    services,
    hospitalInfo,
    currentUser,
    getAvailableSlots,
    createAppointment,
    selectedDoctorIdForBooking,
    setSelectedDoctorIdForBooking,
    selectedServiceIdForBooking,
    setSelectedServiceIdForBooking,
    seedSampleData,
    hasLoadedDemoData,
    setShowAuthModal,
    setAuthModalMode,
  } = useHospital();

  // Extract distinct departments from active doctors or services
  const departments = useMemo(() => {
    const set = new Set<string>();
    doctors.filter((d) => d.active).forEach((d) => set.add(d.department));
    services.filter((s) => s.active).forEach((s) => set.add(s.department));
    return Array.from(set);
  }, [doctors, services]);

  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Patient inputs
  const [patientName, setPatientName] = useState<string>(currentUser?.name || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // UI state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Sync external preselection
  useEffect(() => {
    if (selectedDoctorIdForBooking) {
      const doc = doctors.find((d) => d.id === selectedDoctorIdForBooking);
      if (doc) {
        setSelectedDepartment(doc.department);
        setSelectedDoctorId(doc.id);
      }
    }
  }, [selectedDoctorIdForBooking, doctors]);

  useEffect(() => {
    if (selectedServiceIdForBooking) {
      const srv = services.find((s) => s.id === selectedServiceIdForBooking);
      if (srv) {
        setSelectedDepartment(srv.department);
      }
    }
  }, [selectedServiceIdForBooking, services]);

  // Set default date to today or tomorrow
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // Update selected doctor when department changes
  useEffect(() => {
    if (selectedDepartment) {
      const docsInDept = doctors.filter((d) => d.active && d.department === selectedDepartment);
      if (docsInDept.length > 0 && !docsInDept.some((d) => d.id === selectedDoctorId)) {
        setSelectedDoctorId(docsInDept[0].id);
      }
    }
  }, [selectedDepartment, doctors]);

  // Compute available slots
  const availableSlots = useMemo(() => {
    if (!selectedDoctorId || !selectedDate) return [];
    return getAvailableSlots(selectedDoctorId, selectedDate);
  }, [selectedDoctorId, selectedDate, getAvailableSlots]);

  // Reset selected time if current selection becomes unavailable
  useEffect(() => {
    if (selectedTime && !availableSlots.some((s) => s.time === selectedTime && s.available)) {
      setSelectedTime('');
    }
  }, [availableSlots, selectedTime]);

  const activeDoctors = doctors.filter((d) => d.active);

  // Validations
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedDoctorId) {
      errors.doctor = 'Please select a consulting doctor';
    }

    if (!selectedDate) {
      errors.date = 'Please select an appointment date';
    }

    if (!selectedTime) {
      errors.time = 'Please select an available consultation slot';
    }

    if (!patientName.trim()) {
      errors.patientName = 'Patient full name is required';
    } else if (patientName.trim().length < 2) {
      errors.patientName = 'Name must be at least 2 characters';
    }

    // Indian phone number validation
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    const indianPhoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    if (!phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (!indianPhoneRegex.test(cleanPhone)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email address is required for confirmation';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 0 || ageNum > 125) {
      errors.age = 'Enter a valid age (0 - 120)';
    }

    if (!reason.trim()) {
      errors.reason = 'Please provide a brief reason for visit or primary symptoms';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.form-field-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    const doc = doctors.find((d) => d.id === selectedDoctorId);

    const result = createAppointment({
      doctorId: selectedDoctorId,
      serviceId: selectedServiceIdForBooking || undefined,
      department: selectedDepartment || doc?.department || 'General Medicine',
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      patientName: patientName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      age: parseInt(age, 10),
      gender,
      reason: reason.trim(),
      notes: notes.trim() || undefined,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setServerError(result.error || 'Failed to book slot. Please retry.');
    } else {
      // Reset form
      setReason('');
      setNotes('');
      setSelectedTime('');
      setFormErrors({});
      // Last booked appointment will trigger confirmation modal automatically via context
    }
  };

  return (
    <section id="quick-booking-section" className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-3 border border-teal-200">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>Guaranteed Consultation Slot</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Book Your Appointment
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Schedule a verified OPD consultation with real-time slot availability, instant token allocation, and transparent queue tracking.
          </p>
        </div>

        {/* Empty State when no doctors are configured yet */}
        {activeDoctors.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 sm:p-10 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Doctors & Consultation Schedules
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              In accordance with hospital data-integrity guidelines, consultation rosters and specialist schedules appear here once officially configured by Harsha Hospital administrators.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all"
              >
                <Phone className="w-4 h-4 text-teal-400" />
                Call Desk: {hospitalInfo.phone}
              </a>

              <button
                onClick={() => {
                  setAuthModalMode('admin');
                  setShowAuthModal(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-sm font-semibold transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Hospital Admin Login
              </button>

              <button
                onClick={seedSampleData}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-all shadow-xs"
                title="Populate standard OPD specialties for instant interactive booking test"
              >
                <Sparkles className="w-4 h-4" />
                <span>Load Clinical OPD Roster (Demo)</span>
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleBookingSubmit}
            noValidate
            className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 lg:p-10"
          >
            {serverError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Unable to Complete Booking</p>
                  <p className="text-xs text-red-700 mt-0.5">{serverError}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Department, Doctor & Slot Selection (lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-5 border-b lg:border-b-0 lg:border-r border-slate-200 lg:pr-8 pb-6 lg:pb-0">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">Select Specialist & Time</h3>
                </div>

                {/* 1. Select Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    1. Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setSelectedDoctorId('');
                      setSelectedTime('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 bg-white text-sm text-slate-800 transition-all"
                  >
                    <option value="">All Available Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Select Doctor */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    2. Consulting Doctor *
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => {
                      setSelectedDoctorId(e.target.value);
                      setSelectedTime('');
                      setFormErrors((prev) => ({ ...prev, doctor: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      formErrors.doctor ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                    } focus:border-teal-600 focus:ring-2 focus:ring-teal-100 bg-white text-sm text-slate-800 transition-all`}
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors
                      .filter((d) => d.active && (!selectedDepartment || d.department === selectedDepartment))
                      .map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} – {doc.specialization} (₹{doc.consultationFee})
                        </option>
                      ))}
                  </select>
                  {formErrors.doctor && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.doctor}
                    </p>
                  )}
                </div>

                {/* Doctor Bio Card if selected */}
                {selectedDoctorId && (
                  (() => {
                    const doc = doctors.find((d) => d.id === selectedDoctorId);
                    if (!doc) return null;
                    return (
                      <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/70 flex items-center gap-3">
                        <img
                          src={doc.photoUrl}
                          alt={doc.name}
                          className="w-12 h-12 rounded-lg object-cover border border-teal-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h4>
                          <p className="text-[11px] text-teal-800 font-medium truncate">{doc.qualification}</p>
                          <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                            <span>Fee: ₹{doc.consultationFee}</span>
                            <span>•</span>
                            <span>{doc.experienceYears} yrs exp</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* 3. Select Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    3. Appointment Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      max={
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split('T')[0]
                      }
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime('');
                        setFormErrors((prev) => ({ ...prev, date: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${
                        formErrors.date ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                      } focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 transition-all`}
                    />
                  </div>
                  {formErrors.date && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.date}
                    </p>
                  )}
                </div>

                {/* 4. Select Available Time Slot */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      4. Available Slot *
                    </label>
                    <span className="text-[11px] text-teal-700 font-medium">Real-time availability</span>
                  </div>

                  {!selectedDoctorId ? (
                    <p className="text-xs text-slate-500 italic py-2">
                      Please select a doctor to view time slots.
                    </p>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                      No consultation sessions scheduled for the selected doctor on this day. Please pick another date or specialist.
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1 py-1">
                        {availableSlots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => {
                                setSelectedTime(slot.time);
                                setFormErrors((prev) => ({ ...prev, time: '' }));
                              }}
                              className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all ${
                                !slot.available
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-teal-600 text-white shadow-xs scale-102 border-teal-600 font-bold'
                                  : 'bg-white text-slate-700 border border-slate-300 hover:border-teal-500 hover:bg-teal-50/50'
                              }`}
                              title={
                                !slot.available
                                  ? slot.reason || 'Slot not available'
                                  : `Select ${slot.time}`
                              }
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                      {formErrors.time && (
                        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {formErrors.time}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span> Selected
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400 inline-block"></span> Available
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span> Booked / Passed
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Patient Details (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">Patient Details</h3>
                </div>

                {/* 5. Patient Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    5. Patient Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Gowda"
                      value={patientName}
                      onChange={(e) => {
                        setPatientName(e.target.value);
                        setFormErrors((prev) => ({ ...prev, patientName: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${
                        formErrors.patientName ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                      } focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 transition-all`}
                    />
                  </div>
                  {formErrors.patientName && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.patientName}
                    </p>
                  )}
                </div>

                {/* 6. Mobile & 7. Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      6. Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="e.g. 9845012345"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setFormErrors((prev) => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          formErrors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                        } focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 transition-all`}
                      />
                    </div>
                    {formErrors.phone ? (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {formErrors.phone}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 mt-1">SMS & WhatsApp token confirmation</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      7. Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${
                        formErrors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                      } focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 transition-all`}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* 8. Age & 9. Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      8. Patient Age *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      placeholder="Age in yrs"
                      value={age}
                      onChange={(e) => {
                        setAge(e.target.value);
                        setFormErrors((prev) => ({ ...prev, age: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${
                        formErrors.age ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                      } focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 transition-all`}
                    />
                    {formErrors.age && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {formErrors.age}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      9. Gender *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 bg-white text-sm text-slate-800 transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* 10. Reason for Visit */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    10. Reason for Visit / Primary Symptoms *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description (e.g. fever for 3 days, joint pain, routine checkup...)"
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setFormErrors((prev) => ({ ...prev, reason: '' }));
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl border ${
                      formErrors.reason ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                    } focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 transition-all`}
                  />
                  {formErrors.reason && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.reason}
                    </p>
                  )}
                </div>

                {/* 11. Optional Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    11. Additional Clinical Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Any allergies, previous reports, or wheelchair assistance needed on arrival"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 transition-all"
                  />
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-sm shadow-teal-600/30 hover:shadow-teal-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Reserving Slot...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Confirm Appointment</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
                    <span>• Instant confirmed booking with Token ID</span>
                    <span>• No advance online payment required</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
