import { Post } from '@/types';
import { ArrowBigDown, ArrowBigUp, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { PostCommentButton, PostOptionsDropdown } from './post-actions';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const formatDate = (dateString: string) => {
        const postDate = new Date(dateString);
        const now = new Date();

        // seconds
        const diffMs = now.getTime() - postDate.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        // today
        const isToday = now.toDateString() === postDate.toDateString();

        // yewsterday
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = yesterday.toDateString() === postDate.toDateString();

        if (isToday) {
            if (diffMinutes < 1) {
                return `Today ${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`;
            } else if (diffMinutes < 60) {
                return `Today ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
            } else {
                return `Today at ${postDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                })}`;
            }
        } else if (isYesterday) {
            return `Yesterday at ${postDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            })}`;
        } else if (diffDays < 7) {
            // if within a week, show day name
            return `${postDate.toLocaleDateString('en-US', { weekday: 'long' })} at ${postDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            })}`;
        } else {
            // default to full date
            return postDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }
    };

    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <div className="flex gap-2 rounded-md border border-border bg-accent/10 p-4 transition-colors hover:bg-accent/50">
                <div className="">
                    <Avatar className="size-9">
                        <AvatarImage src={post.user?.avatar} dicebear />
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
                    {post.title && <h3 className="mt-1 font-medium">{post.title}</h3>}
                    <p className="mt-2 whitespace-pre-wrap">{post.body}</p>
                    <div className="mt-4 flex items-center gap-2">
                        {/* <PostUpvoteButton /> */}
                        {/* <PostDownvoteButton /> */}
                        <PostCommentButton />
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
