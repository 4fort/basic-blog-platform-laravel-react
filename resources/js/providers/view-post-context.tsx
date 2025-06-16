import ViewPostDialog from '@/components/post/view-post-dialog';
import React from 'react';

export type ViewPostContextType = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    postId: number | null;
    setPostId: React.Dispatch<React.SetStateAction<number | null>>;
};

const ViewPostContext = React.createContext<ViewPostContextType | undefined>(undefined);

export const ViewPostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [postId, setPostId] = React.useState<number | null>(null);

    return (
        <ViewPostContext.Provider value={{ isOpen, setIsOpen, postId, setPostId }}>
            {children}
            <ViewPostDialog />
        </ViewPostContext.Provider>
    );
};
export const useViewPostContext = (): ViewPostContextType => {
    const context = React.useContext(ViewPostContext);
    if (!context) {
        throw new Error('useViewPostContext must be used within a ViewPostProvider');
    }
    return context;
};
