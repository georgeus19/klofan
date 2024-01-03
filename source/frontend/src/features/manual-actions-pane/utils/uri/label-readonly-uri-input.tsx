import { usePrefixesContext } from '../../../prefixes/prefixes-context';
import { LabelReadonlyInput } from '../general-label-input/label-readonly-input';
import { toUri } from './use-uri-input';

export function LabelReadonlyUriInput({ label, uri, className }: { label: string; uri: string; className?: string }) {
    const { matchPrefix } = usePrefixesContext();

    const prefixedUri = toUri(matchPrefix(uri), true);

    return <LabelReadonlyInput label={label} value={prefixedUri} className={className}></LabelReadonlyInput>;
}
