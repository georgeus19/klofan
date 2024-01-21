import { twMerge } from 'tailwind-merge';

export function ReadonlyInput({ value, className }: { value: string; className?: string }) {
    return (
        <input
            className={twMerge('rounded bg-transparent bg-slate-300 border-2 border-slate-400 px-1', className ?? '')}
            type='text'
            readOnly
            value={value}
        />
    );
}
