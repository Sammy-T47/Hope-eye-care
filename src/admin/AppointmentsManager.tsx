import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  preferred_date: string;
  preferred_time: string;
  reason: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch appointments from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setAppointments(data || []);
      setLoading(false);
    };

    fetchAppointments();
  }, []);

  // ✅ Update appointment status
  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) alert(error.message);
    else {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: newStatus } : appt
        )
      );
    }
  };

  // ✅ Delete appointment
  const deleteAppointment = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id);

    if (error) alert(error.message);
    else setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Appointments Manager</h1>
      <p className="text-gray-600 mb-6">
        View and manage patient appointments.
      </p>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Patient Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Preferred Date</th>
                <th className="border p-2">Preferred Time</th>
                <th className="border p-2">Reason</th>
                <th className="border p-2">Notes</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50">
                  <td className="border p-2">{appt.patient_name}</td>
                  <td className="border p-2">{appt.patient_email}</td>
                  <td className="border p-2">{appt.patient_phone}</td>
                  <td className="border p-2">{appt.preferred_date}</td>
                  <td className="border p-2">{appt.preferred_time}</td>
                  <td className="border p-2">{appt.reason}</td>
                  <td className="border p-2">{appt.notes}</td>
                  <td className="border p-2">
                    <select
                      value={appt.status || "pending"}
                      onChange={(e) => updateStatus(appt.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => deleteAppointment(appt.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
