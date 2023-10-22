export default function Header() {
    return (
        <>
            <header className="grid grid-cols-2 p-2">
                <div className="p-3">LOGO</div>
                <nav className="flex gap-4 justify-end">
                    <ul className="contents">
                        {[
                            ['Editor', '/'],
                            ['Catalog', '/'],
                        ].map(([title, url], i) => (
                            <li key={i}>
                                <a className="block bg-lime-100 p-3 rounded shadow" href={url}>
                                    {title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>
            <div className="flex py- items-center">
                <div className="w-20"></div>
                <div className="flex-grow border-t border-y-2 rounded border-gray-200"></div>
                <div className="w-20"></div>
            </div>
        </>
    );
}
