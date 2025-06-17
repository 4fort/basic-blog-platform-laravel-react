import { formatDate, getUserInitials } from '@/lib/utils';
import { Post } from '@/types';
import { ArrowBigDown, ArrowBigUp, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { PostCommentButton, PostOptionsDropdown } from './post-actions';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <>
            <div className="flex gap-2 rounded-md border border-border bg-accent/10 p-4 transition-colors hover:bg-accent/50">
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
                        <PostOptionsDropdown post={post} />
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
        </>
    );
}

export function PostCardSkeleton() {
    return (
        <div className="flex gap-2">
            <div className="">
                <Avatar className="animate-pulse">
                    <AvatarImage className="animate-pulse" />
                    <AvatarFallback className="animate-pulse" />
                </Avatar>
            </div>
            <div className="">
                <section>
                    <h2 className="animate-pulse">Loading...</h2>
                    <p className="animate-pulse text-sm text-muted-foreground">Loading...</p>
                </section>
                <p className="mt-2 animate-pulse">Loading...</p>
                <div className="mt-4 flex items-center gap-2">
                    <Button variant="ghost" className="animate-pulse">
                        <ArrowBigUp className="animate-pulse fill-accent-foreground" />
                        <span>Loading...</span>
                    </Button>
                    <Button variant="ghost" className="animate-pulse">
                        <ArrowBigDown />
                        <span>Loading...</span>
                    </Button>
                    <Button variant="ghost" className="animate-pulse">
                        <MessageCircle />
                        <span>Loading...</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
