"""
Supabase Database Client for Harsha Hospital Booking System.
Uses Python's built-in urllib (zero dependencies required) with full
support for retrieving, saving, updating, and cancelling appointments.
"""

import os
import json
import urllib.request
import urllib.parse
from typing import Dict, Any, List, Optional

SUPABASE_PROJECT_ID = os.getenv("SUPABASE_PROJECT_ID", "xhuxhhfbcudikdptaejy")
SUPABASE_URL = os.getenv(
    "SUPABASE_URL", f"https://{SUPABASE_PROJECT_ID}.supabase.co"
)
SUPABASE_ANON_KEY = os.getenv(
    "SUPABASE_ANON_KEY",
    "sb_publishable_OfLpu1XoNG9Xa_a3SK5H8A_CSWGeq7r",
)


class SupabaseClient:
    def __init__(self, url: str = SUPABASE_URL, key: str = SUPABASE_ANON_KEY):
        self.url = url.rstrip("/")
        self.key = key
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    def _make_request(
        self, endpoint: str, method: str = "GET", data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        full_url = f"{self.url}/rest/v1/{endpoint.lstrip('/')}"
        encoded_data = json.dumps(data).encode("utf-8") if data is not None else None

        req = urllib.request.Request(
            full_url, data=encoded_data, headers=self.headers, method=method
        )
        try:
            with urllib.request.urlopen(req) as resp:
                status_code = resp.status
                body = resp.read().decode("utf-8")
                parsed = json.loads(body) if body else []
                return {"success": True, "status": status_code, "data": parsed}
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8")
            return {
                "success": False,
                "status": e.code,
                "error": error_body or str(e),
            }
        except Exception as e:
            return {"success": False, "status": 500, "error": str(e)}

    def check_connection(self) -> Dict[str, Any]:
        """Check if Supabase database and appointments table are reachable."""
        res = self._make_request("appointments?select=id&limit=1")
        if res["success"]:
            return {
                "connected": True,
                "table_exists": True,
                "project_id": SUPABASE_PROJECT_ID,
                "message": "Connected to Supabase project! 'appointments' table is accessible.",
            }
        return {
            "connected": False,
            "table_exists": False,
            "project_id": SUPABASE_PROJECT_ID,
            "message": f"Connection notice: {res.get('error')}",
        }

    def get_appointments(self) -> List[Dict[str, Any]]:
        """Fetch all appointments ordered by created_at descending."""
        res = self._make_request("appointments?select=*&order=created_at.desc")
        if res["success"]:
            return res["data"]
        return []

    def get_appointment_by_id(self, appointment_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a specific appointment by appointment_number or UUID."""
        res = self._make_request(
            f"appointments?or=(appointment_number.eq.{appointment_id},id.eq.{appointment_id})&limit=1"
        )
        if res["success"] and len(res["data"]) > 0:
            return res["data"][0]
        return None

    def create_appointment(self, appointment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a new appointment to Supabase."""
        return self._make_request("appointments", method="POST", data=appointment_data)

    def update_appointment(
        self, appointment_id: str, updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update appointment fields (status, date, time, reason, notes)."""
        endpoint = f"appointments?or=(appointment_number.eq.{appointment_id},id.eq.{appointment_id})"
        return self._make_request(endpoint, method="PATCH", data=updates)

    def delete_appointment(self, appointment_id: str) -> Dict[str, Any]:
        """Delete an appointment from Supabase."""
        endpoint = f"appointments?or=(appointment_number.eq.{appointment_id},id.eq.{appointment_id})"
        return self._make_request(endpoint, method="DELETE")


# Default singleton instance
supabase = SupabaseClient()
