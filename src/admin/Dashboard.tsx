import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, MessageSquare, Briefcase, Users, FileText, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  appointments: number;
  messages: number;
  services: number;
  doctors: number;
  posts: number;
  faqs: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    appointments: 0,
    messages: 0,
    services: 0,
    doctors: 0,
    posts: 0,
    faqs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [appointments, messages, services, doctors, posts, faqs] = await Promise.all([
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('doctors').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('faqs').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        appointments: appointments.count || 0,
        messages: messages.count || 0,
        services: services.count || 0,
        doctors: doctors.count || 0,
        posts: posts.count || 0,
        faqs: faqs.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Appointments', value: stats.appointments, icon: Calendar, color: 'blue', link: '/admin/appointments' },
    { title: 'Messages', value: stats.messages, icon: MessageSquare, color: 'green', link: '/admin/messages' },
    { title: 'Services', value: stats.services, icon: Briefcase, color: 'purple', link: '/admin/services' },
    { title: 'Doctors', value: stats.doctors, icon: Users, color: 'orange', link: '/admin/doctors' },
    { title: 'Blog Posts', value: stats.posts, icon: FileText, color: 'pink', link: '/admin/blog' },
    { title: 'FAQs', value: stats.faqs, icon: HelpCircle, color: 'indigo', link: '/admin/faqs' },
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage your clinic's website content, appointments, and messages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${colorClasses[card.color as keyof typeof colorClasses]} p-4 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/services"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Briefcase className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900">Add Service</p>
            <p className="text-sm text-gray-600">Create a new service</p>
          </Link>
          <Link
            to="/admin/doctors"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900">Add Doctor</p>
            <p className="text-sm text-gray-600">Add team member</p>
          </Link>
          <Link
            to="/admin/blog"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900">Write Post</p>
            <p className="text-sm text-gray-600">Create blog article</p>
          </Link>
          <Link
            to="/admin/appointments"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Calendar className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900">View Appointments</p>
            <p className="text-sm text-gray-600">Manage bookings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
