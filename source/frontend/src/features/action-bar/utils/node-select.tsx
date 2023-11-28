export interface NodeSelectProps {
    label: string;
    displayValue?: string;
    onSelect: () => void;
}

export function NodeSelect({ label, displayValue, onSelect }: NodeSelectProps) {
    return (
        <div className='grid grid-cols-12 px-3 py-1'>
            <label className='col-span-4'>{label}</label>
            <input className='col-span-6 rounded bg-transparent border-2 border-slate-400 px-1' type='text' readOnly value={displayValue ?? ''} />
            <button className='col-span-2 mx-1 rounded shadow bg-lime-100 hover:bg-lime-200' onClick={onSelect}>
                Select
            </button>
        </div>
    );
}
