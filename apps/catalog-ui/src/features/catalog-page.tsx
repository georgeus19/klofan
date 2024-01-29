import Header from './header/header';
import { UploadData } from './upload-data/upload-data';

/**
 * Header and editor component
 */
function CatalogPage() {
    return (
        <>
            <div className='flex flex-col items-stretch min-h-screen '>
                <div>
                    <Header className='max-w-7xl m-auto'></Header>
                </div>
                <UploadData className='max-w-screen-lg mx-auto w-full'></UploadData>

                <div>
                    Icons used from{' '}
                    <a className='text-slate-600' href='https://icons8.com/'>
                        icons8
                    </a>
                    .
                </div>
            </div>
        </>
    );
}

export default CatalogPage;
