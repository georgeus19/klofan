export interface DisplaySelectProps {
    label: string;
    displayValue?: string;
    onSelect: () => void;
}

export function DisplaySelect({ label, displayValue, onSelect }: DisplaySelectProps) {
    return (
        <div className='grid grid-cols-12 px-3 py-1'>
            <label className='col-span-4'>{label}</label>
            <input className='col-span-6 rounded bg-transparent border-2 border-slate-400 px-1' type='text' readOnly value={displayValue ?? ''} />
            <button className='col-span-2 mx-1 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={onSelect}>
                Select
            </button>
        </div>
    );
}
