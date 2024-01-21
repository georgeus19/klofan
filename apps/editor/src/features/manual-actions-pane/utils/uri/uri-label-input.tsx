import { UriInput, UriInputProps } from './uri-input';

export type UriLabelInputProps = Omit<Omit<UriInputProps, 'className'>, 'onChangeDone'> & {
    label: string;
    onChangeDone?: (value: string) => void;
};

const empty = () => {};

export function UriLabelInput(props: UriLabelInputProps) {
    return (
        <>
            <div className='grid grid-cols-12 px-3 py-1 relative'>
                <label className='col-span-4' htmlFor={props.id}>
                    {props.label}
                </label>
                <UriInput
                    {...props}
                    onChangeDone={props.onChangeDone ?? empty}
                    className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200'
                ></UriInput>
                {props.uriWithoutPrefix && !props.valid && (
                    <div className='col-start-1 col-span-12 bg-rose-200 p-1 border rounded border-rose-700 text-rose-700'>Uri is invalid.</div>
                )}
            </div>
        </>
    );
}
