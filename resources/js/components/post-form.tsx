import InputError from '@/components/input-error';
import PostTagsSelector from '@/components/post-tags-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag } from '@/types';
import MDEditor from '@uiw/react-md-editor';
import React, { useEffect, useRef } from 'react';

interface PostFormProps {
    initialData: {
        title: string;
        body: string;
        tags: Tag['id'][];
    };
    tags: Tag[];
    errors: Record<string, string>;
    processing: boolean;
    onChange: (data: { title: string; body: string; tags: Tag['id'][] }) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}

export default function PostForm({ initialData, tags, errors, processing, onChange, onSubmit, submitLabel }: PostFormProps) {
    const [data, setData] = React.useState(initialData);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const cursorPosRef = useRef<number | null>(null);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    useEffect(() => {
        const textarea = document.querySelector('.w-md-editor textarea, textarea[role="textbox"]') as HTMLTextAreaElement | null;
        if (textarea) {
            textareaRef.current = textarea;
        }
    }, []);

    useEffect(() => {
        if (cursorPosRef.current !== null && textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursorPosRef.current;
            textareaRef.current.focus();
            cursorPosRef.current = null;
        }
    }, [data.body]);

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

    const insertAtCursor = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) {
            setData((prev) => ({ ...prev, body: prev.body + text }));
            onChange({ ...data, body: data.body + text });
            return;
        }
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = data.body.substring(0, start);
        const after = data.body.substring(end);
        const newBody = before + text + after;
        setData((prev) => ({ ...prev, body: newBody }));
        onChange({ ...data, body: newBody });
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
            textarea.focus();
        }, 0);
    };

    const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
        const clipboardData = e.clipboardData;
        if (clipboardData.files.length === 1) {
            const file = clipboardData.files[0];
            if (file.type.startsWith('image/')) {
                const placeholderId = `Uploading image...${Date.now()}_${Math.random().toString(36).slice(2)}`;
                const tempText = `[${placeholderId}]`;
                insertAtCursor(`\n${tempText}\n`);
                const url = await imageUploadHandler(file);
                const markdown = url ? `![ImageAlt](${url})` : 'Image upload failed. Please try again.';
                const textarea = textareaRef.current;
                if (textarea) {
                    const currentValue = textarea.value;
                    const markdownWithNewline = markdown + '\n\n';
                    const newValue = currentValue.replace(tempText, markdownWithNewline);
                    const idx = newValue.indexOf(markdownWithNewline);
                    if (idx !== -1) {
                        cursorPosRef.current = idx + markdownWithNewline.length;
                    }
                    setData((prev) => ({ ...prev, body: newValue }));
                    onChange({ ...data, body: newValue });
                } else {
                    setData((prev) => ({ ...prev, body: (prev.body || '').replace(tempText, markdown + '\n') }));
                    onChange({ ...data, body: (data.body || '').replace(tempText, markdown + '\n') });
                }
            }
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
                <Input
                    type="text"
                    value={data.title}
                    onChange={(e) => {
                        let value = e.target.value;
                        if (value.length > 255) {
                            value = value.slice(0, 255);
                        }
                        setData((prev) => ({ ...prev, title: value }));
                        onChange({ ...data, title: value });
                    }}
                    className="px-4 py-6 text-xl! font-semibold"
                    placeholder="Title"
                    disabled={processing}
                />
                <div className="text-right text-sm text-muted-foreground">{data.title.length}/255</div>
            </div>
            <PostTagsSelector
                tagItems={tags}
                tags={data.tags}
                setTags={(newTags) => {
                    setData((prev) => ({ ...prev, tags: newTags }));
                    onChange({ ...data, tags: newTags });
                }}
            />
            <div className="">
                <MDEditor
                    value={data.body}
                    onChange={(value) => {
                        setData((prev) => ({ ...prev, body: value || '' }));
                        onChange({ ...data, body: value || '' });
                    }}
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
                <Button type="submit">{processing ? submitLabel + '...' : submitLabel}</Button>
            </div>
        </form>
    );
}
