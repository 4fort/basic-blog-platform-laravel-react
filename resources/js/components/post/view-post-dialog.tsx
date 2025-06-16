import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate, getUserInitials } from '@/lib/utils';
import { useViewPostContext } from '@/providers/view-post-context';
import { Comment, Post, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { ArrowBigDown, ArrowBigUp, Loader2, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '../input-error';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { TextareaAutoSize } from '../ui/textarea';

export default function ViewPostDialog() {
    const { isOpen, setIsOpen, postId } = useViewPostContext();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false);
    const { props } = usePage<SharedData & { posts?: Post[] }>();

    const addOptimisticComment = (commentBody: string) => {
        if (!post) return;

        const optimisticComment: Comment = {
            id: Date.now(),
            post_id: post.id,
            user_id: props.auth.user.id,
            body: commentBody,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user: props.auth.user,
            isOptimistic: true,
        };

        setPost((prev) =>
            prev
                ? {
                      ...prev,
                      comments: [optimisticComment, ...(prev.comments || [])],
                  }
                : null,
        );

        return optimisticComment.id;
    };

    const replaceOptimisticComment = (tempId: number, realComment: Comment) => {
        setPost((prev) =>
            prev
                ? {
                      ...prev,
                      comments: prev.comments?.map((comment) => (comment.id === tempId ? realComment : comment)) || [realComment],
                  }
                : null,
        );
    };

    const removeOptimisticComment = (tempId: number) => {
        setPost((prev) =>
            prev
                ? {
                      ...prev,
                      comments: prev.comments?.filter((comment) => comment.id !== tempId) || [],
                  }
                : null,
        );
    };

    useEffect(() => {
        if (isOpen && postId) {
            setLoading(true);

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
        } else if (!isOpen) {
            setPost(null);
        }
    }, [isOpen, postId]);

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
                                        <span>Comment ({post.comments?.length || 0})</span>
                                    </Button>
                                </div>

                                <div className="border-t pt-4">
                                    <ViewPostDialogCommentForm
                                        postId={post.id}
                                        onOptimisticComment={addOptimisticComment}
                                        onCommentSuccess={replaceOptimisticComment}
                                        onCommentError={removeOptimisticComment}
                                    />

                                    <div className="mt-6 space-y-4">
                                        <h3 className="text-sm font-semibold text-muted-foreground">Comments ({post.comments?.length || 0})</h3>

                                        {post.comments && post.comments.length > 0 ? (
                                            <div className="space-y-4">
                                                {post.comments.map((comment) => (
                                                    <CommentItem key={comment.id} comment={comment} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">No comments yet. Be the first to comment!</p>
                                        )}
                                    </div>
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

export function CommentItem({ comment }: { comment: Comment }) {
    return (
        <div className={`flex gap-3 ${comment.isOptimistic ? 'opacity-70' : ''}`}>
            <Avatar className="size-8 flex-shrink-0">
                <AvatarImage src={comment.user?.email} dicebear />
                <AvatarFallback className="text-xs">{getUserInitials(comment.user?.name || 'Unknown User')}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.user?.name || 'Unknown User'}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                    {comment.isOptimistic && <span className="text-xs text-muted-foreground italic">Posting...</span>}
                </div>
                <p className="text-sm break-words whitespace-pre-wrap text-gray-700">{comment.body}</p>
            </div>
        </div>
    );
}

export function ViewPostDialogCommentForm({
    postId,
    onOptimisticComment,
    onCommentSuccess,
    onCommentError,
}: {
    postId: number;
    onOptimisticComment: (commentBody: string) => number | undefined;
    onCommentSuccess: (tempId: number, realComment: Comment) => void;
    onCommentError: (tempId: number) => void;
}) {
    const [isFocused, setIsFocused] = useState(false);

    const { data, setData, processing, errors, reset, clearErrors } = useForm({
        body: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.body.trim()) return;

        clearErrors();

        const tempId = onOptimisticComment(data.body);
        if (!tempId) return;

        const commentBody = data.body;
        reset();
        setIsFocused(false);

        try {
            const response = await fetch(route('posts.comments.store', postId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    body: commentBody,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to post comment');
            }

            const result = await response.json();

            onCommentSuccess(tempId, result.comment);
        } catch (error) {
            console.error('Comment submission error:', error);

            onCommentError(tempId);

            setData('body', commentBody);
            setIsFocused(true);
        }
    };

    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-2">
                <TextareaAutoSize
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Write a comment..."
                    minRows={2}
                    maxRows={4}
                    className="w-full resize-none"
                    disabled={processing}
                />
                <InputError message={errors.body} />
                <div
                    className="mt-2 grid justify-end overflow-hidden"
                    style={{
                        opacity: isFocused || data.body.trim() ? 1 : 0,
                        marginTop: isFocused || data.body.trim() ? '8px' : `-36px`,
                        pointerEvents: isFocused || data.body.trim() ? 'auto' : 'none',
                        transition: 'all 0.2s ease-in-out',
                    }}
                >
                    <Button className="overlap-hidden" disabled={processing || !data.body.trim()} type="submit">
                        {processing ? 'Posting...' : 'Reply'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
