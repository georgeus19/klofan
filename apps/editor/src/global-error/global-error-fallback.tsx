import { FallbackProps } from 'react-error-boundary';

export function GlobalErrorFallback({ resetErrorBoundary }: FallbackProps) {
    return (
        <div className='grid grid-cols-12 grid-rows-12 w-full'>
            <div className='bg-rose-300 col-start-4 col-span-6 row-start-2 row-span-7 p-1 rounded flex flex-col items-center gap-2'>
                <h1 className='text-xl'>Error</h1>
                <div className='bg-rose-400 h-1 w-full rounded'></div>
                <p>Unexpected error happened. There is no saving this. Please refresh the page.</p>
            </div>
        </div>
    );
}
