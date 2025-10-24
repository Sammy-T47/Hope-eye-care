# Hope Eye Care - Complete CMS System Setup Guide

## 🎯 What You're Building

A professional eye clinic website with a full admin dashboard where staff can:
- ✅ Manage services (add, edit, delete, reorder)
- ✅ Manage doctors (add, edit, delete, reorder)
- ✅ Manage blog posts (write, publish, edit)
- ✅ Manage FAQs (add, edit, delete, reorder)
- ✅ View and manage appointments
- ✅ View contact messages
- ✅ Update clinic information (phone, email, hours)

**No code changes needed** - Everything managed through the admin dashboard!

---

## 📦 Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
The database migration has already been applied. It created:
- ✅ Services table
- ✅ Doctors table
- ✅ Blog posts table
- ✅ FAQs table
- ✅ Clinic info table
- ✅ Admin users table
- ✅ Appointments table
- ✅ Contact messages table

### 3. Create Your First Admin User

**Important:** You need to create an admin user to access the dashboard.

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** → **"Create new user"**
4. Enter:
   - Email: `admin@hopeeyecare.com` (or your preferred email)
   - Password: Create a secure password
   - ✅ Check "Auto Confirm User"
5. Click **"Create user"**
6. Copy the user's UUID (shown in the users list)
7. Go to **SQL Editor** and run:

```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES (
  'paste-the-user-uuid-here',
  'admin@hopeeyecare.com',
  'Admin Name',
  'admin'
);
```

#### Option B: Using SQL Editor Directly
```sql
-- This creates both the auth user and admin user in one go
-- Replace email and password
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Note: You'll need to create the user through Supabase Dashboard first
  -- This just adds them to admin_users table
END $$;
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Access Points
- **Public Website**: `http://localhost:5173`
- **Admin Login**: `http://localhost:5173/admin/login`
- **Admin Dashboard**: `http://localhost:5173/admin` (after login)

---

## 📁 Complete File List

I'll now provide ALL the source code files you need. Create each file in your VS Code project.

