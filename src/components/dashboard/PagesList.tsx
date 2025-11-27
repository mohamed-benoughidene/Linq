'use client';

import { PageRecord } from '@/types/database';
import { PageCard } from './PageCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface PagesListProps {
    pages: PageRecord[];
    username: string;
}

export function PagesList({ pages, username }: PagesListProps) {
    if (pages.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
                <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
                <p className="text-muted-foreground mb-4">Create your first page to get started.</p>
                <Button asChild>
                    <Link href="/dashboard/pages/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Page
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
                <PageCard key={page.id} page={page} username={username} />
            ))}

            {/* Add New Card */}
            <Link href="/dashboard/pages/new" className="block h-full">
                <div className="h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 hover:bg-muted/50 transition-colors cursor-pointer min-h-[200px]">
                    <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-muted-foreground font-medium">Create New Page</span>
                </div>
            </Link>
        </div>
    );
}
