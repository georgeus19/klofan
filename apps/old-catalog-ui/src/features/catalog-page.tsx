import { useState } from 'react';
import Header from './header/header';
import { UploadData } from './upload-data/upload-data';
import { UploadDataList } from './upload-data/upload-data-list';

/**
 * Header and editor component
 */
function CatalogPage() {
    const [showUploadData, setShowUploadData] = useState<boolean>(false);

    return (
        <>
            <div className='flex flex-col items-stretch min-h-screen '>
                <div>
                    <Header className='max-w-7xl m-auto'></Header>
                </div>
                <button className='p-2 w-full  rounded shadow bg-blue-200 hover:bg-blue-300' onClick={() => setShowUploadData(!showUploadData)}>
                    Upload
                </button>
                {showUploadData && (
                    <UploadData
                        className='max-w-screen-lg mx-auto w-full'
                        onUpload={() => setShowUploadData(false)}
                        onCancel={() => setShowUploadData(false)}
                    ></UploadData>
                )}

                <UploadDataList className='max-w-screen-lg mx-auto w-full'></UploadDataList>
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
