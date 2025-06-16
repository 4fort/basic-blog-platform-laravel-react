import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useViewPostContext } from '@/providers/view-post-context';
import { Post } from '@/types';
import { ArrowBigDown, ArrowBigUp, Edit, Ellipsis, MessageCircle, Trash2 } from 'lucide-react';
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

export function PostCommentButton({ count, post_id }: { count?: number; post_id: Post['id'] }) {
    const { setIsOpen, setPostId } = useViewPostContext();
    return (
        <Button
            onClick={() => {
                setIsOpen(true);
                setPostId(post_id);
            }}
            variant="ghost"
            className="text-muted-foreground"
        >
            <MessageCircle />
            {count && <span>{count}</span>}
        </Button>
    );
}

export function PostOptionsDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground">
                    <Ellipsis />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Edit /> Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Trash2 /> Delete Post
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
