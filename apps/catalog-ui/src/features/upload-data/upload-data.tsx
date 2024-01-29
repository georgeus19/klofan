import { twMerge } from 'tailwind-merge';

export function UploadData({ className }: { className?: string }) {
    function uploadData(submitEvent: React.FormEvent<HTMLFormElement>) {
        const formData = new FormData(submitEvent.currentTarget);
        // formData.append('xxx', '33');
        console.log(formData.values().next().value);
        const url = 'http://localhost:3000/api/v1/catalog/data';
        const fetchOptions: RequestInit = {
            method: 'POST',
            body: formData,
        };
        // for (const [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }

        // for (const [key, value] of formData) {
        //     console.log(`${key}: ${value}`);
        // }
        fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((data) => console.log(data));
        submitEvent.preventDefault();
    }

    return (
        <div>
            <form onSubmit={uploadData} className={twMerge('bg-slate-300 p-2 grid grid-cols-2 gap-3', className)}>
                <label htmlFor='name'>Name</label>
                <input className='p-1' type='text' name='name' id='name' />
                <label htmlFor='file1'>File</label>
                <input className='p-1' type='file' name='files' id='file1' />
                <label htmlFor='file2'>File</label>
                <input className='p-1' type='file' name='files' id='file2' />

                <button className='col-span-2' type='submit'>
                    Upload Data
                </button>
            </form>
        </div>
    );
}
