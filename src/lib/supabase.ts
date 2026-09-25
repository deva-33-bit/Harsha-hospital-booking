import { createClient } from '@supabase/supabase-js';
import { Appointment } from '../types';

export const SUPABASE_PROJECT_ID = 'xhuxhhfbcudikdptaejy';
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OfLpu1XoNG9Xa_a3SK5H8A_CSWGeq7r';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_SCHEMA_SQL = `-- Run this in your Supabase SQL Editor if the table is not created yet:

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_number TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  age INTEGER,
  gender TEXT,
  department TEXT,
  doctor_id TEXT,
  doctor_name TEXT,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  reason TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Confirmed',
  token_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow public appointment bookings to be inserted
CREATE POLICY "Allow public appointment insert"
  ON appointments FOR INSERT
  WITH CHECK (true);

-- Allow reading appointments
CREATE POLICY "Allow public appointment select"
  ON appointments FOR SELECT
  USING (true);

-- Allow updating appointment status (rescheduling, cancellation)
CREATE POLICY "Allow public appointment update"
  ON appointments FOR UPDATE
  USING (true);
`;

export interface SupabaseSyncResult {
  success: boolean;
  data?: any;
  error?: string;
  tableName?: string;
}

/**
 * Saves a new appointment to Supabase database.
 * Supports snake_case table schema and fallbacks seamlessly.
 */
export async function saveAppointmentToSupabase(
  appointment: Appointment,
  doctorName?: string
): Promise<SupabaseSyncResult> {
  try {
    const payload = {
      appointment_number: appointment.appointmentNumber,
      patient_name: appointment.patientName,
      phone: appointment.phone,
      email: appointment.email,
      age: appointment.age,
      gender: appointment.gender,
      department: appointment.department,
      doctor_id: appointment.doctorId,
      doctor_name: doctorName || 'Consulting Specialist',
      appointment_date: appointment.appointmentDate,
      appointment_time: appointment.appointmentTime,
      reason: appointment.reason,
      notes: appointment.notes || '',
      status: appointment.status,
      token_number: appointment.tokenNumber,
      created_at: appointment.createdAt || new Date().toISOString(),
    };

    // Attempt insert into 'appointments' table
    const { data, error } = await supabase.from('appointments').insert([payload]).select();

    if (error) {
      console.warn('Supabase insert warning (snake_case):', error.message);

      // If column names differ, attempt camelCase schema
      const camelPayload = {
        appointmentNumber: appointment.appointmentNumber,
        patientName: appointment.patientName,
        phone: appointment.phone,
        email: appointment.email,
        age: appointment.age,
        gender: appointment.gender,
        department: appointment.department,
        doctorId: appointment.doctorId,
        doctorName: doctorName || 'Consulting Specialist',
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        reason: appointment.reason,
        notes: appointment.notes || '',
        status: appointment.status,
        tokenNumber: appointment.tokenNumber,
        createdAt: appointment.createdAt || new Date().toISOString(),
      };

      const retryRes = await supabase.from('appointments').insert([camelPayload]).select();
      if (retryRes.error) {
        return {
          success: false,
          error: `${error.message}. Please ensure the 'appointments' table exists in Supabase.`,
          tableName: 'appointments',
        };
      }

      return {
        success: true,
        data: retryRes.data,
        tableName: 'appointments',
      };
    }

    return {
      success: true,
      data,
      tableName: 'appointments',
    };
  } catch (err: any) {
    console.error('Error connecting to Supabase:', err);
    return {
      success: false,
      error: err.message || 'Network error communicating with Supabase database.',
    };
  }
}

/**
 * Updates an appointment in Supabase database with any modified fields.
 */
export async function updateAppointmentInSupabase(
  appointmentNumber: string,
  updates: Partial<Appointment> & { doctorName?: string }
): Promise<SupabaseSyncResult> {
  try {
    const payload: Record<string, any> = {};

    if (updates.patientName !== undefined) payload.patient_name = updates.patientName;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.age !== undefined) payload.age = updates.age;
    if (updates.gender !== undefined) payload.gender = updates.gender;
    if (updates.department !== undefined) payload.department = updates.department;
    if (updates.doctorId !== undefined) payload.doctor_id = updates.doctorId;
    if (updates.doctorName !== undefined) payload.doctor_name = updates.doctorName;
    if (updates.appointmentDate !== undefined) payload.appointment_date = updates.appointmentDate;
    if (updates.appointmentTime !== undefined) payload.appointment_time = updates.appointmentTime;
    if (updates.reason !== undefined) payload.reason = updates.reason;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.tokenNumber !== undefined) payload.token_number = updates.tokenNumber;

    const { data, error } = await supabase
      .from('appointments')
      .update(payload)
      .or(`appointment_number.eq.${appointmentNumber},id.eq.${appointmentNumber}`);

    if (error) {
      // Fallback: try camelCase columns if column not found error
      const camelPayload: Record<string, any> = {};
      if (updates.patientName !== undefined) camelPayload.patientName = updates.patientName;
      if (updates.phone !== undefined) camelPayload.phone = updates.phone;
      if (updates.email !== undefined) camelPayload.email = updates.email;
      if (updates.age !== undefined) camelPayload.age = updates.age;
      if (updates.gender !== undefined) camelPayload.gender = updates.gender;
      if (updates.department !== undefined) camelPayload.department = updates.department;
      if (updates.doctorId !== undefined) camelPayload.doctorId = updates.doctorId;
      if (updates.doctorName !== undefined) camelPayload.doctorName = updates.doctorName;
      if (updates.appointmentDate !== undefined) camelPayload.appointmentDate = updates.appointmentDate;
      if (updates.appointmentTime !== undefined) camelPayload.appointmentTime = updates.appointmentTime;
      if (updates.reason !== undefined) camelPayload.reason = updates.reason;
      if (updates.notes !== undefined) camelPayload.notes = updates.notes;
      if (updates.status !== undefined) camelPayload.status = updates.status;
      if (updates.tokenNumber !== undefined) camelPayload.tokenNumber = updates.tokenNumber;

      const retryRes = await supabase
        .from('appointments')
        .update(camelPayload)
        .or(`appointment_number.eq.${appointmentNumber},appointmentNumber.eq.${appointmentNumber},id.eq.${appointmentNumber}`);

      if (retryRes.error) {
        return { success: false, error: retryRes.error.message };
      }
      return { success: true, data: retryRes.data };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Deletes an appointment from Supabase database.
 */
export async function deleteAppointmentFromSupabase(
  identifier: string
): Promise<SupabaseSyncResult> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .delete()
      .or(`appointment_number.eq.${identifier},id.eq.${identifier}`);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetches all appointments stored in Supabase.
 */
export async function fetchAppointmentsFromSupabase(): Promise<{
  success: boolean;
  appointments: Appointment[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, appointments: [], error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: true, appointments: [] };
    }

    // Map database records to internal Appointment model
    const mapped: Appointment[] = data.map((row: any) => ({
      id: row.id || `apt-${row.appointment_number || row.appointmentNumber}`,
      appointmentNumber: row.appointment_number || row.appointmentNumber || `HH-${Date.now()}`,
      doctorId: row.doctor_id || row.doctorId || '',
      department: row.department || 'General Medicine',
      appointmentDate: row.appointment_date || row.appointmentDate || '',
      appointmentTime: row.appointment_time || row.appointmentTime || '',
      patientName: row.patient_name || row.patientName || 'Patient',
      phone: row.phone || '',
      email: row.email || '',
      age: row.age || 30,
      gender: row.gender || 'Male',
      reason: row.reason || '',
      notes: row.notes || undefined,
      status: row.status || 'Confirmed',
      tokenNumber: row.token_number || row.tokenNumber || 1,
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
      updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
    }));

    return { success: true, appointments: mapped };
  } catch (err: any) {
    return { success: false, appointments: [], error: err.message };
  }
}

/**
 * Checks connection status to Supabase project
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  tableExists: boolean;
  message: string;
}> {
  try {
    const { data, error } = await supabase.from('appointments').select('id').limit(1);

    if (error) {
      if (
        error.code === '42P01' ||
        error.message.includes('relation "appointments" does not exist') ||
        error.message.includes('not found')
      ) {
        return {
          connected: true,
          tableExists: false,
          message:
            "Connected to Supabase project, but the 'appointments' table does not exist yet. Please run the SQL schema.",
        };
      }
      return {
        connected: false,
        tableExists: false,
        message: `Supabase connection response: ${error.message}`,
      };
    }

    return {
      connected: true,
      tableExists: true,
      message: "Successfully connected to Supabase backend! 'appointments' table is ready.",
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      message: `Failed to connect to Supabase: ${err.message}`,
    };
  }
}
