import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickBookingWidget } from './components/QuickBookingWidget';
import { ServicesSection } from './components/ServicesSection';
import { DoctorsSection } from './components/DoctorsSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { GallerySection } from './components/GallerySection';
import { PatientReviewsSection } from './components/PatientReviewsSection';
import { GoogleMapsSection } from './components/GoogleMapsSection';
import { ContactSection } from './components/ContactSection';
import { AboutSection } from './components/AboutSection';
import { PatientDashboard } from './components/PatientDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { AppointmentSlipModal } from './components/AppointmentSlipModal';
import { AuthModal } from './components/AuthModal';

const MainContent: React.FC = () => {
  const { activePage } = useHospital();

  return (
    <main className="min-h-screen">
      {/* Route: Home Page */}
      {activePage === 'home' && (
        <>
          <Hero />
          <QuickBookingWidget />
          <ServicesSection />
          <DoctorsSection />
          <FacilitiesSection />
          <GallerySection />
          <PatientReviewsSection />
          <GoogleMapsSection />
          <ContactSection />
        </>
      )}

      {/* Route: About Page */}
      {activePage === 'about' && (
        <>
          <AboutSection />
          <FacilitiesSection />
          <GoogleMapsSection />
        </>
      )}

      {/* Route: Services Page */}
      {activePage === 'services' && (
        <>
          <div className="pt-8">
            <ServicesSection />
          </div>
          <QuickBookingWidget />
          <ContactSection />
        </>
      )}

      {/* Route: Doctors Page */}
      {activePage === 'doctors' && (
        <>
          <div className="pt-8">
            <DoctorsSection />
          </div>
          <QuickBookingWidget />
          <ContactSection />
        </>
      )}

      {/* Route: Facilities Page */}
      {activePage === 'facilities' && (
        <>
          <div className="pt-8">
            <FacilitiesSection />
          </div>
          <GallerySection />
          <GoogleMapsSection />
        </>
      )}

      {/* Route: Gallery Page */}
      {activePage === 'gallery' && (
        <>
          <div className="pt-8">
            <GallerySection />
          </div>
          <FacilitiesSection />
        </>
      )}

      {/* Route: Appointments Page */}
      {activePage === 'appointments' && (
        <>
          <div className="pt-4">
            <QuickBookingWidget />
          </div>
          <DoctorsSection />
          <ContactSection />
        </>
      )}

      {/* Route: Contact Page */}
      {activePage === 'contact' && (
        <>
          <div className="pt-6">
            <ContactSection />
          </div>
          <GoogleMapsSection />
        </>
      )}

      {/* Route: Patient Dashboard */}
      {activePage === 'patient-dashboard' && <PatientDashboard />}

      {/* Route: Admin Dashboard */}
      {activePage === 'admin-dashboard' && <AdminDashboard />}
    </main>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        <Navbar />
        <MainContent />
        <Footer />
        <MobileStickyBar />

        {/* Global Modals */}
        <BookingConfirmationModal />
        <AppointmentSlipModal />
        <AuthModal />
      </div>
    </HospitalProvider>
  );
}
