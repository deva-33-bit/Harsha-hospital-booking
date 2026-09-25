# Harsha Hospital - Python Implementation

This directory contains the Python implementation of the **Harsha Hospital (Hiriyur, Chitradurga)** appointment booking system and administrative database portal, connected to your **Supabase backend**.

---

## 🌟 Quick Start (Zero Dependencies)

The core Python server (`app.py`) uses the Python Standard Library. **No `pip install` is required** to run it immediately on any machine with Python 3.8+:

```bash
cd python
python3 app.py
```

Open your browser at:
- **Public Booking Site:** `http://localhost:8000`
- **Admin Dashboard:** `http://localhost:8000/admin`
- **Supabase Status:** `http://localhost:8000/api/status`

---

## 🗄️ Supabase Configuration

Your Supabase project credentials are automatically embedded in `supabase_client.py`:
- **Project ID:** `xhuxhhfbcudikdptaejy`
- **Supabase URL:** `https://xhuxhhfbcudikdptaejy.supabase.co`
- **API Key:** Configured with your publishable key

You can override these using environment variables if needed:
```bash
export SUPABASE_PROJECT_ID="xhuxhhfbcudikdptaejy"
export SUPABASE_ANON_KEY="sb_publishable_OfLpu1XoNG9Xa_a3SK5H8A_CSWGeq7r"
python3 app.py
```

---

## 🚀 Options Available

### Option 1: Standard Library Server (`app.py`)
- Self-contained, lightweight, zero external packages.
- Serves the public booking UI, interactive Admin Dashboard, and REST API endpoints.
- Supports appointment search, status updates, edit modal, cancellation, slip printing, and CSV export.

### Option 2: FastAPI + Uvicorn (`fastapi_app.py`)
If you prefer FastAPI with automatic OpenAPI docs (Swagger UI):
```bash
pip install -r requirements.txt
uvicorn fastapi_app:app --reload --port 8000
```
Swagger UI documentation available at: `http://localhost:8000/docs`

### Option 3: Flask (`flask_app.py`)
If you prefer Flask:
```bash
pip install flask requests
python flask_app.py
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | Tests connection to Supabase database |
| `GET` | `/api/appointments` | Retrieves all appointments from Supabase |
| `POST` | `/api/appointments` | Books new appointment, assigns token, and inserts into Supabase |
| `PATCH` | `/api/appointments/{id}` | Updates appointment (status, date, time, notes) |
| `DELETE` | `/api/appointments/{id}` | Deletes appointment from Supabase |

### Sample POST Payload (`/api/appointments`):
```json
{
  "doctor_id": "doc-1",
  "doctor_name": "Dr. H. R. Harsha",
  "department": "General Medicine",
  "appointment_date": "2026-09-30",
  "appointment_time": "10:30 AM",
  "patient_name": "Ramesh Kumar",
  "phone": "9741049192",
  "email": "ramesh@example.com",
  "age": 32,
  "gender": "Male",
  "reason": "General Health Checkup"
}
```

---

## 🏥 Hospital Verified Details
- **Name:** Harsha Hospital
- **Address:** Main Road, Behind Siri Residency, Hiriyur, Chitradurga, Karnataka 577598
- **Helpline:** +91 97410 49192
- **Coordinates:** 13.9376° N, 76.6216° E
