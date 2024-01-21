import { ChangeInput } from '../change-input';
import { useInput } from './use-input';

export interface UncontrollableLabelInputProps {
    initialValue: string;
    id: string;
    label: string;
    onChangeDone: (value: string) => void;
}

export function UncontrollableLabelInput({ id, label, onChangeDone, initialValue }: UncontrollableLabelInputProps) {
    const { value, updateValue } = useInput(initialValue);

    return (
        <div className='grid grid-cols-12 px-3 py-1'>
            <label className='col-span-4' htmlFor={id}>
                {label}
            </label>
            <ChangeInput
                id={id}
                value={value}
                onChange={(val) => updateValue(val)}
                onChangeDone={onChangeDone}
                className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200'
            ></ChangeInput>
        </div>
    );
}
