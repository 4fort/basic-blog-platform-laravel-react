import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Post',
        href: '/posts/create',
    },
];

export default function CreatePost() {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        body: '',
    });

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const clipboardData = e.clipboardData;

        if (clipboardData.files.length === 1) {
            const file = clipboardData.files[0];
            if (file.type.startsWith('image/')) {
                console.log('Pasted image file:', file);
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Post" />
            <div className="p-4">
                <div className="space-y-1">
                    <Input
                        type="text"
                        value={data.title}
                        onChange={(e) => {
                            if (e.target.value.length > 255) {
                                e.target.value = e.target.value.slice(0, 255);
                            }
                            setData('title', e.target.value);
                        }}
                        className="px-4 py-6 text-xl! font-semibold"
                        placeholder="Title"
                        disabled={processing}
                    />
                    <div className="text-right text-sm text-muted-foreground">{data.title.length}/255</div>
                </div>
                <div className="">
                    <MDEditor
                        value={data.body}
                        onChange={(value) => setData('body', value || '')}
                        height={500}
                        preview="live"
                        className="rounded-lg! border bg-background! p-4"
                        textareaProps={{
                            placeholder: 'Write your post content here...',
                            disabled: processing,
                        }}
                        onPaste={handlePaste}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
