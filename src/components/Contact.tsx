import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Contact() {
  const [clinicInfo, setClinicInfo] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch clinic info and set realtime subscription
  useEffect(() => {
    const fetchClinicInfo = async () => {
      const { data, error } = await supabase.from("clinic_info").select("key, value");
      if (!error && data) {
        const infoObj: Record<string, string> = {};
        data.forEach((item) => {
          infoObj[item.key] = item.value;
        });
        setClinicInfo(infoObj);
      } else {
        console.error("Error fetching clinic info:", error);
      }
    };

    fetchClinicInfo();

    // Realtime update
    const subscription = supabase
      .channel("clinic_info_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clinic_info" },
        async () => {
          await fetchClinicInfo();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: submitError } = await supabase
        .from("contact_messages")
        .insert([formData]);

      if (submitError) throw submitError;

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 italic" style={{ fontFamily: "'Lora', serif" }}>
            Get in touch with our team for any questions or concerns.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT SIDE */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">Get in Touch</h3>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Our Location</h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {clinicInfo.address || "Loading..."}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">{clinicInfo.phone || "Loading..."}</p>
                    <p className="text-gray-400 text-sm">WhatsApp available</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">{clinicInfo.email || "Loading..."}</p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Office Hours</h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {clinicInfo.hours_weekday || "Loading..."}
                      <br />
                       {clinicInfo.hours_saturday || "Loading..."}
                       <br />
                       {clinicInfo.hours_sunday || "Loading..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MAP */}
            <div className="mt-8 w-full h-96 rounded-lg overflow-hidden shadow-md">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m27!1m12!1m3!1d63446.74152258558!2d8.045612666659947!3d6.339435874390961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m12!3e6!4m4!1s0x105ca166f467bef3%3A0xdc4b41dafb8cc303!3m2!1d6.3394375!2d8.086812499999999!4m5!1s0x105ca166f467bef3%3A0xdc4b41dafb8cc303!2s83QP%2BQPW%20HOPE%20EYECARE%20AND%20MEDICAL%20SERVICES%20LIMITED%2C%20Ebonyi%20voice%2C%20Old%20Enugu%20-%20Abakaliki%20Rd%2C%20Local%2C%20mile%2050%2C%20Abakaliki%20482112%2C%20Ebonyi!3m2!1d6.3394375!2d8.086812499999999!5e0!3m2!1sen!2sng!4v1760530731959!5m2!1sen!2sng"
    width="100%"
    height="100%"
    style={{ border: "0" }}
    allowFullScreen={true}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Hope EyeCare and Medical Services Map"
  ></iframe>
</div>

          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Send us a Message</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              {/* Notifications */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Message sent successfully! We'll get back to you soon.</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
