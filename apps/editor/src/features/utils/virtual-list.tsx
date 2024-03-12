import { twMerge } from 'tailwind-merge';
import { ViewportList } from 'react-viewport-list';
import { EntityView } from './entity-view.tsx';
import { ReactNode, useRef } from 'react';

export interface VirtualListProps<T> {
    items: T[];
    children: (item: T, index: number) => ReactNode;
    height: string;
    className?: string;
}

export function VirtualList<T>({ items, children, className, height }: VirtualListProps<T>) {
    const ref = useRef<HTMLDivElement | null>(null);

    return (
        <div className={twMerge('scroll-container overflow-auto', className, height)} ref={ref}>
            <ViewportList viewportRef={ref} items={items}>
                {children}
            </ViewportList>
        </div>
    );
}
