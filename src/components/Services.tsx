import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react"; // import all Lucide icons
import { supabase } from "../lib/supabaseClient";

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) console.error("Error fetching services:", error);
      else setServices(data || []);
      setLoading(false);
    };

    fetchServices();

    // Optional: enable live updates
    const subscription = supabase
      .channel("services-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        () => fetchServices()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (loading) return <p className="text-center py-12">Loading services...</p>;

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 italic" style={{ fontFamily: "'Lora', serif" }}>
            Complete eye care solutions for your entire family
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            // Dynamically pick the Lucide icon based on icon_name (e.g. "Eye", "Heart")
            const Icon =
              (LucideIcons as any)[service.icon_name] || LucideIcons.Eye;

            return (
              <div
                key={service.id}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
