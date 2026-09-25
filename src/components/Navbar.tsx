import React, { useState } from 'react';
import {
  Phone,
  MapPin,
  Calendar,
  Clock,
  Menu,
  X,
  User,
  ShieldCheck,
  HeartPulse,
  Activity,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const Navbar: React.FC = () => {
  const {
    hospitalInfo,
    currentUser,
    login,
    logout,
    activePage,
    setActivePage,
    setShowAuthModal,
    setAuthModalMode,
  } = useHospital();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner: Emergency & Location */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              24/7 Receiving & Medical Assistance
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              Main Road, Behind Siri Residency, Hiriyur, Chitradurga
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 font-semibold text-slate-100 hover:text-teal-300 transition-colors"
              title="Call Harsha Hospital"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              Direct Desk: {hospitalInfo.phone}
            </a>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded text-teal-300 border border-slate-700 transition-colors"
                >
                  <User className="w-3 h-3" />
                  <span className="max-w-[120px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white text-slate-800 rounded-md shadow-lg border border-slate-200 py-1 text-xs z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-700">
                      {currentUser.name}
                      <span className="block font-normal text-[11px] text-slate-500 capitalize">
                        {currentUser.role} Account
                      </span>
                    </div>
                    {currentUser.role === 'admin' ? (
                      <button
                        onClick={() => {
                          setActivePage('admin-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        Admin Dashboard
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setActivePage('patient-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        My Appointments
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-1.5 border-t border-slate-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setShowAuthModal(true);
                  }}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Patient Login
                </button>
                <span className="text-slate-700">•</span>
                <button
                  onClick={() => {
                    login('admin@harshahospital.in', 'admin', 'Hospital Administrator');
                    handleNavClick('admin-dashboard');
                  }}
                  className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Open Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Panel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo and Hospital identity */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-sky-800 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  Harsha Hospital
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  Hiriyur
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Healthcare & Consultation Center</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activePage === item.id
                    ? 'text-teal-700 bg-teal-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => {
                login('admin@harshahospital.in', 'admin', 'Hospital Administrator');
                handleNavClick('admin-dashboard');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activePage === 'admin-dashboard'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title="View and manage appointments in database"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Admin Panel</span>
            </button>

            <a
              href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 text-xs font-medium transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>Call Hospital</span>
            </a>

            <button
              onClick={() => handleNavClick('appointments')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm shadow-teal-600/30 hover:shadow-teal-600/40 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNavClick('appointments')}
              className="sm:hidden px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <a
              href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              Call Hospital
            </a>
            <a
              href={hospitalInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              Get Directions
            </a>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activePage === item.id
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => handleNavClick('appointments')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-teal-600 text-white font-semibold shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              Book Online Appointment
            </button>

            {currentUser ? (
              <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
                <span>Signed in as: <strong className="text-slate-800">{currentUser.name}</strong></span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-600 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center text-xs font-medium text-slate-700 border border-slate-200 rounded-lg"
                >
                  Patient Login
                </button>
                <button
                  onClick={() => {
                    login('admin@harshahospital.in', 'admin', 'Hospital Administrator');
                    handleNavClick('admin-dashboard');
                  }}
                  className="py-2 text-center text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Panel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
