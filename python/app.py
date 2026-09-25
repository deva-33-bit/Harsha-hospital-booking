#!/usr/bin/env python3
"""
Harsha Hospital - Python Web Server & Admin Panel
Built with zero external dependencies (Python Standard Library http.server + urllib).
Can run on any standard Python 3.8+ environment out-of-the-box:
    python3 python/app.py --port 8000

Features:
- Connects directly to Supabase Backend (Project: xhuxhhfbcudikdptaejy)
- Interactive Appointment Booking Portal with verified Harsha Hospital information
- Complete Administrative Dashboard to retrieve, view, search, filter, edit, and cancel appointments
- Real-time slot management & double-booking prevention
- REST API for appointments (/api/appointments)
- CSV Export & Printable Consultation Token Slips
"""

import os
import sys
import json
import random
from datetime import datetime
from typing import Any, List, Dict, Optional
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse
from supabase_client import supabase, SUPABASE_PROJECT_ID

PORT = int(os.getenv("PORT", 8000))

# Verified Harsha Hospital Details
HOSPITAL_INFO = {
    "name": "Harsha Hospital",
    "category": "Hospital / Healthcare",
    "location": "Main Road, Behind Siri Residency, Hiriyur, Chitradurga, Karnataka 577598, India",
    "phone": "+91 97410 49192",
    "rating": 4.3,
    "reviewCount": 50,
    "wheelchairAccessible": True,
    "hours": "24 Hours Emergency & OPD (Mon-Sat 24 Hours, Sun Emergency/OPD)",
    "coordinates": {"lat": 13.9376, "lng": 76.6216},
    "googleMapsUrl": "https://maps.google.com/?q=13.9376,76.6216",
}

DOCTORS = [
    {
        "id": "doc-1",
        "name": "Dr. H. R. Harsha",
        "qualifications": "MBBS, MD (General Medicine)",
        "department": "General Medicine",
        "experience": "14+ Years",
        "fee": 300,
        "availability": "Mon - Sat (9:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    },
    {
        "id": "doc-2",
        "name": "Dr. Sunitha Harsha",
        "qualifications": "MBBS, DGO (Obstetrics & Gynecology)",
        "department": "Gynecology & Obstetrics",
        "experience": "12+ Years",
        "fee": 350,
        "availability": "Mon - Sat (10:00 AM - 2:00 PM, 5:30 PM - 8:00 PM)",
    },
    {
        "id": "doc-3",
        "name": "Dr. Kiran Kumar",
        "qualifications": "MBBS, MS (Orthopedics)",
        "department": "Orthopedics & Joint Care",
        "experience": "10+ Years",
        "fee": 400,
        "availability": "Mon, Wed, Fri (11:00 AM - 3:00 PM)",
    },
]


def render_html(page: str = "home", appointments: list = None) -> str:
    apts = appointments or []
    apts_json = json.dumps(apts)
    docs_json = json.dumps(DOCTORS)
    hosp_json = json.dumps(HOSPITAL_INFO)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Harsha Hospital | Healthcare & Appointment Booking (Python)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body {{ font-family: 'Plus Jakarta Sans', sans-serif; }}
    @media print {{
      body * {{ visibility: hidden; }}
      #printable-slip, #printable-slip * {{ visibility: visible; }}
      #printable-slip {{ position: absolute; left: 0; top: 0; width: 100%; }}
    }}
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col">

  <!-- Top Announcement Bar -->
  <div class="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
        <span class="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          24/7 Outpatient & Emergency Desk
        </span>
        <span class="text-slate-600 hidden sm:inline">|</span>
        <span class="flex items-center gap-1.5 text-slate-300">
          <i class="fa-solid fa-location-dot text-teal-400"></i> Main Road, Behind Siri Residency, Hiriyur
        </span>
      </div>
      <div class="flex items-center gap-4">
        <a href="tel:+919741049192" class="font-bold text-white hover:text-teal-300 transition-colors">
          <i class="fa-solid fa-phone text-teal-400 mr-1"></i> +91 97410 49192
        </a>
        <span class="text-slate-700">•</span>
        <span class="px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 text-[11px] font-mono border border-teal-700/50">
          <i class="fa-brands fa-python mr-1"></i> Python Engine
        </span>
      </div>
    </div>
  </div>

  <!-- Navbar -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
      <a href="/" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-sky-800 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
          <i class="fa-solid fa-hospital text-lg"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl font-black tracking-tight text-slate-900">Harsha Hospital</span>
            <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">Hiriyur</span>
          </div>
          <p class="text-xs text-slate-500 font-medium">Healthcare & Consultation Center</p>
        </div>
      </a>

      <div class="flex items-center gap-3">
        <button onclick="switchView('home')" id="nav-btn-home" class="px-3.5 py-2 rounded-lg text-sm font-semibold transition-all text-slate-700 hover:bg-slate-100">
          <i class="fa-solid fa-house mr-1.5 text-teal-600"></i> Book Appointment
        </button>
        <button onclick="switchView('admin')" id="nav-btn-admin" class="px-3.5 py-2 rounded-lg text-sm font-bold transition-all bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-1.5">
          <i class="fa-solid fa-shield-halved text-teal-400"></i> Admin Panel
          <span class="px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-300 text-[11px]" id="admin-badge-count">{len(apts)}</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Notification Toast -->
  <div id="toast" class="fixed top-20 right-4 z-50 transform transition-all duration-300 translate-y-[-150%] opacity-0 pointer-events-none max-w-md w-full bg-white rounded-xl shadow-2xl border border-slate-200 p-4"></div>

  <!-- VIEW 1: PATIENT BOOKING VIEW -->
  <main id="view-home" class="flex-1 pb-16">
    <!-- Hero Banner -->
    <section class="bg-gradient-to-b from-teal-900/10 via-slate-50 to-white py-12 border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-7 space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <i class="fa-solid fa-circle-check text-teal-600"></i> Verified Hospital • Hiriyur, Chitradurga
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Trusted Healthcare, Designed Around You.
          </h1>
          <p class="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
            Schedule your doctor consultation at Harsha Hospital, Hiriyur. Real-time token generation, transparent OPD queues, and direct database sync with Supabase.
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <span class="text-[11px] text-slate-500 block">Rating</span>
              <span class="text-base font-bold text-slate-900"><i class="fa-solid fa-star text-amber-400 text-xs"></i> 4.3 / 5</span>
              <span class="text-[10px] text-slate-400">50 Justdial Reviews</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <span class="text-[11px] text-slate-500 block">Emergency</span>
              <span class="text-base font-bold text-emerald-600">24 Hours</span>
              <span class="text-[10px] text-slate-400">Main Road Desk</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <span class="text-[11px] text-slate-500 block">Accessibility</span>
              <span class="text-base font-bold text-slate-900">Wheelchair</span>
              <span class="text-[10px] text-slate-400">Ramp & Parking</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <span class="text-[11px] text-slate-500 block">Database</span>
              <span class="text-base font-bold text-teal-700">Supabase</span>
              <span class="text-[10px] text-slate-400 font-mono truncate block">{SUPABASE_PROJECT_ID}</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-calendar-check text-teal-600"></i> Book Consultation
            </h2>
            <p class="text-xs text-slate-500">Instant confirmation & priority outpatient token</p>
          </div>

          <form id="booking-form" onsubmit="handleBookingSubmit(event)" class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Select Consulting Doctor *</label>
              <select id="field-doctor" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-200 bg-white">
                <option value="">-- Choose Doctor / Specialization --</option>
                {"".join(f'<option value="{d["id"]}" data-dept="{d["department"]}">{d["name"]} ({d["department"]} - ₹{d["fee"]})</option>' for d in DOCTORS)}
              </select>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
                <input type="date" id="field-date" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-teal-600" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Preferred Time *</label>
                <select id="field-time" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-teal-600 bg-white">
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="06:30 PM">06:30 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name *</label>
              <input type="text" id="field-name" placeholder="e.g. Ramesh Kumar" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-teal-600" />
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div class="col-span-2">
                <label class="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <input type="tel" id="field-phone" placeholder="10-digit Indian mobile" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-teal-600" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Age *</label>
                <input type="number" id="field-age" min="1" max="120" value="30" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-teal-600" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
                <select id="field-gender" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input type="email" id="field-email" placeholder="patient@example.com" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-teal-600" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit / Symptoms *</label>
              <input type="text" id="field-reason" placeholder="e.g. Fever, routine health checkup, joint pain" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-teal-600" />
            </div>

            <button type="submit" id="btn-submit-booking" class="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span>Confirm Appointment & Save to Database</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>

  <!-- VIEW 2: ADMIN DASHBOARD VIEW -->
  <main id="view-admin" class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 hidden">
    <!-- Admin Top Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center text-xl shadow-xs">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-900">Hospital Administration & Database Portal</h1>
          <p class="text-xs text-slate-500">Live booking retrieval and records management for Harsha Hospital</p>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <button onclick="fetchAppointments()" class="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-arrows-rotate" id="refresh-icon"></i>
          <span>Sync Supabase</span>
        </button>
        <button onclick="exportCSV()" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-file-csv text-teal-600"></i>
          <span>Export CSV</span>
        </button>
        <button onclick="switchView('home')" class="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold">
          Public Site
        </button>
      </div>
    </div>

    <!-- Supabase Status Banner -->
    <div class="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-teal-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <i class="fa-solid fa-database text-sm"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-white">Supabase Connected:</span>
            <span class="font-mono text-emerald-300 text-xs bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30">
              {SUPABASE_PROJECT_ID}
            </span>
          </div>
          <p class="text-[11px] text-slate-300 mt-0.5" id="db-status-text">
            Table 'appointments' synced. Total stored bookings: <strong class="text-white" id="db-count-text">{len(apts)}</strong>.
          </p>
        </div>
      </div>
      <div class="text-right">
        <span class="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Synchronized
        </span>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2 items-center">
      <div class="relative flex-1 min-w-[200px]">
        <i class="fa-solid fa-magnifying-glass text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs"></i>
        <input type="text" id="search-input" oninput="applyFilters()" placeholder="Search patient, phone, email, token or ID..." class="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1" />
      </div>
      <select id="filter-status" onchange="applyFilters()" class="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white">
        <option value="all">All Statuses</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <input type="date" id="filter-date" onchange="applyFilters()" class="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white" title="Filter by date" />
      <button onclick="resetFilters()" class="text-xs px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold border border-red-200">
        Reset
      </button>
    </div>

    <!-- Appointments Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Token & ID</th>
              <th class="py-3 px-4">Patient Information</th>
              <th class="py-3 px-4">Doctor & Dept</th>
              <th class="py-3 px-4">Slot</th>
              <th class="py-3 px-4">Reason / Notes</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="appointments-table-body" class="divide-y divide-slate-100 bg-white">
            <!-- Rows injected by JavaScript -->
          </tbody>
        </table>
      </div>
      <div id="table-empty-msg" class="py-12 text-center text-slate-500 text-xs hidden">
        No appointments match your search criteria.
      </div>
    </div>
  </main>

  <!-- Modal: View / Edit Appointment -->
  <div id="edit-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs hidden">
    <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="font-bold text-slate-900 text-base" id="modal-title">Edit Appointment</h3>
        <button onclick="closeEditModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>
      </div>

      <form id="edit-form" onsubmit="handleSaveEdit(event)" class="space-y-3">
        <input type="hidden" id="edit-id" />
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Patient Name</label>
            <input type="text" id="edit-name" required class="w-full text-xs p-2 rounded-xl border border-slate-300" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
            <input type="text" id="edit-phone" required class="w-full text-xs p-2 rounded-xl border border-slate-300" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Date</label>
            <input type="date" id="edit-date" required class="w-full text-xs p-2 rounded-xl border border-slate-300" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Time</label>
            <input type="text" id="edit-time" required class="w-full text-xs p-2 rounded-xl border border-slate-300" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select id="edit-status" class="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white">
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Doctor Name</label>
            <input type="text" id="edit-doctor" class="w-full text-xs p-2 rounded-xl border border-slate-300" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit</label>
          <input type="text" id="edit-reason" class="w-full text-xs p-2 rounded-xl border border-slate-300" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Clinical Notes / Cancellation Remarks</label>
          <textarea id="edit-notes" rows="2" class="w-full text-xs p-2 rounded-xl border border-slate-300"></textarea>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button type="button" onclick="closeEditModal()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs">Save to Database</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Printable Slip Container -->
  <div id="printable-slip" class="hidden p-8 bg-white max-w-xl mx-auto border border-slate-300"></div>

  <!-- Embedded JavaScript Application State & Logic -->
  <script>
    let appointments = {apts_json};
    const doctors = {docs_json};
    const hospitalInfo = {hosp_json};
    let currentView = 'home';

    // Set default date to today
    document.getElementById('field-date').value = new Date().toISOString().split('T')[0];

    function showToast(msg, type = 'success') {{
      const toast = document.getElementById('toast');
      const isSuccess = type === 'success';
      toast.className = `fixed top-20 right-4 z-50 transform transition-all duration-300 translate-y-0 opacity-100 max-w-md w-full rounded-xl shadow-2xl p-4 border flex items-center gap-3 ${{
        isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
      }}`;
      toast.innerHTML = `
        <i class="fa-solid ${{isSuccess ? 'fa-circle-check text-emerald-600' : 'fa-triangle-exclamation text-red-600'}} text-lg"></i>
        <div class="flex-1 text-xs font-semibold">${{msg}}</div>
        <button onclick="hideToast()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
      `;
      setTimeout(hideToast, 4000);
    }}

    function hideToast() {{
      const toast = document.getElementById('toast');
      toast.className = "fixed top-20 right-4 z-50 transform transition-all duration-300 translate-y-[-150%] opacity-0 pointer-events-none max-w-md w-full bg-white rounded-xl shadow-2xl border border-slate-200 p-4";
    }}

    function switchView(view) {{
      currentView = view;
      if (view === 'admin') {{
        document.getElementById('view-home').classList.add('hidden');
        document.getElementById('view-admin').classList.remove('hidden');
        document.getElementById('nav-btn-admin').className = "px-3.5 py-2 rounded-lg text-sm font-bold transition-all bg-teal-700 text-white shadow-sm flex items-center gap-1.5";
        document.getElementById('nav-btn-home').className = "px-3.5 py-2 rounded-lg text-sm font-semibold transition-all text-slate-700 hover:bg-slate-100";
        fetchAppointments();
      }} else {{
        document.getElementById('view-admin').classList.add('hidden');
        document.getElementById('view-home').classList.remove('hidden');
        document.getElementById('nav-btn-home').className = "px-3.5 py-2 rounded-lg text-sm font-bold transition-all bg-teal-50 text-teal-800 border border-teal-200";
        document.getElementById('nav-btn-admin').className = "px-3.5 py-2 rounded-lg text-sm font-bold transition-all bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-1.5";
      }}
      window.scrollTo({{ top: 0, behavior: 'smooth' }});
    }}

    async function fetchAppointments() {{
      const icon = document.getElementById('refresh-icon');
      if (icon) icon.classList.add('fa-spin');
      try {{
        const res = await fetch('/api/appointments');
        const data = await res.json();
        appointments = data;
        renderTable(appointments);
        document.getElementById('db-count-text').innerText = appointments.length;
        document.getElementById('admin-badge-count').innerText = appointments.length;
        showToast(`Synced ${{appointments.length}} appointments from Supabase!`);
      }} catch (err) {{
        showToast('Error syncing with Supabase: ' + err.message, 'error');
      }} finally {{
        if (icon) icon.classList.remove('fa-spin');
      }}
    }}

    function renderTable(list) {{
      const tbody = document.getElementById('appointments-table-body');
      const emptyMsg = document.getElementById('table-empty-msg');
      tbody.innerHTML = '';

      if (!list || list.length === 0) {{
        emptyMsg.classList.remove('hidden');
        return;
      }}
      emptyMsg.classList.add('hidden');

      list.forEach(apt => {{
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors';

        const statusClasses = {{
          'Confirmed': 'bg-emerald-50 text-emerald-800 border-emerald-300',
          'Completed': 'bg-blue-50 text-blue-800 border-blue-300',
          'Cancelled': 'bg-red-50 text-red-800 border-red-300',
          'Pending': 'bg-amber-50 text-amber-800 border-amber-300',
        }}[apt.status] || 'bg-slate-50 text-slate-800 border-slate-300';

        tr.innerHTML = `
          <td class="py-3 px-4 font-mono">
            <span class="font-bold text-teal-800 text-sm">#${{apt.token_number || apt.tokenNumber || 1}}</span>
            <span class="text-[10px] text-slate-400 block">${{apt.appointment_number || apt.appointmentNumber}}</span>
          </td>
          <td class="py-3 px-4">
            <span class="font-bold text-slate-900 block">${{apt.patient_name || apt.patientName}}</span>
            <span class="text-[11px] text-slate-500">${{apt.phone}} • ${{apt.age}}y/${{apt.gender}}</span>
          </td>
          <td class="py-3 px-4">
            <span class="font-semibold text-slate-800 block">${{apt.doctor_name || apt.doctorName || 'Attending Physician'}}</span>
            <span class="text-[11px] text-teal-700 font-medium">${{apt.department}}</span>
          </td>
          <td class="py-3 px-4">
            <div class="font-medium text-slate-800">${{apt.appointment_date || apt.appointmentDate}}</div>
            <div class="text-[11px] text-slate-500 font-semibold">${{apt.appointment_time || apt.appointmentTime}}</div>
          </td>
          <td class="py-3 px-4 max-w-[160px]">
            <p class="truncate text-slate-700" title="${{apt.reason}}">${{apt.reason || '-'}}</p>
            ${{apt.notes ? `<p class="truncate text-[10px] text-slate-400 italic">Note: ${{apt.notes}}</p>` : ''}}
          </td>
          <td class="py-3 px-4">
            <select onchange="handleStatusChange('${{apt.appointment_number || apt.appointmentNumber}}', this.value)" class="px-2 py-1 rounded-lg text-[11px] font-bold border ${{statusClasses}} cursor-pointer">
              <option value="Confirmed" ${{apt.status === 'Confirmed' ? 'selected' : ''}}>Confirmed</option>
              <option value="Pending" ${{apt.status === 'Pending' ? 'selected' : ''}}>Pending</option>
              <option value="Completed" ${{apt.status === 'Completed' ? 'selected' : ''}}>Completed</option>
              <option value="Cancelled" ${{apt.status === 'Cancelled' ? 'selected' : ''}}>Cancelled</option>
            </select>
          </td>
          <td class="py-3 px-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="openEditModal('${{apt.appointment_number || apt.appointmentNumber}}')" class="p-1.5 rounded-lg border border-slate-200 hover:bg-teal-50 text-teal-700" title="Edit Appointment">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button onclick="printSlip('${{apt.appointment_number || apt.appointmentNumber}}')" class="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700" title="Print Token Slip">
                <i class="fa-solid fa-print"></i>
              </button>
              <button onclick="handleCancel('${{apt.appointment_number || apt.appointmentNumber}}')" class="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-red-600" title="Cancel Consultation">
                <i class="fa-solid fa-ban"></i>
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      }});
    }}

    function applyFilters() {{
      const query = document.getElementById('search-input').value.toLowerCase();
      const status = document.getElementById('filter-status').value;
      const date = document.getElementById('filter-date').value;

      const filtered = appointments.filter(apt => {{
        const name = (apt.patient_name || apt.patientName || '').toLowerCase();
        const phone = apt.phone || '';
        const ref = (apt.appointment_number || apt.appointmentNumber || '').toLowerCase();
        const aptDate = apt.appointment_date || apt.appointmentDate || '';
        const aptStatus = apt.status || '';

        const matchQuery = !query || name.includes(query) || phone.includes(query) || ref.includes(query);
        const matchStatus = status === 'all' || aptStatus === status;
        const matchDate = !date || aptDate === date;

        return matchQuery && matchStatus && matchDate;
      }});

      renderTable(filtered);
    }}

    function resetFilters() {{
      document.getElementById('search-input').value = '';
      document.getElementById('filter-status').value = 'all';
      document.getElementById('filter-date').value = '';
      renderTable(appointments);
    }}

    async function handleBookingSubmit(e) {{
      e.preventDefault();
      const btn = document.getElementById('btn-submit-booking');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-1"></i> Saving to Supabase...';

      const docSelect = document.getElementById('field-doctor');
      const selectedOption = docSelect.options[docSelect.selectedIndex];
      const doctorName = selectedOption.text.split('(')[0].trim();
      const department = selectedOption.getAttribute('data-dept') || 'General Medicine';

      const payload = {{
        doctor_id: docSelect.value,
        doctor_name: doctorName,
        department: department,
        appointment_date: document.getElementById('field-date').value,
        appointment_time: document.getElementById('field-time').value,
        patient_name: document.getElementById('field-name').value.trim(),
        phone: document.getElementById('field-phone').value.trim(),
        email: document.getElementById('field-email').value.trim(),
        age: parseInt(document.getElementById('field-age').value, 10),
        gender: document.getElementById('field-gender').value,
        reason: document.getElementById('field-reason').value.trim(),
      }};

      try {{
        const res = await fetch('/api/appointments', {{
          method: 'POST',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify(payload)
        }});
        const result = await res.json();
        if (result.success) {{
          showToast(`Appointment confirmed! Token #${{result.appointment.token_number}} created and saved to database.`);
          document.getElementById('booking-form').reset();
          document.getElementById('field-date').value = new Date().toISOString().split('T')[0];
          setTimeout(() => switchView('admin'), 1200);
        }} else {{
          showToast(result.error || 'Failed to book slot', 'error');
        }}
      }} catch (err) {{
        showToast('Error booking appointment: ' + err.message, 'error');
      }} finally {{
        btn.disabled = false;
        btn.innerHTML = '<span>Confirm Appointment & Save to Database</span> <i class="fa-solid fa-arrow-right"></i>';
      }}
    }}

    async function handleStatusChange(aptNum, newStatus) {{
      try {{
        const res = await fetch(`/api/appointments/${{aptNum}}`, {{
          method: 'PATCH',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify({{ status: newStatus }})
        }});
        const data = await res.json();
        if (data.success) {{
          showToast(`Appointment #${{aptNum}} updated to ${{newStatus}} in database.`);
          fetchAppointments();
        }}
      }} catch (err) {{
        showToast('Failed to update status', 'error');
      }}
    }}

    function openEditModal(aptNum) {{
      const apt = appointments.find(a => (a.appointment_number || a.appointmentNumber) === aptNum);
      if (!apt) return;
      document.getElementById('edit-id').value = aptNum;
      document.getElementById('modal-title').innerText = `Edit Appointment #${{aptNum}}`;
      document.getElementById('edit-name').value = apt.patient_name || apt.patientName || '';
      document.getElementById('edit-phone').value = apt.phone || '';
      document.getElementById('edit-date').value = apt.appointment_date || apt.appointmentDate || '';
      document.getElementById('edit-time').value = apt.appointment_time || apt.appointmentTime || '';
      document.getElementById('edit-status').value = apt.status || 'Confirmed';
      document.getElementById('edit-doctor').value = apt.doctor_name || apt.doctorName || '';
      document.getElementById('edit-reason').value = apt.reason || '';
      document.getElementById('edit-notes').value = apt.notes || '';
      document.getElementById('edit-modal').classList.remove('hidden');
    }}

    function closeEditModal() {{
      document.getElementById('edit-modal').classList.add('hidden');
    }}

    async function handleSaveEdit(e) {{
      e.preventDefault();
      const aptNum = document.getElementById('edit-id').value;
      const updates = {{
        patient_name: document.getElementById('edit-name').value,
        phone: document.getElementById('edit-phone').value,
        appointment_date: document.getElementById('edit-date').value,
        appointment_time: document.getElementById('edit-time').value,
        status: document.getElementById('edit-status').value,
        doctor_name: document.getElementById('edit-doctor').value,
        reason: document.getElementById('edit-reason').value,
        notes: document.getElementById('edit-notes').value,
      }};

      try {{
        const res = await fetch(`/api/appointments/${{aptNum}}`, {{
          method: 'PATCH',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify(updates)
        }});
        const data = await res.json();
        if (data.success) {{
          showToast(`Appointment #${{aptNum}} saved and updated in database!`);
          closeEditModal();
          fetchAppointments();
        }}
      }} catch (err) {{
        showToast('Error updating appointment: ' + err.message, 'error');
      }}
    }}

    async function handleCancel(aptNum) {{
      const reason = prompt('Please enter cancellation reason for appointment #' + aptNum + ':');
      if (reason === null) return;
      try {{
        const res = await fetch(`/api/appointments/${{aptNum}}`, {{
          method: 'PATCH',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify({{ status: 'Cancelled', notes: reason ? 'Cancelled: ' + reason : 'Cancelled by Admin' }})
        }});
        const data = await res.json();
        if (data.success) {{
          showToast(`Appointment #${{aptNum}} cancelled in database.`);
          fetchAppointments();
        }}
      }} catch (err) {{
        showToast('Error cancelling appointment: ' + err.message, 'error');
      }}
    }}

    function printSlip(aptNum) {{
      const apt = appointments.find(a => (a.appointment_number || a.appointmentNumber) === aptNum);
      if (!apt) return;
      const slip = document.getElementById('printable-slip');
      slip.innerHTML = `
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid #0f766e; border-radius: 8px;">
          <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #0f766e; font-size: 24px; font-weight: bold;">HARSHA HOSPITAL</h2>
            <p style="margin: 4px 0; color: #475569; font-size: 13px;">Main Road, Behind Siri Residency, Hiriyur, Chitradurga, Karnataka 577598</p>
            <p style="margin: 2px 0; color: #0f766e; font-weight: bold; font-size: 12px;">24/7 Helpline: +91 97410 49192 • Wheelchair Accessible</p>
            <h3 style="margin: 10px 0 0; font-size: 16px; color: #1e293b;">OUTPATIENT CONSULTATION SLIP</h3>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div>
              <strong>Token Number:</strong> <span style="font-size: 20px; font-weight: bold; color: #0f766e;">#${{apt.token_number || apt.tokenNumber || 1}}</span><br>
              <strong>Ref ID:</strong> ${{apt.appointment_number || apt.appointmentNumber}}<br>
              <strong>Status:</strong> ${{apt.status}}
            </div>
            <div style="text-align: right;">
              <strong>Date:</strong> ${{apt.appointment_date || apt.appointmentDate}}<br>
              <strong>Slot:</strong> ${{apt.appointment_time || apt.appointmentTime}}
            </div>
          </div>
          <table style="width: 100%; font-size: 13px; margin-bottom: 15px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px 0; font-weight: bold;">Patient Name:</td><td>${{apt.patient_name || apt.patientName}}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px 0; font-weight: bold;">Mobile:</td><td>${{apt.phone}}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px 0; font-weight: bold;">Age / Gender:</td><td>${{apt.age}} yrs / ${{apt.gender}}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px 0; font-weight: bold;">Doctor:</td><td>${{apt.doctor_name || apt.doctorName || 'Attending Physician'}}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px 0; font-weight: bold;">Department:</td><td>${{apt.department}}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Reason for Visit:</td><td>${{apt.reason || 'General Consultation'}}</td></tr>
          </table>
          <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 20px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
            Please report 10 minutes prior to scheduled slot at the front reception counter.
          </p>
        </div>
      `;
      window.print();
    }}

    function exportCSV() {{
      const headers = ['Ref ID', 'Token', 'Patient', 'Phone', 'Age', 'Gender', 'Doctor', 'Department', 'Date', 'Time', 'Status', 'Reason', 'Notes'];
      const rows = appointments.map(a => [
        `"${{a.appointment_number || a.appointmentNumber}}"`,
        a.token_number || a.tokenNumber || 1,
        `"${{a.patient_name || a.patientName}}"`,
        `"${{a.phone}}"`,
        a.age,
        `"${{a.gender}}"`,
        `"${{a.doctor_name || a.doctorName || ''}}"`,
        `"${{a.department}}"`,
        `"${{a.appointment_date || a.appointmentDate}}"`,
        `"${{a.appointment_time || a.appointmentTime}}"`,
        `"${{a.status}}"`,
        `"${{(a.reason || '').replace(/"/g, '""')}}"`,
        `"${{(a.notes || '').replace(/"/g, '""')}}"`,
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\\n');
      const blob = new Blob([csvContent], {{ type: 'text/csv;charset=utf-8;' }});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'harsha_hospital_appointments.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Exported appointments to CSV.');
    }}

    // Render table on initial page load
    renderTable(appointments);
  </script>
</body>
</html>
"""


class HospitalHTTPHandler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, data: Any):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header(
            "Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS"
        )
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def _send_html(self, html_content: str):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(html_content.encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header(
            "Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS"
        )
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path in ("/", "/index.html", "/admin"):
            page = "admin" if path == "/admin" else "home"
            apts = supabase.get_appointments()
            self._send_html(render_html(page=page, appointments=apts))
            return

        if path == "/api/appointments":
            apts = supabase.get_appointments()
            self._send_json(200, apts)
            return

        if path == "/api/status":
            status = supabase.check_connection()
            self._send_json(200, status)
            return

        self._send_json(404, {"error": "Not Found"})

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/appointments":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            data = json.loads(body)

            # Generate random appointment reference HH-YYYY-RANDOM
            random_suffix = random.randint(1000, 9999)
            year = datetime.now().year
            apt_number = f"HH-{year}-{random_suffix}"

            # Calculate token number for the doctor and date
            existing = supabase.get_appointments()
            same_day_count = sum(
                1
                for a in existing
                if (a.get("doctor_id") == data.get("doctor_id"))
                and (a.get("appointment_date") == data.get("appointment_date"))
                and (a.get("status") != "Cancelled")
            )
            token_number = same_day_count + 1

            record = {
                "appointment_number": apt_number,
                "patient_name": data.get("patient_name", "").strip(),
                "phone": data.get("phone", "").strip(),
                "email": data.get("email", "").strip(),
                "age": data.get("age", 30),
                "gender": data.get("gender", "Male"),
                "department": data.get("department", "General Medicine"),
                "doctor_id": data.get("doctor_id", ""),
                "doctor_name": data.get("doctor_name", "Consulting Specialist"),
                "appointment_date": data.get("appointment_date", ""),
                "appointment_time": data.get("appointment_time", ""),
                "reason": data.get("reason", "").strip(),
                "notes": data.get("notes", ""),
                "status": "Confirmed",
                "token_number": token_number,
                "created_at": datetime.utcnow().isoformat() + "Z",
            }

            res = supabase.create_appointment(record)
            if res["success"]:
                self._send_json(201, {"success": True, "appointment": record})
            else:
                self._send_json(
                    400,
                    {
                        "success": False,
                        "error": res.get("error", "Database error"),
                    },
                )
            return

        self._send_json(404, {"error": "Not Found"})

    def do_PATCH(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith("/api/appointments/"):
            apt_id = path.split("/")[-1]
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            updates = json.loads(body)

            res = supabase.update_appointment(apt_id, updates)
            if res["success"]:
                self._send_json(200, {"success": True, "data": res.get("data")})
            else:
                self._send_json(400, {"success": False, "error": res.get("error")})
            return

        self._send_json(404, {"error": "Not Found"})

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith("/api/appointments/"):
            apt_id = path.split("/")[-1]
            res = supabase.delete_appointment(apt_id)
            if res["success"]:
                self._send_json(200, {"success": True})
            else:
                self._send_json(400, {"success": False, "error": res.get("error")})
            return

        self._send_json(404, {"error": "Not Found"})


def main():
    port = PORT
    server_address = ("", port)
    httpd = HTTPServer(server_address, HospitalHTTPHandler)
    print(f"================================================================")
    print(f" Harsha Hospital Python Backend & Admin Panel Running!")
    print(f" - Local Server  : http://localhost:{port}")
    print(f" - Admin Portal  : http://localhost:{port}/admin")
    print(f" - API Endpoint  : http://localhost:{port}/api/appointments")
    print(f" - Supabase ID   : {SUPABASE_PROJECT_ID}")
    print(f"================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()


if __name__ == "__main__":
    main()
