import { AnalysedStructure, UploadedData } from '@klofan/old-catalog-types';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function UploadDataList({ className }: { className?: string }) {
    const [uploadedData, setUploadedData] = useState<UploadedData[]>([]);
    const [analysed, setAnalysed] = useState<{ iri: string; analysed: AnalysedStructure[] }>({ iri: '', analysed: [] });

    useEffect(getData, []);

    function getData() {
        const url = 'http://localhost:3000/api/v1/catalog/data?offset=0&limit=10';
        const fetchOptions: RequestInit = {
            method: 'GET',
        };
        fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((data: UploadedData[]) => {
                console.log(data);
                setUploadedData(data);
            });
    }

    const getAnalysed = (iri: string) => {
        const url = `http://localhost:3000/api/v1/catalog/data/analysed?iri=${iri}`;
        const fetchOptions: RequestInit = {
            method: 'GET',
        };
        fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((data: AnalysedStructure[]) => {
                console.log(data);
                setAnalysed({ iri: iri, analysed: data });
            });
    };

    return (
        <div className={twMerge('flex flex-col gap-2 bg-slate-100 p-2', className)}>
            {uploadedData.map((d) => (
                <div className='grid grid-cols-12 bg-slate-200 p-1 rounded shadow'>
                    <div
                        onClick={() => getAnalysed(d.iri)}
                        className='col-span-5 p-2 text-xl font-bold hover:text-blue-400 hover:underline-offset-2 hover:underline text-blue-600'
                    >
                        {d.label} [{d.uploaded}]
                    </div>
                    <div className={twMerge('col-span-full max-h-10', analysed.iri === d.iri && 'max-h-full')}>{d.description}</div>
                    {analysed.iri === d.iri && (
                        <div className='col-span-full'>
                            {analysed.analysed.map((a) => (
                                <div className='p-1 rounded shadow bg-slate-300'>
                                    <div className='text-lg'>Code List: {a.label}</div>
                                    <div className='hover:text-blue-400 hover:underline-offset-2 hover:underline text-blue-600'>{a.iri}</div>
                                </div>
                            ))}
                            <div></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
