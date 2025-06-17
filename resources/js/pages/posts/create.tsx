import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        body: '',
    });
    // const prevBodyRef = useRef(data.body);

    const imageUploadHandler = async (image: File) => {
        if (image && image.size === 0) return null;

        const formData = new FormData();
        formData.append('image', image);

        const res = await fetch(route('posts.image.upload'), {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        });

        if (!res.ok) {
            console.error('Image upload failed:', res.statusText);
            return null;
        }

        const data = await res.json();
        return data.url || null;
    };

    const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
        const clipboardData = e.clipboardData;

        if (clipboardData.files.length === 1) {
            const file = clipboardData.files[0];
            if (file.type.startsWith('image/')) {
                const tempText = '![uploading...](uploading...)';
                const initialBodyWithPlaceholder = `${data.body}\n${tempText}\n`;
                setData('body', initialBodyWithPlaceholder);

                const url = await imageUploadHandler(file);

                if (url) {
                    setData('body', initialBodyWithPlaceholder.replace(tempText, `![ImageAlt](${url})`));
                } else {
                    setData('body', initialBodyWithPlaceholder.replace(tempText, 'Image upload failed. Please try again.'));
                }
            }
        }
    };

    // const extractImageUrls = (markdown: string): string[] => {
    //     const regex = /!\[.*?\]\((.*?)\)/g;
    //     const urls: string[] = [];
    //     let match;
    //     while ((match = regex.exec(markdown)) !== null) {
    //         urls.push(match[1]);
    //     }
    //     return urls;
    // };

    // const deleteImageFromServer = async (url: string) => {
    //     console.log('deleting');
    //     try {
    //         const response = await fetch(route('posts.image.delete'), {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
    //             },
    //             body: JSON.stringify({ url }),
    //         });
    //         if (!response.ok) {
    //             console.error('Failed to delete image:', url, response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Error deleting image:', error);
    //     }
    // };

    // useEffect(() => {
    //     const currentUrls = extractImageUrls(data.body);
    //     const previousUrls = extractImageUrls(prevBodyRef.current);

    //     const removedUrls = previousUrls.filter((url) => !currentUrls.includes(url));

    //     removedUrls.forEach((url) => {
    //         if (url.startsWith(window.location.origin + '/storage/') || url.startsWith('/storage/')) {
    //             deleteImageFromServer(url);
    //         }
    //     });

    //     prevBodyRef.current = data.body;
    // }, [data.body]);

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
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <InputError message={errors.body} />
                    <div className="flex justify-end">
                        <Button type="submit">{processing ? 'Posting...' : 'Post'}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
