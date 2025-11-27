import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { PublicPageRenderer } from '@/components/public/PublicPageRenderer';
import { PageWithProfile } from '@/types/database';

interface PageProps {
    params: Promise<{ username: string; slug: string; }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username, slug } = await params;
    const supabase = await createClient();

    const { data: page } = await supabase
        .from('pages')
        .select('*, profiles!inner(username)')
        .eq('profiles.username', username)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (!page) return { title: 'Page Not Found' };

    return {
        title: page.seo_title || page.title,
        description: page.seo_description || `${page.title} - Linq`,
        openGraph: {
            title: page.seo_title || page.title,
            description: page.seo_description || `${page.title} - Linq`,
            images: page.seo_image ? [page.seo_image] : [],
        },
    };
}

export default async function PublicPage({ params }: PageProps) {
    const { username, slug } = await params;
    const supabase = await createClient();

    const { data: page, error } = await supabase
        .from('pages')
        .select('*, profiles!inner(username, full_name, avatar_url)')
        .eq('profiles.username', username)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !page) notFound();

    // Cast to PageWithProfile since we know the shape matches
    const pageWithProfile = page as unknown as PageWithProfile;

    return <PublicPageRenderer page={pageWithProfile} />;
}
