import { ReadonlyInput } from './readonly-input';

export function LabelReadonlyInput({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
        <div className={className}>
            <div className='grid grid-cols-12 px-3 py-1'>
                <label className='col-span-4'>{label}</label>
                <ReadonlyInput value={value} className='col-span-8'></ReadonlyInput>
            </div>
        </div>
    );
}
