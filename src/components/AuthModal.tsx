import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    setActivePage,
  } = useHospital();

  const [mode, setMode] = useState<'login' | 'register' | 'admin'>(authModalMode);

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!showAuthModal) return null;

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!emailOrPhone.trim()) {
      setError('Please provide your mobile number or email address');
      return;
    }

    login(emailOrPhone.trim(), 'patient');
    setShowAuthModal(false);
    setActivePage('patient-dashboard');
  };

  const handlePatientRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError('Please fill in all registration fields');
      return;
    }

    register(name.trim(), email.trim(), phone.trim());
    setShowAuthModal(false);
    setActivePage('patient-dashboard');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    login('admin@harshahospital.in', 'admin', 'Hospital Administrator');
    setShowAuthModal(false);
    setActivePage('admin-dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center mx-auto mb-2 text-white font-bold">
            {mode === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          <h3 className="text-xl font-bold">
            {mode === 'admin' ? 'Hospital Admin Login' : mode === 'register' ? 'New Patient Registration' : 'Patient Sign In'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Harsha Hospital • Hiriyur, Chitradurga
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 bg-slate-100 p-1 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Patient Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => {
              setMode('admin');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'admin' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin Panel
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode 1: Patient Sign In */}
          {mode === 'login' && (
            <form onSubmit={handlePatientLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mobile Number or Email *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9845012345 or patient@gmail.com"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  We use your mobile number to retrieve your existing appointment slips.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password (Optional)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Enter or leave blank for instant mobile lookup"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Continue to Patient Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Mode 2: Patient Registration */}
          {mode === 'register' && (
            <form onSubmit={handlePatientRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Gowda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9845012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. anand@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors mt-2"
              >
                Create Patient Account
              </button>
            </form>
          )}

          {/* Mode 3: Hospital Admin Login */}
          {mode === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs">
                <span className="font-bold block">Hospital Staff Access</span>
                Harsha Hospital administration account for doctor roster management, schedule slot configuration, and appointment validation.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  defaultValue="admin@harshahospital.in"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Access PIN</label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                  readOnly
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Enter Hospital Administration</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
