import { Eye, Calendar } from 'lucide-react';

interface HeroProps {
  onBookAppointment: () => void;
}

export default function Hero({ onBookAppointment }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-cyan-50 to-blue-100 py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Eye className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Hope Eye Care & Medical Services
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-4">
            Comprehensive Eye Care You Can Trust
          </p>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Over 15 years of experience providing exceptional eye care services.
            From routine exams to advanced treatments, we're here to protect your vision.
          </p>

          <button
            onClick={onBookAppointment}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Calendar className="w-5 h-5" />
            Book an Appointment
          </button>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Years of Experience</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">5k+</div>
              <div className="text-gray-600">Patients Treated</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
