import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePostDialogContext } from '@/providers/post-dialog-context';
import { Post } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { ArrowBigDown, ArrowBigUp, Edit, Ellipsis, MessageCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';

export function PostUpvoteButton({ isActive, count }: { isActive?: boolean; count?: number }) {
    return (
        <Button variant="ghost" className={isActive ? 'text-accent-foreground' : 'text-muted-foreground'}>
            <ArrowBigUp className={isActive ? 'fill-accent-foreground' : ''} />
            {count && <span>{count}</span>}
        </Button>
    );
}

export function PostDownvoteButton({ isActive, count }: { isActive?: boolean; count?: number }) {
    return (
        <Button variant="ghost" className={isActive ? 'text-accent-foreground' : 'text-muted-foreground'}>
            <ArrowBigDown />
            {count && <span>{count}</span>}
        </Button>
    );
}

export function PostCommentButton({ count, post_id, ...props }: React.ComponentProps<'button'> & { count?: number; post_id: Post['id'] }) {
    // const { setIsOpen, setPostId } = useViewPostContext();

    return (
        <Button
            onClick={() => {
                // setIsOpen(true);
                // setPostId(post_id);
                router.visit(`/post/${post_id}`, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }}
            variant="ghost"
            className="text-muted-foreground"
            {...props}
        >
            <MessageCircle />
            {count && <span>{count}</span>}
        </Button>
    );
}

export function PostOptionsDropdown({ post }: { post: Post }) {
    const { setIsOpen, setSelectedPost } = usePostDialogContext();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-muted-foreground">
                        <Ellipsis />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => {
                            setIsOpen(true);
                            setSelectedPost(post || null);
                        }}
                    >
                        <Edit /> Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setIsDeleteDialogOpen(true);
                        }}
                    >
                        <Trash2 /> Delete Post
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <PostDeleteDialog post={post} isOpen={isDeleteDialogOpen} setIsOpen={setIsDeleteDialogOpen} />
        </>
    );
}

export function PostDeleteDialog({
    post,
    isOpen,
    setIsOpen,
}: {
    post: Post;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { delete: destroy } = useForm();

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete the post.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            destroy(route('posts.destroy', post.id), {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setIsOpen(false);
                                },
                                onError: (error) => {
                                    console.error('Error deleting post:', error);
                                },
                            });
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
