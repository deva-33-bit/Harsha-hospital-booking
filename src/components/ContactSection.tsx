import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
  Navigation,
  Accessibility,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const ContactSection: React.FC = () => {
  const { hospitalInfo } = useHospital();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cleanPhone = hospitalInfo.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20Harsha%20Hospital,%20I%20would%20like%20to%20inquire%20about%20healthcare%20services.`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 4000);
  };

  return (
    <section id="contact-section" className="py-14 lg:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-semibold mb-3">
            <Phone className="w-3.5 h-3.5 text-teal-700" />
            <span>Connect with Reception & Helpline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact Harsha Hospital
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Have questions about outpatient consultation, specialist availability, or visiting hours? We are here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hospital Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
              <h3 className="text-lg font-bold text-slate-900">Hospital Information</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Address</span>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      Harsha Hospital<br />
                      Main Road, Behind Siri Residency,<br />
                      Hiriyur, Chitradurga, Karnataka 577598
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Phone Desk</span>
                    <a
                      href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
                      className="text-teal-700 font-bold hover:underline block mt-0.5"
                    >
                      {hospitalInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Hours</span>
                    <p className="text-slate-600 mt-0.5">{hospitalInfo.openingHoursText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <Accessibility className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Wheelchair Access</span>
                    <p className="text-slate-600 mt-0.5">
                      Wheelchair ramp entrance and designated drop-off parking available.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Quick Action CTAs */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <a
                  href={`tel:${hospitalInfo.phone.replace(/\s+/g, '')}`}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Call Now</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">How can we help you?</h3>
            <p className="text-slate-600 text-xs mb-6">
              Send a direct query to the Harsha Hospital coordination team. We reply promptly during regular desk hours.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Message Received</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you, <strong>{name}</strong>. Our hospital reception desk on Main Road, Hiriyur will contact you shortly at <strong>{phone}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9845012345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. anand@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your inquiry, doctor consultation question, or assistance required..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Harsha Hospital</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
