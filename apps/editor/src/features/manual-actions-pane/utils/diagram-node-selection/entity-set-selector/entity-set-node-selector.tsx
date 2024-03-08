import { EntitySet } from '@klofan/schema/representation';
import { DisplaySelect } from '../../display-select';

export type EntitySetNodeSelectorProps = {
    entitySet: EntitySet | null;
    label: string;
    onSelectStart: () => void;
};

export function EntitySetNodeSelector({
    label,
    entitySet,
    onSelectStart,
}: EntitySetNodeSelectorProps) {
    return (
        <DisplaySelect
            label={label}
            displayValue={entitySet?.name}
            onSelect={onSelectStart}
        ></DisplaySelect>
    );
}
