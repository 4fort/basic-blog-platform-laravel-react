import PostForm from '@/components/post-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Tag } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Post',
        href: '/posts/create',
    },
];

export default function CreatePost({ tags }: { tags: Tag[] }) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        title: string;
        body: string;
        tags: Tag['id'][];
    }>({
        title: '',
        body: '',
        tags: [],
    });

    const handleChange = (newData: typeof data) => {
        setData(newData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('posts.store'), {
            onSuccess: () => {
                reset();
            },
            onError: (formErrors) => {
                console.error('Form submission error:', formErrors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Post" />
            <div className="p-4">
                <PostForm
                    initialData={data}
                    tags={tags}
                    errors={errors}
                    processing={processing}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    submitLabel="Post"
                />
            </div>
        </AppLayout>
    );
}
