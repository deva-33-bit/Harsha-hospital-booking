import { HospitalInfo, Facility, GalleryItem, ReviewItem, Doctor, Service, Schedule, Appointment, NotificationConfig } from '../types';

export const INITIAL_HOSPITAL_INFO: HospitalInfo = {
  name: 'Harsha Hospital',
  category: 'Hospital / Healthcare Facility',
  address: 'Main Road, Behind Siri Residency',
  landmark: 'Behind Siri Residency',
  city: 'Hiriyur',
  district: 'Chitradurga',
  state: 'Karnataka',
  pincode: '577598',
  phone: '+91 97410 49192',
  emergencyPhone: '+91 97410 49192',
  email: 'care@harshahospital.in',
  openingHoursText: 'Monday – Saturday: 24 Hours / Consultation OPD 09:00 AM – 08:00 PM; Sunday: Emergency / On-call',
  is24Hours: true,
  googleMapsUrl: 'https://maps.google.com/?q=13.9376,76.6216',
  coordinates: {
    lat: 13.9376,
    lng: 76.6216,
  },
  rating: 4.3,
  reviewCount: 50,
  heroHeadline: 'Trusted Healthcare, Designed Around You',
  heroSubheadline: 'Access healthcare services and manage your appointments with a simple, convenient digital experience in Hiriyur.',
  noticeBanner: 'Prior online booking is recommended to secure your preferred consultation slot and reduce in-clinic waiting times.',
};

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    title: 'Wheelchair-Accessible Entrance',
    description: 'Ramp and wide door entry engineered for patients with mobility assistance and wheelchair access.',
    iconName: 'Accessibility',
    verified: true,
    category: 'accessibility',
  },
  {
    id: 'fac-2',
    title: 'Wheelchair-Accessible Parking',
    description: 'Designated, priority parking spots directly in front of hospital main gate for effortless entry.',
    iconName: 'Car',
    verified: true,
    category: 'accessibility',
  },
  {
    id: 'fac-3',
    title: 'Outpatient Consultation Chambers',
    description: 'Clean, sanitized consultation rooms designed for patient privacy, thorough check-ups and medical care.',
    iconName: 'Stethoscope',
    verified: true,
    category: 'clinical',
  },
  {
    id: 'fac-4',
    title: 'Patient Waiting & Registration Lounge',
    description: 'Spacious seating area with real-time token calling display to minimize wait time discomfort.',
    iconName: 'Users',
    verified: true,
    category: 'infrastructure',
  },
  {
    id: 'fac-5',
    title: 'Observation & Day-Care Beds',
    description: 'Monitored recovery and observation beds for IV treatments, fluid management, and vital monitoring.',
    iconName: 'Bed',
    verified: true,
    category: 'clinical',
  },
  {
    id: 'fac-6',
    title: 'Round-the-Clock Emergency Reception',
    description: '24-hour telephone assistance and immediate receiving desk on Main Road, Hiriyur.',
    iconName: 'Clock',
    verified: true,
    category: 'amenity',
  },
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Harsha Hospital Exterior Front Façade',
    category: 'exterior',
    imageUrl: 'https://images.openai.com/static-rsc-4/mqLSJII4ia7TKjSyJPqUokzaZlbnIEy1Bh4dnE-yGsvyoS3avBhUyaXOed72VGGovh6RddWC_EMr86tNwV2Q3peY1q-8NQ5ioSm-VpXGuLyczwrQmvs9k0D-9ObYLNm33W4k4OlHK4zQdbGUagUaI6lAsh75IcjktjgE-cD02iGuT6QPTKQexTq8sHheitRo?purpose=fullsize',
    caption: 'Official hospital exterior view on Main Road behind Siri Residency, Hiriyur.',
  },
  {
    id: 'gal-2',
    title: 'Hospital Building & Signage',
    category: 'exterior',
    imageUrl: 'https://images.openai.com/static-rsc-4/WxRGxZ1w0T1sbv_NHq41DgHtx_VCk37bYfskK22Fl1dOtabwU-dreHXBhfDFo_9ATFpW1T0t3YgpioBUida4d-8H5P-bOSO8PhM6XvKN2idh40g8HyBq-jnK_Nxwdv3MnK6be6x29ZnUBJN8tk5oahE6tvYkSSoKCc2zmGvVq8j25G-UGBaUAnPJYsoNJTtf?purpose=fullsize',
    caption: 'Multi-story facility with clear road access and visible signage.',
  },
  {
    id: 'gal-3',
    title: 'Entrance & Consultation Corridor',
    category: 'interior',
    imageUrl: 'https://images.openai.com/static-rsc-4/x_T6V_n-arpOkx3kOx8hmxJf0YlsKipPhDtpSud9DUWvDav_TTiHA3LcUwSsczNZwpx54F6BAdyHvQpmVnjAObjAI_tQ5iBhEOsDa8gAZyl1fNncoNOOw3gtU8k26na5z_phKy0BlBjaGg7vhvqPXNlQShP1R47zb08MfJnCVHtMtfnSC1OTuwdV2PFeFqdH?purpose=fullsize',
    caption: 'Wheelchair-friendly accessible entrance corridor and patient check-in area.',
  },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Verified Hiriyur Resident',
    rating: 5,
    text: 'Clean premises, good hygiene maintenance and polite staff during our consultation. Very thankful to have a dependable hospital on Main Road.',
    source: 'Review from Justdial listing (4.3★ overall)',
    date: 'Recent verified visit',
  },
  {
    id: 'rev-2',
    author: 'Patient Attendant',
    rating: 4,
    text: 'Helpful doctors and caring nursing staff. Would definitely recommend booking ahead online or arriving early because walk-in wait times can build up during peak evening hours.',
    source: 'Review from Justdial listing (4.3★ overall)',
    date: 'Verified patient review',
  },
  {
    id: 'rev-3',
    author: 'Local Visitor',
    rating: 5,
    text: 'Easy to locate right behind Siri Residency. The dedicated wheelchair access and ground entrance made bringing an elderly family member stress-free.',
    source: 'Review from Justdial listing (4.3★ overall)',
    date: 'Verified patient review',
  },
];

export const INITIAL_NOTIFICATION_CONFIG: NotificationConfig = {
  emailEnabled: true,
  smsEnabled: true,
  whatsappEnabled: true,
  emailProvider: 'Hospital Transactional Mailer (Ready / Test Mode)',
  smsProvider: 'National DLT SMS Gateway (+91 9741049192 Route)',
  whatsappProvider: 'WhatsApp Cloud API Service (Configured / Simulator)',
};

// Initial state strictly conforms to data-integrity rule:
// "Initially show an empty/configurable state such as: 'Doctors and consultation schedules will appear here.' The administrator can later populate the actual doctor information."
export const INITIAL_DOCTORS: Doctor[] = [];
export const INITIAL_SERVICES: Service[] = [];
export const INITIAL_SCHEDULES: Schedule[] = [];
export const INITIAL_APPOINTMENTS: Appointment[] = [];

// Curated Clinical OPD Template that the administrator can activate in 1 click via Admin Settings
export const SAMPLE_OPD_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. H. R. Harsha',
    qualification: 'MBBS, MD (General Medicine)',
    specialization: 'Internal & General Medicine, Fever & Chronic Care',
    department: 'General Medicine',
    bio: 'Dedicated physician with deep experience serving the local Hiriyur and Chitradurga community with preventive healthcare and chronic illness management.',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    consultationFee: 300,
    experienceYears: 14,
    registrationNumber: 'KMC-54219',
    active: true,
  },
  {
    id: 'doc-2',
    name: 'Dr. Kavitha S.',
    qualification: 'MBBS, DGO (Obstetrics & Gynecology)',
    specialization: 'Women Health, Antenatal Care & Maternity',
    department: 'Obstetrics & Gynecology',
    bio: 'Specialist in maternal care, wellness screenings, and reproductive health consultation with patient-first compassion.',
    photoUrl: 'https://images.unsplash.com/photo-1594824813583-b77a7f45c7b3?auto=format&fit=crop&q=80&w=600',
    consultationFee: 350,
    experienceYears: 11,
    registrationNumber: 'KMC-68420',
    active: true,
  },
  {
    id: 'doc-3',
    name: 'Dr. Suresh Kumar B.',
    qualification: 'MBBS, MS (Orthopedics)',
    specialization: 'Bone, Joint Pain & Trauma Care',
    department: 'Orthopedics',
    bio: 'Experienced orthopedic specialist focusing on joint pain, arthritis management, and post-injury rehabilitation.',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    consultationFee: 400,
    experienceYears: 12,
    registrationNumber: 'KMC-61942',
    active: true,
  },
  {
    id: 'doc-4',
    name: 'Dr. Manjunath P.',
    qualification: 'MBBS, DCH (Pediatrics)',
    specialization: 'Child Healthcare & Immunization',
    department: 'Pediatrics',
    bio: 'Caring pediatrician focused on newborn care, pediatric illnesses, routine vaccinations, and child nutrition guidance.',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
    consultationFee: 300,
    experienceYears: 9,
    registrationNumber: 'KMC-73194',
    active: true,
  },
];

export const SAMPLE_OPD_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'General Medical Consultation',
    department: 'General Medicine',
    description: 'Comprehensive evaluation for viral infections, diabetes, hypertension, digestive issues, and overall health checkup.',
    consultationDurationMinutes: 15,
    active: true,
    bookingEnabled: true,
  },
  {
    id: 'srv-2',
    name: 'Orthopedic & Joint Consultation',
    department: 'Orthopedics',
    description: 'Diagnosis and management for back pain, knee arthritis, fractures, sprains, and mobility rehabilitation.',
    consultationDurationMinutes: 20,
    active: true,
    bookingEnabled: true,
  },
  {
    id: 'srv-3',
    name: 'Maternal & Women Healthcare',
    department: 'Obstetrics & Gynecology',
    description: 'Routine antenatal checks, gynecological evaluations, nutritional counseling, and women wellness consultations.',
    consultationDurationMinutes: 20,
    active: true,
    bookingEnabled: true,
  },
  {
    id: 'srv-4',
    name: 'Pediatric & Child Check-up',
    department: 'Pediatrics',
    description: 'Gentle checkups for infants and children, developmental milestone tracking, seasonal infections, and immunization advice.',
    consultationDurationMinutes: 15,
    active: true,
    bookingEnabled: true,
  },
  {
    id: 'srv-5',
    name: 'Post-Trauma Wound Dressing & Care',
    department: 'Emergency & Day Care',
    description: 'Antiseptic cleaning, sterile suturing inspection, dressing changes, and minor outpatient procedures.',
    consultationDurationMinutes: 15,
    active: true,
    bookingEnabled: true,
  },
];

export const SAMPLE_OPD_SCHEDULES: Schedule[] = [
  // Dr. Harsha: Mon-Sat 09:00 - 13:00, 17:00 - 20:00
  { id: 'sch-1', doctorId: 'doc-1', day: 'Monday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-2', doctorId: 'doc-1', day: 'Monday', startTime: '17:00', endTime: '20:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-3', doctorId: 'doc-1', day: 'Tuesday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-4', doctorId: 'doc-1', day: 'Tuesday', startTime: '17:00', endTime: '20:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-5', doctorId: 'doc-1', day: 'Wednesday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-6', doctorId: 'doc-1', day: 'Wednesday', startTime: '17:00', endTime: '20:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-7', doctorId: 'doc-1', day: 'Thursday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-8', doctorId: 'doc-1', day: 'Thursday', startTime: '17:00', endTime: '20:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-9', doctorId: 'doc-1', day: 'Friday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-10', doctorId: 'doc-1', day: 'Friday', startTime: '17:00', endTime: '20:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-11', doctorId: 'doc-1', day: 'Saturday', startTime: '09:00', endTime: '14:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },

  // Dr. Kavitha: Mon, Wed, Fri, Sat
  { id: 'sch-12', doctorId: 'doc-2', day: 'Monday', startTime: '10:00', endTime: '14:00', slotDurationMinutes: 20, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-13', doctorId: 'doc-2', day: 'Wednesday', startTime: '10:00', endTime: '14:00', slotDurationMinutes: 20, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-14', doctorId: 'doc-2', day: 'Friday', startTime: '10:00', endTime: '14:00', slotDurationMinutes: 20, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-15', doctorId: 'doc-2', day: 'Saturday', startTime: '10:00', endTime: '13:00', slotDurationMinutes: 20, maxPatientsPerSlot: 1, active: true },

  // Dr. Suresh: Tue, Thu, Sat
  { id: 'sch-16', doctorId: 'doc-3', day: 'Tuesday', startTime: '11:00', endTime: '16:00', slotDurationMinutes: 20, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-17', doctorId: 'doc-3', day: 'Thursday', startTime: '11:00', endTime: '16:00', slotDurationMinutes: 20, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-18', doctorId: 'doc-3', day: 'Saturday', startTime: '14:00', endTime: '18:00', slotDurationMinutes: 20, maxPatientsPerSlot: 1, active: true },

  // Dr. Manjunath: Mon - Sat
  { id: 'sch-19', doctorId: 'doc-4', day: 'Monday', startTime: '09:30', endTime: '13:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-20', doctorId: 'doc-4', day: 'Tuesday', startTime: '09:30', endTime: '13:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-21', doctorId: 'doc-4', day: 'Wednesday', startTime: '09:30', endTime: '13:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-22', doctorId: 'doc-4', day: 'Thursday', startTime: '09:30', endTime: '13:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-23', doctorId: 'doc-4', day: 'Friday', startTime: '09:30', endTime: '13:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
  { id: 'sch-24', doctorId: 'doc-4', day: 'Saturday', startTime: '09:30', endTime: '13:00', slotDurationMinutes: 15, maxPatientsPerSlot: 1, active: true },
];

export const SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-demo-1',
    appointmentNumber: 'HH-2026-1042',
    doctorId: 'doc-1',
    serviceId: 'srv-1',
    department: 'General Medicine',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointmentTime: '10:00',
    patientName: 'Ramesh Gowda',
    phone: '+91 98450 12345',
    email: 'ramesh.gowda@example.com',
    age: 48,
    gender: 'Male',
    reason: 'Routine checkup for seasonal fever & blood pressure review',
    status: 'Confirmed',
    tokenNumber: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'apt-demo-2',
    appointmentNumber: 'HH-2026-1043',
    doctorId: 'doc-2',
    serviceId: 'srv-3',
    department: 'Obstetrics & Gynecology',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointmentTime: '11:20',
    patientName: 'Deepa Nayak',
    phone: '+91 97412 88990',
    email: 'deepa.n@example.com',
    age: 29,
    gender: 'Female',
    reason: 'Monthly antenatal consultation & ultrasound report discussion',
    status: 'Pending',
    tokenNumber: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
