import { FallbackProps } from 'react-error-boundary';

export function RecommendationsErrorFallback({ resetErrorBoundary }: FallbackProps) {
    return (
        <div className='grid grid-cols-12 grid-rows-12 w-full'>
            <div className='bg-rose-300 col-start-4 col-span-6 row-start-2 row-span-7 p-1 rounded flex flex-col items-center gap-2'>
                <h1 className='text-xl'>Recommendations Error</h1>
                <div className='bg-rose-400 h-1 w-full rounded'></div>
                <p>Unexpected error happened. Recommendation operation is aborted.</p>
                <button
                    className='bg-rose-400 hover:bg-rose-700 p-2 rounded shadow'
                    onClick={resetErrorBoundary}
                >
                    Return to editor
                </button>
            </div>
        </div>
    );
}
