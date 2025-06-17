import PostDialog from '@/components/post/post-dialog';
import { Post } from '@/types';
import React, { createContext, useContext, useState } from 'react';

export type NewPostContextType = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedPost: Post | null;
    setSelectedPost: (post: Post | null) => void;
};

const PostDialogContext = createContext<NewPostContextType | undefined>(undefined);

export const PostDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    return (
        <PostDialogContext.Provider value={{ isOpen, setIsOpen, selectedPost, setSelectedPost }}>
            {children}
            <PostDialog />
        </PostDialogContext.Provider>
    );
};

export const usePostDialogContext = (): NewPostContextType => {
    const context = useContext(PostDialogContext);
    if (!context) {
        throw new Error('useNewPostContext must be used within a NewPostProvider');
    }
    return context;
};

export const NewPostConsumer = PostDialogContext.Consumer;
