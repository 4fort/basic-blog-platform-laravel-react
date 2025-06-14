import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNewPostContext } from '@/providers/new-post-context';
import { type SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from './input-error';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { TextareaAutoSize } from './ui/textarea';

export default function NewPostDialog() {
    const { isOpen, setIsOpen } = useNewPostContext();
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: auth.user.id,
        body: '',
    });

    // Reset form when dialog opens
    useEffect(() => {
        if (isOpen) {
            reset();
            // Force clear the body field to ensure fresh state
            setData('body', '');
        }
    }, [isOpen, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('posts.store'), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
            onError: (formErrors) => {
                console.error('Form submission error:', formErrors);
            },
        });
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit} className="space-y-4" key={isOpen ? 'open' : 'closed'}>
                        <DialogHeader>
                            <DialogTitle>New Post</DialogTitle>
                        </DialogHeader>

                        <div className="flex gap-2">
                            <div className="">
                                <Avatar className="size-9">
                                    <AvatarImage dicebear src={auth.user.avatar} alt={auth.user.name} />
                                    <AvatarFallback>{auth.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex grow flex-col gap-2">
                                <TextareaAutoSize
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    className="field-sizing-content max-h-96 min-h-24 resize-none text-xl!"
                                    placeholder="What's on your mind?"
                                    disabled={processing}
                                />
                                <InputError message={errors.body} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing || !data.body.trim()}>
                                {processing ? 'Posting...' : 'Post'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
