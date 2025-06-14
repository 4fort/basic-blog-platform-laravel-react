import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate, getUserInitials } from '@/lib/utils';
import { useViewPostContext } from '@/providers/view-post-context';
import { Post, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ArrowBigDown, ArrowBigUp, Loader2, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { TextareaAutoSize } from '../ui/textarea';

export default function ViewPostDialog() {
    const { isOpen, setIsOpen, postId } = useViewPostContext();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false);
    const { props } = usePage<SharedData & { posts?: Post[] }>();

    useEffect(() => {
        if (isOpen && postId) {
            setLoading(true);

            // const existingPost = props.posts?.find((p) => p.id === postId);
            // if (existingPost) {
            //     setPost(existingPost);
            //     setLoading(false);
            //     return;
            // }

            fetch(route('posts.show', postId), {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setPost(data.post);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [isOpen, postId, props.posts]);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[90vh] w-4/5! max-w-4/5! overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Post Details</DialogTitle>
                    </DialogHeader>

                    <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="animate-spin text-muted-foreground" />
                            </div>
                        ) : post ? (
                            <div className="space-y-4 pr-2">
                                <div className="flex gap-3">
                                    <Avatar className="size-10 flex-shrink-0">
                                        <AvatarImage src={post.user?.email} dicebear />
                                        <AvatarFallback>{getUserInitials(post.user?.name || 'Unknown User')}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="truncate font-semibold">{post.user?.name || 'Unknown User'}</h3>
                                            <span className="text-muted-foreground">•</span>
                                            <p className="text-sm whitespace-nowrap text-muted-foreground">{formatDate(post.created_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {post.title && <h2 className="text-xl font-bold break-words hyphens-auto">{post.title}</h2>}
                                    <p className="overflow-wrap-anywhere text-base break-words hyphens-auto whitespace-pre-wrap">{post.body}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 pt-2">
                                    <Button variant="ghost" className="text-muted-foreground">
                                        <ArrowBigUp />
                                        <span>Upvote</span>
                                    </Button>
                                    <Button variant="ghost" className="text-muted-foreground">
                                        <ArrowBigDown />
                                        <span>Downvote</span>
                                    </Button>
                                    <Button variant="ghost" className="text-muted-foreground">
                                        <MessageCircle />
                                        <span>Comment</span>
                                    </Button>
                                </div>

                                <div className="p-1">
                                    <ViewPostDialogCommentForm />
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">Post not found</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function ViewPostDialogCommentForm() {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="mt-4">
            <TextareaAutoSize
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Write a comment..."
                minRows={2}
                maxRows={4}
                className="w-full resize-none"
            />
            <div
                className="mt-2 grid justify-end overflow-hidden"
                style={{
                    opacity: isFocused ? 1 : 0,
                    marginTop: isFocused ? '8px' : `-36px`,
                    pointerEvents: isFocused ? 'auto' : 'none',
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                <Button
                    onClick={() => {
                        // Handle comment submission logic here
                    }}
                    className="overlap-hidden"
                    disabled={!isFocused}
                >
                    Reply
                </Button>
            </div>
        </div>
    );
}
