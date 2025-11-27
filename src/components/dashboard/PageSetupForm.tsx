'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createPage } from '@/app/actions/pages';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const schema = z.object({
    title: z.string().min(1, 'Title is required').max(50, 'Title is too long'),
    slug: z.string()
        .min(1, 'URL slug is required')
        .max(50, 'URL slug is too long')
        .regex(/^[a-z0-9-]+$/, 'URL can only contain lowercase letters, numbers, and hyphens'),
});

type FormData = z.infer<typeof schema>;

export function PageSetupForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            const result = await createPage(data.title, data.slug);

            if (result.success && result.pageId) {
                toast.success('Page created successfully');
                router.push(`/dashboard/pages/${result.pageId}`);
            } else {
                toast.error(result.error || 'Failed to create page');
            }
        });
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create New Page</CardTitle>
                <CardDescription>Give your page a title and a unique URL.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Page Title</Label>
                        <Input
                            id="title"
                            placeholder="My Awesome Page"
                            {...register('title')}
                            disabled={isPending}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">linq.com/username/</span>
                            <Input
                                id="slug"
                                placeholder="my-page"
                                {...register('slug')}
                                disabled={isPending}
                            />
                        </div>
                        {errors.slug && (
                            <p className="text-sm text-destructive">{errors.slug.message}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Page
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
