-- Seed data for SmartQ application
-- Run this after schema.sql to populate demo data

-- Note: You'll need to create users through Supabase Auth first
-- Then you can link them here using their UUIDs

-- Example: Insert demo businesses (update UUIDs with real user IDs from auth.users)
-- INSERT INTO public.businesses (owner_id, name, description, category, address, phone, email)
-- VALUES 
-- (
--     'your-user-uuid-here',
--     'SmartQ Dental Clinic',
--     'Professional dental services with advanced technology',
--     'healthcare',
--     '123 Health Street, Medical District',
--     '+1-555-0123',
--     'info@smartqdental.com'
-- );

-- Example: Insert demo services
-- INSERT INTO public.services (business_id, name, description, duration, price, category)
-- VALUES 
-- (
--     'your-business-uuid-here',
--     'General Checkup',
--     'Regular dental checkup and cleaning',
--     30,
--     75.00,
--     'general'
-- );

-- You can create demo users programmatically using the Supabase dashboard or API
-- For now, this file is a template for your seed data
