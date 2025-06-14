import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNewPostContext } from '@/providers/new-post-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { TextareaAutoSize } from './ui/textarea';

export default function NewPostDialog() {
    const { isOpen, setIsOpen } = useNewPostContext();

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Post</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2">
                        <div className="">
                            <Avatar className="size-9">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex grow">
                            <TextareaAutoSize className="field-sizing-content max-h-96 min-h-24 resize-none text-xl!" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button>Post</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
