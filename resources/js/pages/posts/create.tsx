import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Tag } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

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
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const cursorPosRef = useRef<number | null>(null);

    // Find the textarea after mount
    useEffect(() => {
        // MDEditor renders a textarea with role="textbox"
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
            setData('body', data.body + text);
            return;
        }
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = data.body.substring(0, start);
        const after = data.body.substring(end);
        setData('body', before + text + after);
        // Move cursor after inserted text
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
                    setData('body', newValue);
                } else {
                    setData('body', (data.body || '').replace(tempText, markdown + '\n'));
                }
            }
        }
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
                    <PostTagsSelector tagItems={tags} tags={data.tags} setTags={(newTags) => setData('tags', newTags)} />
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

export function PostTagsSelector({ tagItems, tags, setTags }: { tagItems: Tag[]; tags: Tag['id'][]; setTags: (tags: Tag['id'][]) => void }) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const filteredTags = tagItems.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
        <div className="">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary">Add Tags</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {/* <DropdownMenuLabel className="text-muted-foreground">Select Tags</DropdownMenuLabel> */}
                    <Input
                        type="text"
                        placeholder="Search tags..."
                        value={searchTerm}
                        onChange={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSearchTerm(e.target.value);
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="mb-2"
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="max-h-[calc(100svh-400px)] overflow-auto">
                        {filteredTags.map((tag) => (
                            <DropdownMenuCheckboxItem
                                key={tag.id}
                                checked={tags.includes(tag.id)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setTags([...tags, tag.id]);
                                    } else {
                                        setTags(tags.filter((t) => t !== tag.id));
                                    }
                                    setSearchTerm('');
                                }}
                                className="cursor-pointer"
                            >
                                {tag.name}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            if (tags.length > 0) {
                                setTags([]);
                            }
                        }}
                    >
                        <Trash2 /> Clear Tags
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, index) => {
                        const tagItem = tagItems.find((t) => t.id === tag);
                        if (!tagItem) return null; // Skip if tag not found

                        return (
                            <Badge key={index} onClick={() => setTags(tags.filter((t) => t !== tag))} className="cursor-pointer">
                                {tagItem.name} <span className="text-lg text-muted-foreground">&times;</span>
                            </Badge>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
