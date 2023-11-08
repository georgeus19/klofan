import { StandaloneInput } from './standalone-input';

export interface DetailLabelValueItemProps {
    initialValue: string;
    id: string;
    label: string;
    onChangeDone: (value: string) => void;
}

export function DetailLabelValueItem({ id, label, onChangeDone, initialValue }: DetailLabelValueItemProps) {
    return (
        <div className='grid grid-cols-12 px-3 py-1'>
            <label className='col-span-4' htmlFor={id}>
                {label}
            </label>
            <StandaloneInput
                initialValue={initialValue}
                id={id}
                className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200'
                onChangeDone={onChangeDone}
            ></StandaloneInput>
        </div>
    );
}
