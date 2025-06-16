import { NewPostProvider } from './new-post-context';
import { ViewPostProvider } from './view-post-context';

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ViewPostProvider>
                <NewPostProvider>{children}</NewPostProvider>
            </ViewPostProvider>
        </>
    );
}
