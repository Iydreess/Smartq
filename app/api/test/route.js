/**
 * Test API route to verify Supabase connectivity
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    return NextResponse.json({
      status: 'ok',
      supabaseUrl,
      hasAnonKey,
      configured: !!(supabaseUrl && hasAnonKey),
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
    }, { status: 500 })
  }
}
