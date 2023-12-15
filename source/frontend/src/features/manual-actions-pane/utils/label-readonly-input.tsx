export function LabelReadonlyInput({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
        <div className={className}>
            <div className='grid grid-cols-12 px-3 py-1'>
                <label className='col-span-4'>{label}</label>
                <input className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1' type='text' readOnly value={value} />
            </div>
        </div>
    );
}
