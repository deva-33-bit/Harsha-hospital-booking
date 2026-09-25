export type Role = 'patient' | 'admin' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  department: string;
  bio: string;
  photoUrl: string;
  consultationFee: number;
  experienceYears: number;
  registrationNumber?: string;
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  department: string;
  description: string;
  imageUrl?: string;
  consultationDurationMinutes: number;
  active: boolean;
  bookingEnabled: boolean;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Schedule {
  id: string;
  doctorId: string;
  day: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  slotDurationMinutes: number; // 15, 20, 30
  maxPatientsPerSlot: number;
  active: boolean;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show';

export interface Appointment {
  id: string;
  appointmentNumber: string; // e.g. "HH-2026-0421"
  patientId?: string;
  doctorId: string;
  serviceId?: string;
  department: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM (24-hr or 12-hr)
  patientName: string;
  phone: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  reason: string;
  notes?: string;
  status: AppointmentStatus;
  tokenNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  iconName: string;
  verified: boolean;
  category: 'accessibility' | 'clinical' | 'amenity' | 'infrastructure';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'exterior' | 'interior' | 'facilities' | 'staff' | 'events';
  imageUrl: string;
  caption: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: string; // e.g. "Justdial verified patient"
  date: string;
}

export interface HospitalInfo {
  name: string;
  category: string;
  address: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  openingHoursText: string;
  is24Hours: boolean;
  googleMapsUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  heroHeadline: string;
  heroSubheadline: string;
  noticeBanner?: string;
}

export interface NotificationLog {
  id: string;
  appointmentId: string;
  channel: 'SMS' | 'WhatsApp' | 'Email';
  recipient: string;
  message: string;
  status: 'Sent' | 'Delivered' | 'Configured-Simulator';
  timestamp: string;
}

export interface NotificationConfig {
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  emailProvider: string;
  smsProvider: string;
  whatsappProvider: string;
}
