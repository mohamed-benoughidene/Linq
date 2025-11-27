import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { PagesList } from '@/components/dashboard/PagesList'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Pages</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your link-in-bio pages
        </p>
      </div>
      <PagesList pages={pages || []} username={profile?.username || 'user'} />
    </div>
  )
}
