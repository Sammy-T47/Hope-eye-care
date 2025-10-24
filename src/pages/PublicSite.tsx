import { useState } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Resources from '../components/Resources';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import BookAppointment from '../components/BookAppointment';

export default function PublicSite() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navigation onBookAppointment={() => setShowBooking(true)} />

      <main className="pt-16">
        <Hero onBookAppointment={() => setShowBooking(true)} />
        <Services />
        <About />
        <Resources />
        <Contact />
      </main>

      <Footer />

      {showBooking && <BookAppointment onClose={() => setShowBooking(false)} />}
    </div>
  );
}
