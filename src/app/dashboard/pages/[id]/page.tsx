import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { BuilderEditor } from '@/components/builder/BuilderEditor';
import { PageRecord } from '@/types/database';

interface BuilderPageProps {
    params: Promise<{ id: string }>;
}

export default async function BuilderPage({ params }: BuilderPageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !page) notFound();

    return <BuilderEditor page={page as PageRecord} />;
}
