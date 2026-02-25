-- Fix Row Level Security Policies for Appointments
-- Run this in your Supabase SQL Editor

-- Drop existing restrictive policies on appointments if any
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Business owners can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;

-- Allow authenticated users to create appointments (requires sign in)
CREATE POLICY "Authenticated users can create appointments" ON public.appointments
    FOR INSERT
    WITH CHECK (auth.uid() = customer_id AND auth.uid() IS NOT NULL);

-- Allow users to view their own appointments
CREATE POLICY "Users can view their own appointments" ON public.appointments
    FOR SELECT
    USING (auth.uid() = customer_id);

-- Allow business owners to view their business appointments
CREATE POLICY "Business owners can view their business appointments" ON public.appointments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = appointments.business_id
            AND businesses.owner_id = auth.uid()
        )
    );

-- Allow business owners to update their business appointments
CREATE POLICY "Business owners can update their business appointments" ON public.appointments
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = appointments.business_id
            AND businesses.owner_id = auth.uid()
        )
    );

-- Allow customers to cancel their own appointments
CREATE POLICY "Customers can cancel their own appointments" ON public.appointments
    FOR UPDATE
    USING (auth.uid() = customer_id)
    WITH CHECK (status = 'cancelled');

-- Allow admins to manage all appointments
CREATE POLICY "Admins can manage all appointments" ON public.appointments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
