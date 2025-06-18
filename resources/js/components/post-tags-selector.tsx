import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tag } from '@/types';
import { Trash2 } from 'lucide-react';
import React from 'react';

interface PostTagsSelectorProps {
    tagItems: Tag[];
    tags: Tag['id'][];
    setTags: (tags: Tag['id'][]) => void;
}

export default function PostTagsSelector({ tagItems, tags, setTags }: PostTagsSelectorProps) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const filteredTags = tagItems.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
        <div className="">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary">Add Tags</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <Input
                        type="text"
                        placeholder="Search tags..."
                        value={searchTerm}
                        onChange={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSearchTerm(e.target.value);
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="mb-2"
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="max-h-[calc(100svh-400px)] overflow-auto">
                        {filteredTags.map((tag) => (
                            <DropdownMenuCheckboxItem
                                key={tag.id}
                                checked={tags.includes(tag.id)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setTags([...tags, tag.id]);
                                    } else {
                                        setTags(tags.filter((t) => t !== tag.id));
                                    }
                                    setSearchTerm('');
                                }}
                                className="cursor-pointer"
                            >
                                {tag.name}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            if (tags.length > 0) {
                                setTags([]);
                            }
                        }}
                    >
                        <Trash2 /> Clear Tags
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, index) => {
                        const tagItem = tagItems.find((t) => t.id === tag);
                        if (!tagItem) return null;
                        return (
                            <Badge key={index} onClick={() => setTags(tags.filter((t) => t !== tag))} className="cursor-pointer">
                                {tagItem.name} <span className="text-lg text-muted-foreground">&times;</span>
                            </Badge>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
