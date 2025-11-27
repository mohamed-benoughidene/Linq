'use client';

import { PageRecord } from '@/types/database';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ExternalLink, Eye } from 'lucide-react';
import Link from 'next/link';
import { deletePage } from '@/app/actions/pages';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PageCardProps {
    page: PageRecord;
    username: string;
}

export function PageCard({ page, username }: PageCardProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this page?')) return;

        const result = await deletePage(page.id);
        if (result.success) {
            toast.success('Page deleted successfully');
            router.refresh();
        } else {
            toast.error(result.error || 'Failed to delete page');
        }
    };

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="truncate" title={page.title}>
                        {page.title}
                    </CardTitle>
                    <Badge variant={page.is_published ? 'default' : 'secondary'}>
                        {page.is_published ? 'Published' : 'Draft'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground truncate">
                    /{page.slug}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    Last updated: {new Date(page.updated_at).toLocaleDateString()}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/dashboard/pages/${page.id}`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
                {page.is_published && (
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/${username}/${page.slug}`} target="_blank" title="View Public Page">
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
