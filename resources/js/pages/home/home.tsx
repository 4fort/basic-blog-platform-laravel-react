import { PostCard } from '@/components/post-card/post-card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Post, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
    },
];

interface HomeProps extends SharedData {
    posts: Post[];
}

export default function Home() {
    const { flash, posts } = usePage<HomeProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                {posts.length > 0 ? (
                    posts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                    <div className="flex h-64 items-center justify-center">
                        <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
