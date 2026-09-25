import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  HospitalInfo,
  Doctor,
  Service,
  Schedule,
  Appointment,
  Facility,
  GalleryItem,
  ReviewItem,
  User,
  AppointmentStatus,
  DayOfWeek,
  NotificationConfig,
  NotificationLog,
} from '../types';
import {
  INITIAL_HOSPITAL_INFO,
  INITIAL_FACILITIES,
  INITIAL_GALLERY,
  INITIAL_REVIEWS,
  INITIAL_DOCTORS,
  INITIAL_SERVICES,
  INITIAL_SCHEDULES,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATION_CONFIG,
  SAMPLE_OPD_DOCTORS,
  SAMPLE_OPD_SERVICES,
  SAMPLE_OPD_SCHEDULES,
  SAMPLE_APPOINTMENTS,
} from '../data/initialData';

interface BookingPayload {
  doctorId: string;
  serviceId?: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  phone: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  reason: string;
  notes?: string;
}

interface HospitalContextType {
  hospitalInfo: HospitalInfo;
  updateHospitalInfo: (info: Partial<HospitalInfo>) => void;
  doctors: Doctor[];
  addDoctor: (doc: Omit<Doctor, 'id'>) => Doctor;
  updateDoctor: (id: string, doc: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  services: Service[];
  addService: (srv: Omit<Service, 'id'>) => Service;
  updateService: (id: string, srv: Partial<Service>) => void;
  deleteService: (id: string) => void;
  schedules: Schedule[];
  addSchedule: (sch: Omit<Schedule, 'id'>) => Schedule;
  updateSchedule: (id: string, sch: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  appointments: Appointment[];
  createAppointment: (payload: BookingPayload) => { success: boolean; appointment?: Appointment; error?: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, date: string, time: string) => { success: boolean; error?: string };
  cancelAppointment: (id: string, reason?: string) => void;
  facilities: Facility[];
  addFacility: (fac: Omit<Facility, 'id'>) => Facility;
  deleteFacility: (id: string) => void;
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => GalleryItem;
  deleteGalleryItem: (id: string) => void;
  reviews: ReviewItem[];
  currentUser: User | null;
  login: (emailOrPhone: string, role?: 'patient' | 'admin', name?: string) => User;
  register: (name: string, email: string, phone: string) => User;
  logout: () => void;
  notificationConfig: NotificationConfig;
  updateNotificationConfig: (cfg: Partial<NotificationConfig>) => void;
  notificationLogs: NotificationLog[];
  activePage: string;
  setActivePage: (page: string) => void;
  selectedDoctorIdForBooking: string | null;
  setSelectedDoctorIdForBooking: (id: string | null) => void;
  selectedServiceIdForBooking: string | null;
  setSelectedServiceIdForBooking: (id: string | null) => void;
  lastBookedAppointment: Appointment | null;
  setLastBookedAppointment: (apt: Appointment | null) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register' | 'admin';
  setAuthModalMode: (mode: 'login' | 'register' | 'admin') => void;
  showAppointmentSlipModal: Appointment | null;
  setShowAppointmentSlipModal: (apt: Appointment | null) => void;
  getAvailableSlots: (doctorId: string, dateStr: string) => { time: string; available: boolean; reason?: string }[];
  seedSampleData: () => void;
  clearToVerifiedOnly: () => void;
  hasLoadedDemoData: boolean;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'harsha_hospital_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

const DAYS_MAP: Record<number, DayOfWeek> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo>(() => getStored('info', INITIAL_HOSPITAL_INFO));
  const [doctors, setDoctors] = useState<Doctor[]>(() => getStored('doctors', INITIAL_DOCTORS));
  const [services, setServices] = useState<Service[]>(() => getStored('services', INITIAL_SERVICES));
  const [schedules, setSchedules] = useState<Schedule[]>(() => getStored('schedules', INITIAL_SCHEDULES));
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStored('appointments', INITIAL_APPOINTMENTS));
  const [facilities, setFacilities] = useState<Facility[]>(() => getStored('facilities', INITIAL_FACILITIES));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => getStored('gallery', INITIAL_GALLERY));
  const [reviews] = useState<ReviewItem[]>(() => getStored('reviews', INITIAL_REVIEWS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored('user', null));
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>(() =>
    getStored('notif_config', INITIAL_NOTIFICATION_CONFIG)
  );
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => getStored('notif_logs', []));

  const [activePage, setActivePage] = useState<string>('home');
  const [selectedDoctorIdForBooking, setSelectedDoctorIdForBooking] = useState<string | null>(null);
  const [selectedServiceIdForBooking, setSelectedServiceIdForBooking] = useState<string | null>(null);
  const [lastBookedAppointment, setLastBookedAppointment] = useState<Appointment | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin'>('login');
  const [showAppointmentSlipModal, setShowAppointmentSlipModal] = useState<Appointment | null>(null);
  const [hasLoadedDemoData, setHasLoadedDemoData] = useState<boolean>(() => getStored('has_demo_data', false));

  // Sync to localStorage
  useEffect(() => setStored('info', hospitalInfo), [hospitalInfo]);
  useEffect(() => setStored('doctors', doctors), [doctors]);
  useEffect(() => setStored('services', services), [services]);
  useEffect(() => setStored('schedules', schedules), [schedules]);
  useEffect(() => setStored('appointments', appointments), [appointments]);
  useEffect(() => setStored('facilities', facilities), [facilities]);
  useEffect(() => setStored('gallery', gallery), [gallery]);
  useEffect(() => setStored('user', currentUser), [currentUser]);
  useEffect(() => setStored('notif_config', notificationConfig), [notificationConfig]);
  useEffect(() => setStored('notif_logs', notificationLogs), [notificationLogs]);
  useEffect(() => setStored('has_demo_data', hasLoadedDemoData), [hasLoadedDemoData]);

  const updateHospitalInfo = (info: Partial<HospitalInfo>) => {
    setHospitalInfo((prev) => ({ ...prev, ...info }));
  };

  const addDoctor = (doc: Omit<Doctor, 'id'>): Doctor => {
    const newDoc: Doctor = {
      ...doc,
      id: 'doc-' + Date.now(),
    };
    setDoctors((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const updateDoctor = (id: string, doc: Partial<Doctor>) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...doc } : d)));
  };

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    setSchedules((prev) => prev.filter((s) => s.doctorId !== id));
  };

  const addService = (srv: Omit<Service, 'id'>): Service => {
    const newSrv: Service = {
      ...srv,
      id: 'srv-' + Date.now(),
    };
    setServices((prev) => [newSrv, ...prev]);
    return newSrv;
  };

  const updateService = (id: string, srv: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...srv } : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const addSchedule = (sch: Omit<Schedule, 'id'>): Schedule => {
    const newSch: Schedule = {
      ...sch,
      id: 'sch-' + Date.now(),
    };
    setSchedules((prev) => [...prev, newSch]);
    return newSch;
  };

  const updateSchedule = (id: string, sch: Partial<Schedule>) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...sch } : s)));
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const addFacility = (fac: Omit<Facility, 'id'>): Facility => {
    const newFac: Facility = {
      ...fac,
      id: 'fac-' + Date.now(),
    };
    setFacilities((prev) => [...prev, newFac]);
    return newFac;
  };

  const deleteFacility = (id: string) => {
    setFacilities((prev) => prev.filter((f) => f.id !== id));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>): GalleryItem => {
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now(),
    };
    setGallery((prev) => [newItem, ...prev]);
    return newItem;
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  const updateNotificationConfig = (cfg: Partial<NotificationConfig>) => {
    setNotificationConfig((prev) => ({ ...prev, ...cfg }));
  };

  // Calculate available slots dynamically based on doctor schedules and existing bookings
  const getAvailableSlots = (doctorId: string, dateStr: string) => {
    if (!doctorId || !dateStr) return [];

    // Parse date and day of week
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = DAYS_MAP[dateObj.getDay()];

    // Doctor schedules for this day
    const doctorSchedules = schedules.filter(
      (s) => s.doctorId === doctorId && s.day === dayOfWeek && s.active
    );

    if (doctorSchedules.length === 0) {
      // Doctor does not consult on this day
      return [];
    }

    const slots: { time: string; available: boolean; reason?: string }[] = [];

    // Generate slots for each schedule window
    for (const schedule of doctorSchedules) {
      const [startH, startM] = schedule.startTime.split(':').map(Number);
      const [endH, endM] = schedule.endTime.split(':').map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const step = schedule.slotDurationMinutes || 15;

      for (let m = startMinutes; m < endMinutes; m += step) {
        const slotH = Math.floor(m / 60);
        const slotM = m % 60;
        const timeStr = `${String(slotH).padStart(2, '0')}:${String(slotM).padStart(2, '0')}`;

        // Check if slot already booked by confirmed/pending appointment
        const existingBookings = appointments.filter(
          (apt) =>
            apt.doctorId === doctorId &&
            apt.appointmentDate === dateStr &&
            apt.appointmentTime === timeStr &&
            apt.status !== 'Cancelled'
        );

        const isPastSlot = isSlotInPast(dateStr, timeStr);
        const maxPatients = schedule.maxPatientsPerSlot || 1;
        const isFull = existingBookings.length >= maxPatients;

        let available = true;
        let reason: string | undefined;

        if (isPastSlot) {
          available = false;
          reason = 'Time has passed';
        } else if (isFull) {
          available = false;
          reason = 'Booked';
        }

        slots.push({
          time: timeStr,
          available,
          reason,
        });
      }
    }

    // Sort slots chronologically
    return slots.sort((a, b) => a.time.localeCompare(b.time));
  };

  const isSlotInPast = (dateStr: string, timeStr: string): boolean => {
    const slotDateTime = new Date(`${dateStr}T${timeStr}:00`);
    return slotDateTime.getTime() <= Date.now();
  };

  // Appointment creation with strict double-booking check & token allocation
  const createAppointment = (payload: BookingPayload) => {
    // 1. Double booking check
    const isBooked = appointments.some(
      (apt) =>
        apt.doctorId === payload.doctorId &&
        apt.appointmentDate === payload.appointmentDate &&
        apt.appointmentTime === payload.appointmentTime &&
        apt.status !== 'Cancelled'
    );

    if (isBooked) {
      return {
        success: false,
        error: 'This consultation slot has just been reserved. Please select another convenient time slot.',
      };
    }

    // 2. Compute token number for this doctor and date
    const sameDayAppointments = appointments.filter(
      (apt) =>
        apt.doctorId === payload.doctorId &&
        apt.appointmentDate === payload.appointmentDate &&
        apt.status !== 'Cancelled'
    );
    const tokenNumber = sameDayAppointments.length + 1;

    // 3. Generate unique appointment number: HH-YYYY-RANDOM
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const appointmentNumber = `HH-${new Date().getFullYear()}-${randomSuffix}`;

    const newAppointment: Appointment = {
      ...payload,
      id: 'apt-' + Date.now(),
      appointmentNumber,
      tokenNumber,
      patientId: currentUser?.id,
      status: 'Confirmed', // Instant confirmed booking as requested
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setLastBookedAppointment(newAppointment);

    // Simulate multi-channel notification dispatch
    const doctorObj = doctors.find((d) => d.id === payload.doctorId);
    const doctorName = doctorObj ? doctorObj.name : 'Hospital Physician';

    if (notificationConfig.smsEnabled) {
      const smsLog: NotificationLog = {
        id: 'notif-sms-' + Date.now(),
        appointmentId: newAppointment.id,
        channel: 'SMS',
        recipient: payload.phone,
        message: `[Harsha Hospital] Confirmed! Ref #${newAppointment.appointmentNumber}. Token: #${tokenNumber}. ${doctorName} on ${payload.appointmentDate} at ${payload.appointmentTime}. Main Rd, Hiriyur. Helpline: +919741049192.`,
        status: 'Sent',
        timestamp: new Date().toLocaleTimeString(),
      };
      setNotificationLogs((prev) => [smsLog, ...prev]);
    }

    if (notificationConfig.whatsappEnabled) {
      const waLog: NotificationLog = {
        id: 'notif-wa-' + Date.now(),
        appointmentId: newAppointment.id,
        channel: 'WhatsApp',
        recipient: payload.phone,
        message: `🏥 *Harsha Hospital, Hiriyur*\nAppointment Confirmed!\n• *Patient:* ${payload.patientName}\n• *Doctor:* ${doctorName} (${payload.department})\n• *Date & Time:* ${payload.appointmentDate} at ${payload.appointmentTime}\n• *Token Number:* #${tokenNumber}\n• *Location:* Main Road, Behind Siri Residency, Hiriyur.\nEmergency/Desk: +91 97410 49192`,
        status: 'Delivered',
        timestamp: new Date().toLocaleTimeString(),
      };
      setNotificationLogs((prev) => [waLog, ...prev]);
    }

    return {
      success: true,
      appointment: newAppointment,
    };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status, updatedAt: new Date().toISOString() } : apt
      )
    );
  };

  const rescheduleAppointment = (id: string, date: string, time: string) => {
    const existing = appointments.find((a) => a.id === id);
    if (!existing) return { success: false, error: 'Appointment not found' };

    // Check if new slot occupied
    const isBooked = appointments.some(
      (apt) =>
        apt.id !== id &&
        apt.doctorId === existing.doctorId &&
        apt.appointmentDate === date &&
        apt.appointmentTime === time &&
        apt.status !== 'Cancelled'
    );

    if (isBooked) {
      return { success: false, error: 'The selected slot is already booked. Please choose another.' };
    }

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              appointmentDate: date,
              appointmentTime: time,
              status: 'Confirmed',
              updatedAt: new Date().toISOString(),
            }
          : apt
      )
    );

    return { success: true };
  };

  const cancelAppointment = (id: string, reason?: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              status: 'Cancelled',
              notes: reason ? `${apt.notes ? apt.notes + ' | ' : ''}Cancellation reason: ${reason}` : apt.notes,
              updatedAt: new Date().toISOString(),
            }
          : apt
      )
    );
  };

  // Auth operations
  const login = (emailOrPhone: string, role: 'patient' | 'admin' = 'patient', name?: string): User => {
    const user: User = {
      id: 'usr-' + Date.now(),
      name: name || (role === 'admin' ? 'Hospital Administrator' : 'Patient'),
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@patient.harshahospital.in`,
      phone: emailOrPhone.startsWith('+') || /^\d+$/.test(emailOrPhone) ? emailOrPhone : '+91 97410 49192',
      role,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    return user;
  };

  const register = (name: string, email: string, phone: string): User => {
    const user: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone,
      role: 'patient',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Demo Clinical Data Seeder / Reset
  const seedSampleData = () => {
    setDoctors(SAMPLE_OPD_DOCTORS);
    setServices(SAMPLE_OPD_SERVICES);
    setSchedules(SAMPLE_OPD_SCHEDULES);
    setAppointments(SAMPLE_APPOINTMENTS);
    setHasLoadedDemoData(true);
  };

  const clearToVerifiedOnly = () => {
    setDoctors([]);
    setServices([]);
    setSchedules([]);
    setAppointments([]);
    setHasLoadedDemoData(false);
  };

  return (
    <HospitalContext.Provider
      value={{
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
        createAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        cancelAppointment,
        facilities,
        addFacility,
        deleteFacility,
        gallery,
        addGalleryItem,
        deleteGalleryItem,
        reviews,
        currentUser,
        login,
        register,
        logout,
        notificationConfig,
        updateNotificationConfig,
        notificationLogs,
        activePage,
        setActivePage,
        selectedDoctorIdForBooking,
        setSelectedDoctorIdForBooking,
        selectedServiceIdForBooking,
        setSelectedServiceIdForBooking,
        lastBookedAppointment,
        setLastBookedAppointment,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
        showAppointmentSlipModal,
        setShowAppointmentSlipModal,
        getAvailableSlots,
        seedSampleData,
        clearToVerifiedOnly,
        hasLoadedDemoData,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
