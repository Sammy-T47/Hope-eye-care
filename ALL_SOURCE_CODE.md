# Complete CMS System - All Source Code

## 🎯 Overview

This document contains ALL the source code you need to create a complete CMS system for Hope Eye Care.

**What's included:**
- ✅ Public website (for patients)
- ✅ Admin dashboard (for staff)
- ✅ Full database integration
- ✅ Authentication system
- ✅ Content management (no code needed!)

---

## 📋 Setup Checklist

1. ✅ Database migration complete (already done!)
2. ⬜ Update App.tsx with routing
3. ⬜ Create admin files (code below)
4. ⬜ Create first admin user in Supabase
5. ⬜ Run `npm run dev`
6. ⬜ Login at `/admin/login`

---

## 🔐 Creating Your First Admin User

### In Supabase Dashboard:

1. **Authentication** → **Users** → **Add user**
2. Enter:
   - Email: `admin@hopeeyecare.com`
   - Password: (your secure password)
   - ✅ Auto Confirm User
3. **Copy the UUID** shown in the users list
4. Go to **SQL Editor** and run:

```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES ('YOUR_USER_UUID_HERE', 'admin@hopeeyecare.com', 'Your Name', 'admin');
```

---

## 📁 Files to Create/Update

### ✏️ UPDATE: package.json

Add `"react-router-dom": "^6.20.0"` to dependencies (already installed!)

---

### ✏️ UPDATE: src/App.tsx

Replace the entire file with:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PublicSite from './pages/PublicSite';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './admin/Dashboard';
import AdminLayout from './admin/AdminLayout';
import ServicesManager from './admin/ServicesManager';
import DoctorsManager from './admin/DoctorsManager';
import BlogManager from './admin/BlogManager';
import FAQsManager from './admin/FAQsManager';
import AppointmentsManager from './admin/AppointmentsManager';
import MessagesManager from './admin/MessagesManager';
import SettingsManager from './admin/SettingsManager';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicSite />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="doctors" element={<DoctorsManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="faqs" element={<FAQsManager />} />
            <Route path="appointments" element={<AppointmentsManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

### ✨ CREATE: src/contexts/AuthContext.tsx

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setAdminUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setAdminUser(data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      adminUser,
      isAdmin: !!adminUser,
      loading,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

### ✨ CREATE: src/components/ProtectedRoute.tsx

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
```

---

### ✨ CREATE: src/pages/PublicSite.tsx

Move your current App.tsx content here:

```typescript
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
```

---

I'll continue this document with all admin components. Due to length, would you like me to:

1. **Create separate MD files** for each major section (Admin Components, Pages, etc.)
2. **Create a ZIP structure document** showing where each file goes
3. **Continue with inline code** in this document

Which would be most helpful for pasting into VS Code?
