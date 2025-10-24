/*
  # Eye Clinic Appointments System

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key) - Unique identifier for each appointment
      - `patient_name` (text) - Full name of the patient
      - `patient_email` (text) - Email address for confirmation
      - `patient_phone` (text) - Contact phone number
      - `preferred_date` (date) - Requested appointment date
      - `preferred_time` (text) - Requested appointment time slot
      - `reason` (text) - Reason for visit/service requested
      - `status` (text) - Appointment status (pending, confirmed, cancelled, completed)
      - `notes` (text, optional) - Additional notes or comments
      - `created_at` (timestamptz) - Timestamp when appointment was requested
      - `updated_at` (timestamptz) - Last update timestamp

    - `contact_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `name` (text) - Sender's name
      - `email` (text) - Sender's email
      - `phone` (text, optional) - Sender's phone number
      - `message` (text) - Message content
      - `created_at` (timestamptz) - Timestamp when message was sent

  2. Security
    - Enable RLS on both tables
    - Allow public insert for appointments (anyone can book)
    - Allow public insert for contact messages (anyone can send)
    - Restrict read/update/delete to authenticated admin users only

  3. Important Notes
    - Appointments default to 'pending' status
    - Timestamps automatically track creation and updates
    - Email validation should be handled at application level
    - Phone numbers stored as text for international format flexibility
*/

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  patient_email text NOT NULL,
  patient_phone text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Appointments policies: Allow anyone to insert (book appointments)
CREATE POLICY "Anyone can book appointments"
  ON appointments FOR INSERT
  TO anon
  WITH CHECK (true);

-- Contact messages policies: Allow anyone to send messages
CREATE POLICY "Anyone can send contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for appointments table
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();