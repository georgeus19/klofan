import { twMerge } from 'tailwind-merge';

export interface HeaderProps {
    label: string;
    className?: string;
}

export function Header({ label, className }: HeaderProps) {
    return (
        <div className={twMerge('p-2 text-center font-bold bg-slate-300', className)}>{label}</div>
    );
}
