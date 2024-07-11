import buffering from '../../assets/buffering.png';
import { twMerge } from 'tailwind-merge';

export interface BufferingProps {
    className?: string;
    alt: string;
}

export function Buffering({ className, alt }: BufferingProps) {
    return (
        <div className={twMerge(className, 'w-full')}>
            <img
                className='col-start-6 col-span-1 animate-spin animate-spin-slow mx-auto'
                src={buffering}
                alt={alt}
            ></img>
        </div>
    );
}
