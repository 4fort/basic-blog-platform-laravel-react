import InputError from '@/components/input-error';
import { PostCommentButton, PostOptionsDropdown } from '@/components/post/post-card/post-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TextareaAutoSize } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatDate, getUserInitials } from '@/lib/utils';
import { BreadcrumbItem, Comment, Post } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface PostProps {
    post: Post;
}

export default function PostPage({ post }: PostProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: post.title ?? post.body.slice(0, 10),
            href: `/post/${post.id}`,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title ?? post.body.slice(0, 10)} />
            <div className="border-b p-4">
                <div className="">
                    <Avatar className="size-9">
                        <AvatarImage src={post.user?.email} dicebear />
                        <AvatarFallback>{getUserInitials(post.user?.name || 'Unknown User')}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-1">
                    <section className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold">{post.user?.name || 'Unknown User'}</h2>
                            <span className="text-muted-foreground">•</span>
                            <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
                        </div>
                        <PostOptionsDropdown />
                    </section>
                    <article className="mt-2">
                        {post.title && <h3 className="text-lg font-bold">{post.title}</h3>}
                        <p className="break-all whitespace-pre-wrap">{post.body}</p>
                    </article>
                    <div className="mt-4 flex items-center gap-2">
                        {/* <PostUpvoteButton /> */}
                        {/* <PostDownvoteButton /> */}
                        <PostCommentButton post_id={post.id} count={post.comments?.length || 0} />
                    </div>
                </div>
            </div>
            <div className="border-b p-4">
                <PostCommentForm post_id={post.id} />
            </div>
            <div className="divide-x p-4">
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
        </AppLayout>
    );
}

export function PostCommentForm({ post_id }: { post_id: Post['id'] }) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        body: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('posts.comments.store', post_id), {
            onSuccess: () => {
                setData('body', '');
                clearErrors();
            },
            onError: (formErrors) => {
                console.error('Form submission error:', formErrors);
            },
        });
    };
    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-2">
                <TextareaAutoSize
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    placeholder="Write a comment..."
                    minRows={2}
                    maxRows={4}
                    className="w-full resize-none"
                    disabled={processing}
                />
                <InputError message={errors.body} />
                <div className="mt-2 grid justify-end overflow-hidden">
                    <Button className="overlap-hidden" disabled={processing || !data.body.trim()} type="submit">
                        {processing ? 'Posting...' : 'Reply'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export function CommentItem({ comment }: { comment: Comment }) {
    return (
        <div className="flex gap-3">
            <Avatar className="size-8 flex-shrink-0">
                <AvatarImage src={comment.user?.email} dicebear />
                <AvatarFallback className="text-xs">{getUserInitials(comment.user?.name || 'Unknown User')}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold">{comment.user?.name || 'Unknown User'}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                    {comment.isOptimistic && <span className="text-xs text-muted-foreground italic">Posting...</span>}
                </div>
                <p className="break-words whitespace-pre-wrap">{comment.body}</p>
            </div>
        </div>
    );
}
