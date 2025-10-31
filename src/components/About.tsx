import { useEffect, useState } from "react";
import { Award, Users, Heart } from "lucide-react";
import { supabase } from "../lib/supabaseClient"; // adjust path if needed

type Doctor = {
  id: string;
  name: string;
  title: string;
  qualification: string;
  description: string;
  display_order: number;
  is_active: boolean;
};

export default function About() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetchDoctors();

    // Optional: Realtime listener for instant updates
    const channel = supabase
      .channel("realtime:doctors")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "doctors" },
        () => {
          fetchDoctors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching doctors:", error.message);
    } else {
      setDoctors(data || []);
    }
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Our Clinic</h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 italic" style={{ fontFamily: "'Lora', serif" }}>
            Since 2010, Hope Eye Care & Medical Services has been dedicated to providing exceptional eye care
            with a personal touch. Our team of experienced professionals uses state-of-the-art
            technology to ensure the best outcomes for every patient.
          </p>
        </div>

        {/* 3 features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
            <p className="text-gray-600">
              Award-winning clinic recognized for outstanding patient care and clinical outcomes.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Team</h3>
            <p className="text-gray-600">
              Board-certified specialists with decades of combined experience in eye care.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient-Centered</h3>
            <p className="text-gray-600">
              We treat every patient like family, ensuring comfort and understanding at every step.
            </p>
          </div>
        </div>

        {/* Doctors Section */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Doctors</h3>

          {doctors.length === 0 ? (
            <p className="text-center text-gray-500">Coming Soon.....</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                    {doctor.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 text-center mb-1">
                    {doctor.name}
                  </h4>
                  <p className="text-blue-600 text-center font-medium mb-1">{doctor.title}</p>
                  <p className="text-gray-500 text-center text-sm mb-3">{doctor.qualification}</p>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    {doctor.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
