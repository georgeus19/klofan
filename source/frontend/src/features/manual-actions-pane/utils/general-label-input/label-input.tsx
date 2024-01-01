import { ChangeInput } from '../change-input';
import { Input } from './use-input';

export type LabelInputProps = Input & {
    label: string;
    id: string;
    onChangeDone?: (value: string) => void;
};

const empty = () => {};

export function LabelInput({ id, label, value, updateValue, onChangeDone }: LabelInputProps) {
    return (
        <div className='grid grid-cols-12 px-3 py-1'>
            <label className='col-span-4' htmlFor={id}>
                {label}
            </label>
            <ChangeInput
                id={id}
                value={value}
                onChange={updateValue}
                onChangeDone={onChangeDone ?? empty}
                className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200'
            ></ChangeInput>
        </div>
    );
}
