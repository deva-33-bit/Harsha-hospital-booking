"""
Harsha Hospital - FastAPI Backend & Admin API
Production-ready REST API built with FastAPI and Pydantic, connected to Supabase.
Run with:
    pip install fastapi uvicorn requests
    uvicorn fastapi_app:app --reload --port 8000
"""

import os
import random
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase_client import supabase, SUPABASE_PROJECT_ID

app = FastAPI(
    title="Harsha Hospital Appointment & Admin API",
    description="Python FastAPI backend connected to Supabase database for Harsha Hospital, Hiriyur, Karnataka.",
    version="1.0.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BookingRequest(BaseModel):
    doctor_id: str
    doctor_name: Optional[str] = "Consulting Physician"
    department: str = "General Medicine"
    appointment_date: str = Field(..., example="2026-09-30")
    appointment_time: str = Field(..., example="10:30 AM")
    patient_name: str = Field(..., min_length=2, example="Ramesh Kumar")
    phone: str = Field(..., min_length=10, example="9741049192")
    email: Optional[str] = None
    age: int = Field(30, ge=1, le=125)
    gender: str = "Male"
    reason: str = Field(..., example="Fever and routine consultation")
    notes: Optional[str] = None


class AppointmentUpdateRequest(BaseModel):
    patient_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    appointment_date: Optional[str] = None
    appointment_time: Optional[str] = None
    doctor_name: Optional[str] = None
    status: Optional[str] = None  # Confirmed, Pending, Completed, Cancelled
    reason: Optional[str] = None
    notes: Optional[str] = None


@app.get("/")
def root():
    return {
        "hospital": "Harsha Hospital",
        "location": "Main Road, Hiriyur, Chitradurga, Karnataka 577598",
        "phone": "+91 97410 49192",
        "framework": "FastAPI (Python)",
        "supabase_project_id": SUPABASE_PROJECT_ID,
        "docs_url": "/docs",
    }


@app.get("/api/status")
def get_status():
    """Check connectivity to Supabase backend."""
    return supabase.check_connection()


@app.get("/api/appointments")
def list_appointments():
    """Retrieve all bookings stored in Supabase."""
    return supabase.get_appointments()


@app.get("/api/appointments/{identifier}")
def get_appointment(identifier: str):
    """Retrieve a single appointment by reference number or ID."""
    apt = supabase.get_appointment_by_id(identifier)
    if not apt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )
    return apt


@app.post("/api/appointments", status_code=status.HTTP_201_CREATED)
def create_appointment(booking: BookingRequest):
    """
    Book a new OPD appointment slot:
    - Generates unique reference HH-YYYY-RANDOM
    - Computes token number for the doctor and date
    - Saves directly to Supabase table 'appointments'
    """
    # Token calculation
    existing = supabase.get_appointments()
    same_day_count = sum(
        1
        for a in existing
        if a.get("doctor_id") == booking.doctor_id
        and a.get("appointment_date") == booking.appointment_date
        and a.get("status") != "Cancelled"
    )
    token_number = same_day_count + 1

    random_suffix = random.randint(1000, 9999)
    year = datetime.now().year
    appointment_number = f"HH-{year}-{random_suffix}"

    record = {
        "appointment_number": appointment_number,
        "patient_name": booking.patient_name.strip(),
        "phone": booking.phone.strip(),
        "email": booking.email.strip() if booking.email else "",
        "age": booking.age,
        "gender": booking.gender,
        "department": booking.department,
        "doctor_id": booking.doctor_id,
        "doctor_name": booking.doctor_name,
        "appointment_date": booking.appointment_date,
        "appointment_time": booking.appointment_time,
        "reason": booking.reason.strip(),
        "notes": booking.notes or "",
        "status": "Confirmed",
        "token_number": token_number,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }

    res = supabase.create_appointment(record)
    if not res["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=res.get("error", "Failed to insert into Supabase"),
        )

    return {"success": True, "appointment": record}


@app.patch("/api/appointments/{identifier}")
def update_appointment(identifier: str, updates: AppointmentUpdateRequest):
    """Update appointment details, reschedule, or change status in Supabase."""
    data = {k: v for k, v in updates.dict().items() if v is not None}
    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update"
        )

    res = supabase.update_appointment(identifier, data)
    if not res["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=res.get("error", "Failed to update Supabase record"),
        )
    return {"success": True, "updated": data}


@app.delete("/api/appointments/{identifier}")
def delete_appointment(identifier: str):
    """Delete an appointment record from Supabase."""
    res = supabase.delete_appointment(identifier)
    if not res["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=res.get("error", "Failed to delete record"),
        )
    return {
        "success": True,
        "message": f"Appointment {identifier} removed from database",
    }
