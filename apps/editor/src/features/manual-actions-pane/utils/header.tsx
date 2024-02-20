import { twMerge } from 'tailwind-merge';

export function Header({ label, className }: { label: string; className?: string }) {
    return <div className={twMerge('p-2 text-center font-bold bg-slate-300', className)}>{label}</div>;
}
