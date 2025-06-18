import PostForm from '@/components/post-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Post, Tag } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Post',
        href: '/posts/edit',
    },
];

interface EditProps {
    post: Post;
    tags: Tag[];
}

export default function EditPost({ post: post_data, tags }: EditProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: post_data.title || '',
        body: post_data.body || '',
        tags: post_data.tags ? post_data.tags.map((t: Tag) => t.id) : [],
    });

    const handleChange = (newData: typeof data) => {
        setData(newData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('posts.update', post_data.id), {
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
            <Head title="Edit Post" />
            <div className="p-4">
                <PostForm
                    initialData={data}
                    tags={tags}
                    errors={errors}
                    processing={processing}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    submitLabel="Update"
                />
            </div>
        </AppLayout>
    );
}
