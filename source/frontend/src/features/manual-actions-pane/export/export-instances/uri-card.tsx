import { UncontrollableUriLabelInput } from '../../utils/uri/uncontrollable-uri-label-input';

export type UriCardProps = {
    id: string;
    label: string;
    uri?: string;
    onChangeDone: (uri: string) => void;
};

export function UriCard({ id, label, uri, onChangeDone }: UriCardProps) {
    return (
        <div className='mx-2 rounded shadow bg-slate-300'>
            <div className='p-2 bg-slate-400 rounded'>{label}</div>
            <UncontrollableUriLabelInput
                id={id}
                initialUri={uri ?? ''}
                label='Uri'
                usePrefix
                onChangeDone={onChangeDone}
            ></UncontrollableUriLabelInput>
        </div>
    );
}
