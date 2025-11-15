import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  console.log("Admin API called")
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Check user role (assuming you store role in user metadata)
  const userRole = user.user_metadata?.role

  if (userRole !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden: Admin access required' },
      { status: 403 }
    )
  }

  // Admin-only logic here
  return NextResponse.json({
    message: 'Admin data',
    userId: user.id,
  })
}