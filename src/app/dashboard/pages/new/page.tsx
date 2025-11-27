import { PageSetupForm } from '@/components/dashboard/PageSetupForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function NewPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    return (
        <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <PageSetupForm />
        </div>
    );
}
