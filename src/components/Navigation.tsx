import { useState } from 'react';
import { Eye, Menu, X, Calendar } from 'lucide-react';

interface NavigationProps {
  onBookAppointment: () => void;
}

export default function Navigation({ onBookAppointment }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Hope Eye Care</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Services
            </button>
             <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('resources')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Resources
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </button>
            <button
              onClick={onBookAppointment}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsOpen(false); }} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
                About
              </button>
              <button onClick={() => scrollToSection('services')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
                Services
              </button>
              <button onClick={() => scrollToSection('resources')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
                Resources
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
                Contact
              </button>
              <button
                onClick={() => { onBookAppointment(); setIsOpen(false); }}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
