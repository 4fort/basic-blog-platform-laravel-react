import { ArrowBigDown, ArrowBigUp, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { PostCommentButton, PostDownvoteButton, PostOptionsDropdown, PostUpvoteButton } from './post-actions';

export function PostCard() {
    return (
        <>
            <div className="flex gap-2 rounded-md border border-border bg-accent/10 p-4 transition-colors hover:bg-accent/50">
                <div className="">
                    <Avatar className="size-9">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div className="">
                    <section className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold">Juan Dela Cruz</h2>
                            <span className="text-muted-foreground">•</span>
                            <p className="text-sm text-muted-foreground">June 12, 2025</p>
                        </div>
                        <PostOptionsDropdown />
                    </section>
                    <p className="mt-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        <PostUpvoteButton />
                        <PostDownvoteButton />
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
