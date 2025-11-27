'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState, useTransition } from 'react';
import { togglePublishStatus } from '@/app/actions/pages';
import { toast } from 'sonner';

interface PublishToggleProps {
    pageId: string;
    initialIsPublished: boolean;
}

export function PublishToggle({ pageId, initialIsPublished }: PublishToggleProps) {
    const [isPublished, setIsPublished] = useState(initialIsPublished);
    const [isPending, startTransition] = useTransition();

    const handleToggle = (checked: boolean) => {
        // Optimistic update
        setIsPublished(checked);

        startTransition(async () => {
            const result = await togglePublishStatus(pageId, checked);

            if (result.success) {
                toast.success(checked ? 'Page published' : 'Page unpublished');
            } else {
                // Revert on error
                setIsPublished(!checked);
                toast.error(result.error || 'Failed to update publish status');
            }
        });
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch
                id="publish-mode"
                checked={isPublished}
                onCheckedChange={handleToggle}
                disabled={isPending}
            />
            <Label htmlFor="publish-mode" className="text-sm font-medium">
                {isPublished ? 'Published' : 'Draft'}
            </Label>
        </div>
    );
}
