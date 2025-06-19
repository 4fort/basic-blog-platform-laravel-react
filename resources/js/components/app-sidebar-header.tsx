import { Breadcrumbs } from '@/components/breadcrumbs';
import { SharedData, type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { SidebarTrigger, useSidebar } from './ui/sidebar';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { ziggy } = usePage<SharedData>().props;
    const { isMobile } = useSidebar();

    const isBackButtonVisible = ziggy.location !== `${ziggy.url}/posts`;

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 bg-background/80 px-6 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                {isMobile && <SidebarTrigger className="-ml-1" />}

                {isBackButtonVisible && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                            router.visit('/posts', {
                                preserveState: true,
                                preserveScroll: true,
                                only: ['posts'],
                            })
                        }
                        aria-label="Go back"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
