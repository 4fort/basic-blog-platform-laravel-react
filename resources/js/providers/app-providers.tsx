import { PostDialogProvider } from './post-dialog-context';
import { ViewPostProvider } from './view-post-context';

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ViewPostProvider>
                <PostDialogProvider>{children}</PostDialogProvider>
            </ViewPostProvider>
        </>
    );
}
