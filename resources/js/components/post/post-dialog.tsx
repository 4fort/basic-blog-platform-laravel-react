import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePostDialogContext } from '@/providers/post-dialog-context';
import { type SharedData } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from '../input-error';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { TextareaAutoSize } from '../ui/textarea';

export default function PostDialog() {
    const { isOpen, setIsOpen, selectedPost, setSelectedPost } = usePostDialogContext();
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        body: '',
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            setData('title', '');
            setData('body', '');

            if (selectedPost) {
                setData('title', selectedPost.title || '');
                setData('body', selectedPost.body || '');
            }
        } else {
            setSelectedPost(null);
        }
    }, [isOpen, reset, setData, selectedPost, setSelectedPost]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedPost) {
            put(route('posts.update', selectedPost.id), {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                },
                onError: (formErrors) => {
                    console.error('Form submission error:', formErrors);
                },
                preserveScroll: true,
            });
        } else {
            post(route('posts.store'), {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                },
                onError: (formErrors) => {
                    console.error('Form submission error:', formErrors);
                },
            });
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit} className="space-y-4" key={isOpen ? 'open' : 'closed'}>
                        <DialogHeader>
                            <DialogTitle>{selectedPost ? 'Edit Post' : 'New Post'}</DialogTitle>
                        </DialogHeader>

                        <div className="flex gap-2">
                            <div className="">
                                <Avatar className="size-9">
                                    <AvatarImage dicebear src={auth.user.email} alt={auth.user.name} />
                                    <AvatarFallback>{auth.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex grow flex-col gap-2">
                                <Input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="text-xl! font-semibold"
                                    placeholder="A very catchy title"
                                    disabled={processing}
                                />
                                <TextareaAutoSize
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    className="field-sizing-content max-h-96 min-h-24 resize-none text-lg!"
                                    placeholder="What's on your mind?"
                                    disabled={processing}
                                />
                                <InputError message={errors.body} />
                                <Button variant="secondary" type="button" onClick={() => router.get(route('posts.edit', selectedPost?.id))}>
                                    Switch To Markdown Editor
                                </Button>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing || !data.body.trim()}>
                                {processing ? 'Posting...' : selectedPost ? 'Update' : 'Post'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
