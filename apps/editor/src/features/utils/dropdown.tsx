import { ReactNode, useState } from 'react';
import triangleDown from '../../assets/triangle-down.png';
import triangleRight from '../../assets/triangle-right.png';
import { twMerge } from 'tailwind-merge';

export interface DetailDropdownProps {
    children: ReactNode;
    headerLabel: ReactNode;
    showInitially: boolean;
    className?: string;
}

export function Dropdown({ className, headerLabel, children, showInitially }: DetailDropdownProps) {
    const [show, setShow] = useState(showInitially);

    const handleClick = () => {
        setShow((prev) => !prev);
    };

    return (
        <>
            <div
                className={twMerge(
                    'flex bg-slate-500 text-white border-2 rounded p-1  border-slate-600 my-1',
                    className
                )}
                onClick={handleClick}
            >
                {show ? (
                    <img src={triangleDown} alt='triangle'></img>
                ) : (
                    <img src={triangleRight} alt='triangle'></img>
                )}
                {headerLabel}
            </div>
            {show && children}
        </>
    );
}
