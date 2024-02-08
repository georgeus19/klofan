import { HTMLAttributes } from 'react';
import { Divider } from '../utils/divider';

export default function Header({ className }: HTMLAttributes<HTMLDivElement>) {
    return (
        <header className={className}>
            <div className='grid grid-cols-2 p-2'>
                <div className='p-3'>LOGO</div>
                <nav className='flex gap-4 justify-end'>
                    <ul className='contents'>
                        {[
                            ['Editor', '/'],
                            ['Catalog', '/'],
                        ].map(([title, url], i) => (
                            <li key={i}>
                                <a className='block bg-blue-200 p-3 rounded shadow' href={url}>
                                    {title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <Divider></Divider>
        </header>
    );
}
