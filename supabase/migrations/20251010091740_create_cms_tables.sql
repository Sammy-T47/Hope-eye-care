/*
  # Hope Eye Care CMS Database Schema

  ## Overview
  Complete content management system for the eye clinic website allowing staff to manage all content without code.

  ## New Tables

  ### 1. `services`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Service name (e.g., "Comprehensive Eye Exams")
  - `description` (text) - Service description
  - `icon_name` (text) - Lucide icon name for display
  - `display_order` (integer) - Order to display services
  - `is_active` (boolean) - Whether service is visible on website
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `doctors`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Doctor's full name
  - `title` (text) - Professional title (e.g., "Lead Ophthalmologist")
  - `qualification` (text) - Credentials (e.g., "MD, FACS")
  - `description` (text) - Professional background
  - `display_order` (integer) - Order to display doctors
  - `is_active` (boolean) - Whether doctor is visible on website
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `blog_posts`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Article title
  - `summary` (text) - Brief summary for cards
  - `content` (text) - Full article content (markdown supported)
  - `author` (text) - Article author name
  - `published_date` (timestamptz) - Publication date
  - `is_published` (boolean) - Whether article is visible
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `faqs`
  - `id` (uuid, primary key) - Unique identifier
  - `question` (text) - FAQ question
  - `answer` (text) - FAQ answer
  - `display_order` (integer) - Order to display FAQs
  - `is_active` (boolean) - Whether FAQ is visible
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. `clinic_info`
  - `id` (uuid, primary key) - Unique identifier
  - `key` (text, unique) - Setting key (e.g., "phone", "email", "address")
  - `value` (text) - Setting value
  - `updated_at` (timestamptz) - Last update timestamp

  ### 6. `admin_users`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text) - Admin email
  - `full_name` (text) - Admin full name
  - `role` (text) - Admin role (admin, editor, viewer)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for published content
  - Admin-only write access for all tables
  - Authenticated admin access for appointments and contact messages
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Eye',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  qualification text NOT NULL,
  description text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  content text NOT NULL,
  author text DEFAULT 'Hope Eye Care Staff',
  published_date timestamptz DEFAULT now(),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clinic_info table
CREATE TABLE IF NOT EXISTS clinic_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'viewer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table if not exists
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Services Policies
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all services"
  ON services FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Doctors Policies
CREATE POLICY "Anyone can view active doctors"
  ON doctors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert doctors"
  ON doctors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can update doctors"
  ON doctors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete doctors"
  ON doctors FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Blog Posts Policies
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- FAQs Policies
CREATE POLICY "Anyone can view active faqs"
  ON faqs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all faqs"
  ON faqs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert faqs"
  ON faqs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can update faqs"
  ON faqs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete faqs"
  ON faqs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Clinic Info Policies
CREATE POLICY "Anyone can view clinic info"
  ON clinic_info FOR SELECT
  USING (true);

CREATE POLICY "Admins can update clinic info"
  ON clinic_info FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can insert clinic info"
  ON clinic_info FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- Admin Users Policies
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Appointments Policies
CREATE POLICY "Anyone can insert appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Contact Messages Policies
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Insert default clinic info
INSERT INTO clinic_info (key, value) VALUES
  ('clinic_name', 'Hope Eye Care & Medical Services'),
  ('phone', '(555) 123-4567'),
  ('email', 'info@hopeeyecare.com'),
  ('address', '123 Vision Street, Medical Plaza'),
  ('city_state_zip', 'San Francisco, CA 94102'),
  ('hours_weekday', 'Monday - Friday: 9:00 AM - 6:00 PM'),
  ('hours_saturday', 'Saturday: 9:00 AM - 2:00 PM'),
  ('hours_sunday', 'Sunday: Closed')
ON CONFLICT (key) DO NOTHING;

-- Insert default services
INSERT INTO services (title, description, icon_name, display_order, is_active) VALUES
  ('Comprehensive Eye Exams', 'Thorough vision assessments and eye health evaluations using the latest diagnostic technology.', 'ClipboardCheck', 1, true),
  ('Eyeglasses & Contact Lenses', 'Wide selection of frames and lenses. Expert fitting for contact lenses tailored to your lifestyle.', 'Glasses', 2, true),
  ('LASIK & Laser Surgery', 'Advanced laser vision correction procedures for freedom from glasses and contacts.', 'Zap', 3, true),
  ('Pediatric Eye Care', 'Specialized eye care for children, including vision screenings and amblyopia treatment.', 'Baby', 4, true),
  ('Diabetic Eye Screening', 'Regular monitoring and treatment for diabetes-related eye conditions to prevent vision loss.', 'Heart', 5, true),
  ('Medical Eye Care', 'Treatment for cataracts, glaucoma, macular degeneration, and other eye diseases.', 'Eye', 6, true)
ON CONFLICT DO NOTHING;

-- Insert default doctors
INSERT INTO doctors (name, title, qualification, description, display_order, is_active) VALUES
  ('Dr. Sarah Mitchell', 'Lead Ophthalmologist', 'MD, FACS', '20+ years specializing in cataract surgery and refractive procedures.', 1, true),
  ('Dr. James Chen', 'Pediatric Specialist', 'MD, PhD', 'Expert in children''s vision care and developmental eye conditions.', 2, true),
  ('Dr. Maria Rodriguez', 'Optometrist', 'OD, FAAO', 'Comprehensive eye exams and contact lens specialist for 15+ years.', 3, true)
ON CONFLICT DO NOTHING;

-- Insert default blog posts
INSERT INTO blog_posts (title, summary, content, is_published) VALUES
  ('Understanding Blue Light and Screen Time', 'Learn about digital eye strain and how to protect your eyes in the digital age.', 'In today''s digital world, we spend more time than ever looking at screens...', true),
  ('Early Signs of Cataracts', 'Recognize the symptoms and understand when to seek treatment for cataracts.', 'Cataracts are a common age-related eye condition...', true),
  ('Maintaining Eye Health with Diabetes', 'Essential tips for preventing diabetic retinopathy and preserving your vision.', 'If you have diabetes, regular eye exams are crucial...', true)
ON CONFLICT DO NOTHING;

-- Insert default FAQs
INSERT INTO faqs (question, answer, display_order, is_active) VALUES
  ('How often should I get an eye exam?', 'Adults should have a comprehensive eye exam every 1-2 years, or annually if you wear glasses/contacts or have risk factors like diabetes. Children should have their first exam at 6 months, then at age 3, and before starting school.', 1, true),
  ('What should I bring to my appointment?', 'Please bring your current glasses, contact lenses (if applicable), a list of medications you''re taking, your insurance card, and any relevant medical records or previous eye prescriptions.', 2, true),
  ('Do you accept insurance?', 'Yes, we accept most major insurance plans including VSP, EyeMed, Medicare, and many others. Please contact our office to verify your specific coverage.', 3, true),
  ('Am I a candidate for LASIK?', 'Most people over 18 with stable vision for at least a year are good candidates. However, this depends on factors like corneal thickness, prescription strength, and overall eye health. Schedule a consultation for a personalized assessment.', 4, true),
  ('How long does a typical eye exam take?', 'A comprehensive eye exam usually takes 45-60 minutes. This includes time for dilation if needed, which we recommend for thorough evaluation of your eye health.', 5, true),
  ('Can I drive after my eye exam?', 'If your eyes are dilated, your vision may be blurry and light-sensitive for 2-4 hours. We recommend bringing sunglasses and arranging a ride if possible.', 6, true)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_doctors_active ON doctors(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_date DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date, preferred_time);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
