export function ActionOkCancel({ onOk, onCancel }: { onOk: () => void; onCancel: () => void }) {
    return (
        <div className='grid grid-cols-12 p-3'>
            <button className='col-start-3 col-span-3 p-2 bg-blue-200   shadow rounded hover:bg-blue-700 hover:text-white' onClick={onOk}>
                Ok
            </button>
            <button className='col-start-7 col-span-3 p-2  bg-rose-300 shadow rounded hover:bg-rose-700 hover:text-white' onClick={onCancel}>
                Cancel
            </button>
        </div>
    );
}
