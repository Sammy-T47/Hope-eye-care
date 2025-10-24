# Complete Source Code - Hope Eye Care CMS System

## System Overview

This is a complete CMS (Content Management System) with:
1. **Public Website** - Patients see services, doctors, blog posts, book appointments
2. **Admin Dashboard** - Staff login to manage all content without touching code
3. **Supabase Database** - Stores everything with secure Row Level Security

## Installation Instructions

1. Create a new project folder
2. Copy all files below into their respective locations
3. Run `npm install`
4. Update `.env` with your Supabase credentials
5. Create an admin user in Supabase (see instructions below)
6. Run `npm run dev`

## Creating Your First Admin User

After setting up the database, you need to create an admin user:

1. Go to your Supabase Dashboard
2. Navigate to Authentication → Users
3. Click "Add user" → Create new user
4. Enter email and password
5. Copy the user's UUID
6. Go to SQL Editor and run:

```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES ('paste-user-uuid-here', 'admin@hopeeyecare.com', 'Admin Name', 'admin');
```

Now you can login at `/admin/login`

---

## File Structure

```
project/
├── src/
│   ├── components/          # Public website components
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── About.tsx
│   │   ├── Resources.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   └── BookAppointment.tsx
│   ├── admin/              # Admin dashboard components
│   │   ├── AdminLayout.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ServicesManager.tsx
│   │   ├── DoctorsManager.tsx
│   │   ├── BlogManager.tsx
│   │   ├── FAQsManager.tsx
│   │   ├── AppointmentsManager.tsx
│   │   ├── MessagesManager.tsx
│   │   └── SettingsManager.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── AdminLogin.tsx
│   │   └── PublicSite.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── .env
```

---

## Complete Source Files

### 📁 Root Files

#### **package.json**
```json
{
  "name": "hope-eye-care-cms",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
```

