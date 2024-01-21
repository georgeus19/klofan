import { Entity } from '@klofan/schema/representation';
import { DisplaySelect } from '../../display-select';

export type EntityNodeSelectorProps = {
    entity: Entity | null;
    label: string;
    onSelectStart: () => void;
};

export function EntityNodeSelector({ label, entity: sourceEntity, onSelectStart }: EntityNodeSelectorProps) {
    return <DisplaySelect label={label} displayValue={sourceEntity?.name} onSelect={onSelectStart}></DisplaySelect>;
}
