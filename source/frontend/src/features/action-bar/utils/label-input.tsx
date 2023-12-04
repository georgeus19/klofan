export function LabelInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
    return (
        <div className='grid grid-cols-12 px-3 py-1'>
            <label className='col-span-4' htmlFor={label}>
                {label}
            </label>
            <input
                id={label}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200'
            ></input>
        </div>
    );
}
