import NewPostDialog from '@/components/post/new-post-dialog';
import React, { createContext, useContext, useState } from 'react';

export type NewPostContextType = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

const NewPostContext = createContext<NewPostContextType | undefined>(undefined);

export const NewPostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <NewPostContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
            <NewPostDialog />
        </NewPostContext.Provider>
    );
};

export const useNewPostContext = (): NewPostContextType => {
    const context = useContext(NewPostContext);
    if (!context) {
        throw new Error('useNewPostContext must be used within a NewPostProvider');
    }
    return context;
};

export const NewPostConsumer = NewPostContext.Consumer;
