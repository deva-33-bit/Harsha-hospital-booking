import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Stethoscope,
  Activity,
  Image as ImageIcon,
  Building,
  Settings,
  Printer,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Appointment, Doctor, Service, Schedule, Facility, GalleryItem, AppointmentStatus, DayOfWeek } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    hospitalInfo,
    updateHospitalInfo,
    doctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    services,
    addService,
    updateService,
    deleteService,
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    appointments,
    updateAppointmentStatus,
    rescheduleAppointment,
    cancelAppointment,
    facilities,
    addFacility,
    deleteFacility,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    currentUser,
    login,
    notificationConfig,
    updateNotificationConfig,
    notificationLogs,
    seedSampleData,
    clearToVerifiedOnly,
    hasLoadedDemoData,
    setShowAppointmentSlipModal,
    setActivePage,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'calendar' | 'doctors' | 'services' | 'schedules' | 'facilities' | 'gallery' | 'settings'
  >('overview');

  // Filters for Appointments
  const [aptSearch, setAptSearch] = useState('');
  const [aptStatusFilter, setAptStatusFilter] = useState<string>('all');
  const [aptDoctorFilter, setAptDoctorFilter] = useState<string>('all');
  const [aptDateFilter, setAptDateFilter] = useState<string>('');

  // Modals for CRUD
  const [showDoctorModal, setShowDoctorModal] = useState<Doctor | null | 'new'>(null);
  const [showServiceModal, setShowServiceModal] = useState<Service | null | 'new'>(null);
  const [showScheduleModal, setShowScheduleModal] = useState<Schedule | null | 'new'>(null);
  const [showFacilityModal, setShowFacilityModal] = useState<Facility | null | 'new'>(null);
  const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);

  // Calendar View mode
  const [calendarMode, setCalendarMode] = useState<'day' | 'week' | 'month'>('week');
  const [calendarAnchorDate, setCalendarAnchorDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Forms state
  const [docFormData, setDocFormData] = useState<Omit<Doctor, 'id'>>({
    name: '',
    qualification: '',
    specialization: '',
    department: 'General Medicine',
    bio: '',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    consultationFee: 300,
    experienceYears: 5,
    registrationNumber: '',
    active: true,
  });

  const [srvFormData, setSrvFormData] = useState<Omit<Service, 'id'>>({
    name: '',
    department: 'General Medicine',
    description: '',
    consultationDurationMinutes: 15,
    active: true,
    bookingEnabled: true,
  });

  const [schFormData, setSchFormData] = useState<Omit<Schedule, 'id'>>({
    doctorId: doctors[0]?.id || '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '13:00',
    slotDurationMinutes: 15,
    maxPatientsPerSlot: 1,
    active: true,
  });

  const [facFormData, setFacFormData] = useState<Omit<Facility, 'id'>>({
    title: '',
    description: '',
    iconName: 'Building',
    verified: true,
    category: 'clinical',
  });

  const [galFormData, setGalFormData] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    category: 'facilities',
    imageUrl: '',
    caption: '',
  });

  // Admin access protection check: auto-escalate if currentUser is not admin
  const isAdmin = currentUser?.role === 'admin';

  const todayStr = new Date().toISOString().split('T')[0];

  // Dashboard Overview Metrics
  const stats = useMemo(() => {
    const todayApts = appointments.filter((a) => a.appointmentDate === todayStr);
    const pending = appointments.filter((a) => a.status === 'Pending').length;
    const confirmed = appointments.filter((a) => a.status === 'Confirmed').length;
    const completed = appointments.filter((a) => a.status === 'Completed').length;
    const cancelled = appointments.filter((a) => a.status === 'Cancelled').length;

    // Unique patients by phone or email
    const uniquePatients = new Set(appointments.map((a) => a.phone || a.email)).size;

    return {
      todayTotal: todayApts.length,
      pending,
      confirmed,
      completed,
      cancelled,
      uniquePatients: Math.max(uniquePatients, 0),
    };
  }, [appointments, todayStr]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchSearch =
        !aptSearch ||
        a.patientName.toLowerCase().includes(aptSearch.toLowerCase()) ||
        a.appointmentNumber.toLowerCase().includes(aptSearch.toLowerCase()) ||
        a.phone.includes(aptSearch);

      const matchStatus = aptStatusFilter === 'all' || a.status === aptStatusFilter;
      const matchDoctor = aptDoctorFilter === 'all' || a.doctorId === aptDoctorFilter;
      const matchDate = !aptDateFilter || a.appointmentDate === aptDateFilter;

      return matchSearch && matchStatus && matchDoctor && matchDate;
    });
  }, [appointments, aptSearch, aptStatusFilter, aptDoctorFilter, aptDateFilter]);

  if (!isAdmin) {
    return (
      <div className="py-20 px-4 max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Hospital Administrator Portal</h2>
        <p className="text-xs text-slate-600 mb-6">
          Access to Harsha Hospital configuration, doctor rosters, patient records, and schedules is restricted to authorized hospital staff.
        </p>
        <button
          onClick={() => {
            login('admin@harshahospital.in', 'admin', 'Hospital Administrator');
          }}
          className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-colors"
        >
          Sign In as Hospital Administrator
        </button>
      </div>
    );
  }

  // Doctor CRUD handler
  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (showDoctorModal === 'new') {
      addDoctor(docFormData);
    } else if (showDoctorModal && typeof showDoctorModal === 'object') {
      updateDoctor(showDoctorModal.id, docFormData);
    }
    setShowDoctorModal(null);
  };

  // Service CRUD handler
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (showServiceModal === 'new') {
      addService(srvFormData);
    } else if (showServiceModal && typeof showServiceModal === 'object') {
      updateService(showServiceModal.id, srvFormData);
    }
    setShowServiceModal(null);
  };

  // Schedule CRUD handler
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (showScheduleModal === 'new') {
      addSchedule(schFormData);
    } else if (showScheduleModal && typeof showScheduleModal === 'object') {
      updateSchedule(showScheduleModal.id, schFormData);
    }
    setShowScheduleModal(null);
  };

  // Facility CRUD handler
  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    addFacility(facFormData);
    setShowFacilityModal(null);
  };

  // Gallery CRUD handler
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galFormData.imageUrl) return;
    addGalleryItem(galFormData);
    setShowGalleryModal(false);
  };

  return (
    <div className="py-6 lg:py-10 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Top Admin Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">Hospital Administration</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                  Harsha Hospital
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Hiriyur, Chitradurga • Phone: {hospitalInfo.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!hasLoadedDemoData ? (
              <button
                onClick={seedSampleData}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
                title="Populate doctors, schedules and services for instant testing"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample OPD Roster</span>
              </button>
            ) : (
              <button
                onClick={clearToVerifiedOnly}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Reset to blank unconfigured state"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Clean State</span>
              </button>
            )}

            <button
              onClick={() => setActivePage('home')}
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
            >
              Public Site
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 p-1 shadow-2xs overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {[
              { id: 'overview', label: 'Dashboard', icon: Activity },
              { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
              { id: 'calendar', label: 'Calendar Matrix', icon: Clock },
              { id: 'doctors', label: `Doctors (${doctors.length})`, icon: Stethoscope },
              { id: 'services', label: `Services (${services.length})`, icon: Plus },
              { id: 'schedules', label: `Schedules (${schedules.length})`, icon: Users },
              { id: 'facilities', label: `Facilities (${facilities.length})`, icon: Building },
              { id: 'gallery', label: `Gallery (${gallery.length})`, icon: ImageIcon },
              { id: 'settings', label: 'Hospital Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-teal-700 text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Today's Bookings
                </span>
                <span className="text-3xl font-black text-slate-900 mt-1 block">
                  {stats.todayTotal}
                </span>
                <span className="text-[11px] text-teal-700 font-medium">Slots reserved today</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Pending
                </span>
                <span className="text-3xl font-black text-amber-600 mt-1 block">
                  {stats.pending}
                </span>
                <span className="text-[11px] text-slate-500">Awaiting check-in</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Confirmed
                </span>
                <span className="text-3xl font-black text-emerald-600 mt-1 block">
                  {stats.confirmed}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">Active reservations</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Completed
                </span>
                <span className="text-3xl font-black text-slate-900 mt-1 block">
                  {stats.completed}
                </span>
                <span className="text-[11px] text-slate-500">Consultations done</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Patients
                </span>
                <span className="text-3xl font-black text-teal-800 mt-1 block">
                  {stats.uniquePatients}
                </span>
                <span className="text-[11px] text-slate-500">Registered in system</span>
              </div>
            </div>

            {/* Quick Actions & Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">Recent Patient Bookings</h3>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs text-teal-700 font-semibold hover:underline"
                  >
                    View All ({appointments.length})
                  </button>
                </div>

                {appointments.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No appointments booked yet. Bookings will appear in real time.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Token</th>
                          <th className="py-2.5 px-3">Patient</th>
                          <th className="py-2.5 px-3">Doctor</th>
                          <th className="py-2.5 px-3">Date & Time</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {appointments.slice(0, 5).map((apt) => {
                          const doc = doctors.find((d) => d.id === apt.doctorId);
                          return (
                            <tr key={apt.id} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-mono font-bold text-teal-800">
                                #{apt.tokenNumber}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="font-bold text-slate-900 block">{apt.patientName}</span>
                                <span className="text-[11px] text-slate-500">{apt.phone}</span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-700">
                                {doc ? doc.name : 'Attending Doctor'}
                              </td>
                              <td className="py-2.5 px-3">
                                <div>{apt.appointmentDate}</div>
                                <div className="text-slate-500">{apt.appointmentTime}</div>
                              </td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    apt.status === 'Confirmed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : apt.status === 'Completed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : apt.status === 'Cancelled'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {apt.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => setShowAppointmentSlipModal(apt)}
                                  className="p-1 rounded hover:bg-slate-200 text-slate-600"
                                  title="Print Slip"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Notification Simulator Summary */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Notification Gateway</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real-time transactional dispatch simulated for SMS & WhatsApp confirmations sent to patients.
                </p>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notificationLogs.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                      No notifications logged yet. New bookings dispatch SMS/WhatsApp confirmation tokens automatically.
                    </div>
                  ) : (
                    notificationLogs.slice(0, 4).map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-teal-700">{log.channel} Notification</span>
                          <span className="text-slate-400">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-700 line-clamp-2">{log.message}</p>
                        <div className="text-[10px] text-emerald-700 font-medium">
                          Recipient: {log.recipient} ({log.status})
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: APPOINTMENTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-900 text-lg">Appointments Directory</h3>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search patient, token, phone..."
                    value={aptSearch}
                    onChange={(e) => setAptSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 w-48"
                  />
                </div>

                <select
                  value={aptStatusFilter}
                  onChange={(e) => setAptStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={aptDoctorFilter}
                  onChange={(e) => setAptDoctorFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="all">All Doctors</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={aptDateFilter}
                  onChange={(e) => setAptDateFilter(e.target.value)}
                  className="px-2 py-1 text-xs rounded-lg border border-slate-300"
                />

                {(aptSearch || aptStatusFilter !== 'all' || aptDoctorFilter !== 'all' || aptDateFilter) && (
                  <button
                    onClick={() => {
                      setAptSearch('');
                      setAptStatusFilter('all');
                      setAptDoctorFilter('all');
                      setAptDateFilter('');
                    }}
                    className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No appointments match the selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Token & ID</th>
                      <th className="py-3 px-3">Patient Details</th>
                      <th className="py-3 px-3">Doctor & Dept</th>
                      <th className="py-3 px-3">Date & Time</th>
                      <th className="py-3 px-3">Reason</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Status Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.map((apt) => {
                      const doc = doctors.find((d) => d.id === apt.doctorId);
                      return (
                        <tr key={apt.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-teal-800 text-sm block">
                              #{apt.tokenNumber}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              {apt.appointmentNumber}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{apt.patientName}</div>
                            <div className="text-[11px] text-slate-500">
                              {apt.phone} • {apt.age}y/{apt.gender}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800">
                              {doc ? doc.name : 'Consultant'}
                            </div>
                            <div className="text-[11px] text-teal-700">{apt.department}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-800">{apt.appointmentDate}</div>
                            <div className="text-[11px] text-slate-500 font-bold">
                              {apt.appointmentTime}
                            </div>
                          </td>
                          <td className="py-3 px-3 max-w-[150px] truncate text-slate-600" title={apt.reason}>
                            {apt.reason}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                apt.status === 'Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : apt.status === 'Completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : apt.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {apt.status !== 'Confirmed' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                                  className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold"
                                >
                                  Confirm
                                </button>
                              )}
                              {apt.status !== 'Completed' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                                  className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-semibold"
                                >
                                  Complete
                                </button>
                              )}
                              {apt.status !== 'Cancelled' && (
                                <button
                                  onClick={() => cancelAppointment(apt.id, 'Cancelled by Admin')}
                                  className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                onClick={() => setShowAppointmentSlipModal(apt)}
                                className="p-1 rounded hover:bg-slate-200 text-slate-600"
                                title="Print Slip"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CALENDAR MATRIX */}
        {/* ========================================================================= */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Consultation Calendar View</h3>
                <p className="text-xs text-slate-500">
                  Visual distribution of scheduled appointments across doctors.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={calendarAnchorDate}
                  onChange={(e) => setCalendarAnchorDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Matrix View */}
            <div className="space-y-4">
              {doctors.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No doctors configured yet. Add doctors or load the sample roster to view the calendar matrix.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctors.map((doc) => {
                    const docAptsOnDate = appointments.filter(
                      (a) => a.doctorId === doc.id && a.appointmentDate === calendarAnchorDate && a.status !== 'Cancelled'
                    );

                    return (
                      <div
                        key={doc.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.photoUrl}
                            alt={doc.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs">{doc.name}</h4>
                            <span className="text-[11px] text-teal-700">{doc.department}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex justify-between">
                          <span className="text-slate-500">Bookings for {calendarAnchorDate}:</span>
                          <span className="font-bold text-teal-800">
                            {docAptsOnDate.length} Patients
                          </span>
                        </div>

                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {docAptsOnDate.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic block py-2">
                              No consultations scheduled on this date.
                            </span>
                          ) : (
                            docAptsOnDate.map((apt) => (
                              <div
                                key={apt.id}
                                className="p-2 rounded bg-white border border-slate-100 text-[11px] flex justify-between items-center"
                              >
                                <div>
                                  <span className="font-bold text-slate-900 block">
                                    {apt.patientName} (Token #{apt.tokenNumber})
                                  </span>
                                  <span className="text-slate-500">{apt.reason}</span>
                                </div>
                                <span className="font-mono font-bold text-teal-700">
                                  {apt.appointmentTime}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DOCTORS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Hospital Doctors & Consultants</h3>
                <p className="text-xs text-slate-500">
                  Manage active consulting medical practitioners, qualifications, fees, and departments.
                </p>
              </div>

              <button
                onClick={() => {
                  setDocFormData({
                    name: 'Dr. ',
                    qualification: 'MBBS, MD',
                    specialization: 'General Medicine',
                    department: 'General Medicine',
                    bio: 'Physician at Harsha Hospital, Hiriyur.',
                    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
                    consultationFee: 300,
                    experienceYears: 5,
                    registrationNumber: '',
                    active: true,
                  });
                  setShowDoctorModal('new');
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Doctor</span>
              </button>
            </div>

            {doctors.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No doctors registered. Click "Add Doctor" or "Load Sample OPD Roster".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={doc.photoUrl}
                        alt={doc.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h4>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              doc.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {doc.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-xs text-teal-800 font-semibold truncate">{doc.qualification}</p>
                        <p className="text-[11px] text-slate-500 truncate">{doc.department}</p>
                        <p className="text-[11px] font-bold text-slate-700 mt-1">Fee: ₹{doc.consultationFee}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setDocFormData({ ...doc });
                          setShowDoctorModal(doc);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3 text-teal-600" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteDoctor(doc.id)}
                        className="px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SERVICES MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Clinical Services & OPD Categories</h3>
                <p className="text-xs text-slate-500">
                  Configure clinical services, outpatient departments, and booking availability.
                </p>
              </div>

              <button
                onClick={() => {
                  setSrvFormData({
                    name: '',
                    department: 'General Medicine',
                    description: '',
                    consultationDurationMinutes: 15,
                    active: true,
                    bookingEnabled: true,
                  });
                  setShowServiceModal('new');
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            {services.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No services added. Click "Add Service" or "Load Sample OPD Roster".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-teal-800 uppercase">
                          {srv.department}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            srv.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {srv.active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{srv.name}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">{srv.description}</p>
                      <span className="text-[11px] text-slate-500 block mt-2">
                        Duration: {srv.consultationDurationMinutes} mins
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSrvFormData({ ...srv });
                          setShowServiceModal(srv);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3 text-teal-600" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteService(srv.id)}
                        className="px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SCHEDULES MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'schedules' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Doctor Consultation Schedules</h3>
                <p className="text-xs text-slate-500">
                  Define daily working shifts, start/end times, and slot durations (15m, 20m, 30m).
                </p>
              </div>

              <button
                onClick={() => {
                  setSchFormData({
                    doctorId: doctors[0]?.id || '',
                    day: 'Monday',
                    startTime: '09:00',
                    endTime: '13:00',
                    slotDurationMinutes: 15,
                    maxPatientsPerSlot: 1,
                    active: true,
                  });
                  setShowScheduleModal('new');
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Consultation Schedule</span>
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No schedules configured. Click "Add Consultation Schedule" or "Load Sample OPD Roster".
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Doctor</th>
                      <th className="py-2.5 px-3">Day of Week</th>
                      <th className="py-2.5 px-3">Start Time</th>
                      <th className="py-2.5 px-3">End Time</th>
                      <th className="py-2.5 px-3">Slot Duration</th>
                      <th className="py-2.5 px-3">Max Patients / Slot</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedules.map((sch) => {
                      const doc = doctors.find((d) => d.id === sch.doctorId);
                      return (
                        <tr key={sch.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {doc ? doc.name : 'Unknown Doctor'}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-teal-800">{sch.day}</td>
                          <td className="py-2.5 px-3 font-mono">{sch.startTime}</td>
                          <td className="py-2.5 px-3 font-mono">{sch.endTime}</td>
                          <td className="py-2.5 px-3">{sch.slotDurationMinutes} Minutes</td>
                          <td className="py-2.5 px-3">{sch.maxPatientsPerSlot} Patient</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => deleteSchedule(sch.id)}
                              className="p-1 rounded text-red-600 hover:bg-red-50"
                              title="Delete Shift"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: FACILITIES MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'facilities' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Hospital Facilities & Infrastructure</h3>
                <p className="text-xs text-slate-500">
                  Verified amenities: Wheelchair accessibility & clinical wards on Main Road, Hiriyur.
                </p>
              </div>

              <button
                onClick={() => {
                  setFacFormData({
                    title: '',
                    description: '',
                    iconName: 'Building',
                    verified: true,
                    category: 'clinical',
                  });
                  setShowFacilityModal('new');
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Facility</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map((fac) => (
                <div
                  key={fac.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-teal-800 uppercase">
                        {fac.category}
                      </span>
                      {fac.verified && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{fac.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{fac.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => deleteFacility(fac.id)}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: GALLERY MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Photo Gallery Management</h3>
                <p className="text-xs text-slate-500">
                  Add or reorder official exterior, interior, and facility photography.
                </p>
              </div>

              <button
                onClick={() => {
                  setGalFormData({
                    title: '',
                    category: 'facilities',
                    imageUrl: '',
                    caption: '',
                  });
                  setShowGalleryModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((g) => (
                <div
                  key={g.id}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 relative group"
                >
                  <img src={g.imageUrl} alt={g.title} className="w-full aspect-4/3 object-cover" />
                  <div className="p-3">
                    <span className="text-[10px] font-bold text-teal-800 uppercase block">
                      {g.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs truncate">{g.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{g.caption}</p>
                    <button
                      onClick={() => deleteGalleryItem(g.id)}
                      className="mt-2 text-xs text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete Image
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: SETTINGS & HOSPITAL CONTENT */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 max-w-4xl">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Hospital Information & Settings</h3>
              <p className="text-xs text-slate-500">
                Modify contact information, working hours, notice banners, and notification gateways.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Name
                </label>
                <input
                  type="text"
                  value={hospitalInfo.name}
                  onChange={(e) => updateHospitalInfo({ name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Direct Contact Number
                </label>
                <input
                  type="text"
                  value={hospitalInfo.phone}
                  onChange={(e) => updateHospitalInfo({ phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Address & Landmark
                </label>
                <input
                  type="text"
                  value={hospitalInfo.address}
                  onChange={(e) => updateHospitalInfo({ address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Hours Specification
                </label>
                <input
                  type="text"
                  value={hospitalInfo.openingHoursText}
                  onChange={(e) => updateHospitalInfo({ openingHoursText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Waiting Time Notice Banner
                </label>
                <input
                  type="text"
                  value={hospitalInfo.noticeBanner || ''}
                  onChange={(e) => updateHospitalInfo({ noticeBanner: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Notification Gateway Settings */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Notification Gateways</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">SMS Gateway</span>
                    <input
                      type="checkbox"
                      checked={notificationConfig.smsEnabled}
                      onChange={(e) => updateNotificationConfig({ smsEnabled: e.target.checked })}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{notificationConfig.smsProvider}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">WhatsApp Gateway</span>
                    <input
                      type="checkbox"
                      checked={notificationConfig.whatsappEnabled}
                      onChange={(e) =>
                        updateNotificationConfig({ whatsappEnabled: e.target.checked })
                      }
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{notificationConfig.whatsappProvider}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Doctor Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {showDoctorModal === 'new' ? 'Add New Consulting Doctor' : 'Edit Doctor Information'}
            </h3>
            <form onSubmit={handleSaveDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={docFormData.name}
                  onChange={(e) => setDocFormData({ ...docFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qualifications *</label>
                  <input
                    type="text"
                    required
                    placeholder="MBBS, MD..."
                    value={docFormData.qualification}
                    onChange={(e) =>
                      setDocFormData({ ...docFormData, qualification: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={docFormData.department}
                    onChange={(e) =>
                      setDocFormData({ ...docFormData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization Focus *</label>
                <input
                  type="text"
                  required
                  value={docFormData.specialization}
                  onChange={(e) =>
                    setDocFormData({ ...docFormData, specialization: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Consultation Fee (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={docFormData.consultationFee}
                    onChange={(e) =>
                      setDocFormData({
                        ...docFormData,
                        consultationFee: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={docFormData.experienceYears}
                    onChange={(e) =>
                      setDocFormData({
                        ...docFormData,
                        experienceYears: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={docFormData.photoUrl}
                  onChange={(e) => setDocFormData({ ...docFormData, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  value={docFormData.bio}
                  onChange={(e) => setDocFormData({ ...docFormData, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="doc-active"
                  checked={docFormData.active}
                  onChange={(e) => setDocFormData({ ...docFormData, active: e.target.checked })}
                />
                <label htmlFor="doc-active" className="font-semibold text-slate-700">
                  Active (Available for appointments)
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setShowDoctorModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {showServiceModal === 'new' ? 'Add Clinical Service' : 'Edit Service'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={srvFormData.name}
                  onChange={(e) => setSrvFormData({ ...srvFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                <input
                  type="text"
                  required
                  value={srvFormData.department}
                  onChange={(e) => setSrvFormData({ ...srvFormData, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={srvFormData.description}
                  onChange={(e) => setSrvFormData({ ...srvFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={srvFormData.consultationDurationMinutes}
                  onChange={(e) =>
                    setSrvFormData({
                      ...srvFormData,
                      consultationDurationMinutes: parseInt(e.target.value, 10) || 15,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="srv-booking"
                  checked={srvFormData.bookingEnabled}
                  onChange={(e) =>
                    setSrvFormData({ ...srvFormData, bookingEnabled: e.target.checked })
                  }
                />
                <label htmlFor="srv-booking" className="font-semibold text-slate-700">
                  Enable Online Appointment Booking
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Service
                </button>
                <button
                  type="button"
                  onClick={() => setShowServiceModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Configure Doctor Schedule</h3>
            <form onSubmit={handleSaveSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Doctor *</label>
                <select
                  required
                  value={schFormData.doctorId}
                  onChange={(e) => setSchFormData({ ...schFormData, doctorId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Day of Week *</label>
                <select
                  value={schFormData.day}
                  onChange={(e) =>
                    setSchFormData({ ...schFormData, day: e.target.value as DayOfWeek })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                    (d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time (24h) *</label>
                  <input
                    type="time"
                    required
                    value={schFormData.startTime}
                    onChange={(e) => setSchFormData({ ...schFormData, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time (24h) *</label>
                  <input
                    type="time"
                    required
                    value={schFormData.endTime}
                    onChange={(e) => setSchFormData({ ...schFormData, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slot Duration</label>
                  <select
                    value={schFormData.slotDurationMinutes}
                    onChange={(e) =>
                      setSchFormData({
                        ...schFormData,
                        slotDurationMinutes: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={20}>20 Minutes</option>
                    <option value={30}>30 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Patients / Slot</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={schFormData.maxPatientsPerSlot}
                    onChange={(e) =>
                      setSchFormData({
                        ...schFormData,
                        maxPatientsPerSlot: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Shift
                </button>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Facility Modal */}
      {showFacilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Verified Facility</h3>
            <form onSubmit={handleSaveFacility} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Facility Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wheelchair Ramp Entrance..."
                  value={facFormData.title}
                  onChange={(e) => setFacFormData({ ...facFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={facFormData.description}
                  onChange={(e) => setFacFormData({ ...facFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={facFormData.category}
                  onChange={(e) =>
                    setFacFormData({ ...facFormData, category: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="accessibility">Accessibility</option>
                  <option value="clinical">Clinical</option>
                  <option value="amenity">Amenity</option>
                  <option value="infrastructure">Infrastructure</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Add Facility
                </button>
                <button
                  type="button"
                  onClick={() => setShowFacilityModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Photo to Hospital Gallery</h3>
            <form onSubmit={handleSaveGallery} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={galFormData.title}
                  onChange={(e) => setGalFormData({ ...galFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={galFormData.imageUrl}
                  onChange={(e) => setGalFormData({ ...galFormData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={galFormData.category}
                  onChange={(e) =>
                    setGalFormData({ ...galFormData, category: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="exterior">Exterior</option>
                  <option value="interior">Interior</option>
                  <option value="facilities">Facilities</option>
                  <option value="staff">Staff</option>
                  <option value="events">Events</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Caption</label>
                <input
                  type="text"
                  value={galFormData.caption}
                  onChange={(e) => setGalFormData({ ...galFormData, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save to Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
