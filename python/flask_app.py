"""
Harsha Hospital - Flask Backend & Admin API
Production-ready Flask application connected to Supabase.
Run with:
    pip install flask requests
    python flask_app.py
"""

import os
import random
from datetime import datetime
from flask import Flask, request, jsonify, render_template_string
from supabase_client import supabase, SUPABASE_PROJECT_ID

app = Flask(__name__)
PORT = int(os.getenv("PORT", 5000))


@app.route("/api/status", methods=["GET"])
def get_status():
    return jsonify(supabase.check_connection())


@app.route("/api/appointments", methods=["GET"])
def list_appointments():
    return jsonify(supabase.get_appointments())


@app.route("/api/appointments", methods=["POST"])
def create_appointment():
    data = request.get_json() or {}
    random_suffix = random.randint(1000, 9999)
    year = datetime.now().year
    appointment_number = f"HH-{year}-{random_suffix}"

    existing = supabase.get_appointments()
    same_day_count = sum(
        1
        for a in existing
        if a.get("doctor_id") == data.get("doctor_id")
        and a.get("appointment_date") == data.get("appointment_date")
        and a.get("status") != "Cancelled"
    )
    token_number = same_day_count + 1

    record = {
        "appointment_number": appointment_number,
        "patient_name": data.get("patient_name", "").strip(),
        "phone": data.get("phone", "").strip(),
        "email": data.get("email", "").strip(),
        "age": data.get("age", 30),
        "gender": data.get("gender", "Male"),
        "department": data.get("department", "General Medicine"),
        "doctor_id": data.get("doctor_id", ""),
        "doctor_name": data.get("doctor_name", "Consulting Physician"),
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
        return jsonify({"success": True, "appointment": record}), 201
    return jsonify({"success": False, "error": res.get("error")}), 400


@app.route("/api/appointments/<identifier>", methods=["PATCH"])
def update_appointment(identifier):
    updates = request.get_json() or {}
    res = supabase.update_appointment(identifier, updates)
    if res["success"]:
        return jsonify({"success": True, "data": res.get("data")})
    return jsonify({"success": False, "error": res.get("error")}), 400


@app.route("/api/appointments/<identifier>", methods=["DELETE"])
def delete_appointment(identifier):
    res = supabase.delete_appointment(identifier)
    if res["success"]:
        return jsonify({"success": True})
    return jsonify({"success": False, "error": res.get("error")}), 400


if __name__ == "__main__":
    print(f"Harsha Hospital Flask Server starting on http://localhost:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
