import { NewPostProvider } from './new-post-context';

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NewPostProvider>{children}</NewPostProvider>
        </>
    );
}
