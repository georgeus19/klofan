import { ReactNode, useState } from 'react';
import triangleDown from '../../../assets/triangle-down.png';
import triangleRight from '../../../assets/triangle-right.png';
import { twMerge } from 'tailwind-merge';

export interface DetailDropdownProps {
    children: ReactNode;
    headerLabel: string;
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
            <div className={twMerge('flex bg-slate-300 border rounded p-1 border-slate-950 my-1', className)} onClick={handleClick}>
                {show ? <img src={triangleDown} alt='triangle'></img> : <img src={triangleRight} alt='triangle'></img>}
                {headerLabel}
            </div>
            {show && children}
        </>
    );
}
