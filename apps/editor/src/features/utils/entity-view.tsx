import { Entity } from '@klofan/instances';
import { isLiteralSet, EntitySet, getProperties, isEntitySet } from '@klofan/schema/representation';
import { Dropdown } from './dropdown.tsx';
import { LabelReadonlyUriInput } from '../manual-actions-pane/utils/uri/label-readonly-uri-input.tsx';
import { Schema } from '@klofan/schema';
import { PropertyView } from './property-view.tsx';
import { usePrefixesContext } from '../prefixes/prefixes-context.tsx';
import { toUri } from '../manual-actions-pane/utils/uri/use-uri-input.ts';

export type EntityViewProps = {
    entitySet: EntitySet;
    entity: Entity;
    showLiteralProperties?: boolean;
    showEntityProperties?: boolean;
    className?: string;
    schema: Schema;
    expanded: boolean;
};

export function EntityView({
    entitySet,
    entity,
    showEntityProperties,
    showLiteralProperties,
    className,
    schema,
    expanded,
}: EntityViewProps) {
    const { matchPrefix } = usePrefixesContext();
    const instance = getProperties(schema, entitySet.id)
        .filter((propertySet) => showEntityProperties || isLiteralSet(propertySet.value))
        .filter((propertySet) => showLiteralProperties || isEntitySet(propertySet.value))
        .filter(
            (propertySet) =>
                entity.properties[propertySet.id].literals.length > 0 ||
                entity.properties[propertySet.id].targetEntities.length > 0
        )
        .map((propertySet) => {
            return (
                <PropertyView
                    property={entity.properties[propertySet.id]}
                    propertySet={propertySet}
                ></PropertyView>
            );
        });

    const entityUri = toUri(matchPrefix(entity.uri ?? ''), true);
    const header = (
        <div className='truncate hover:overflow-auto hover:text-clip'>
            {entitySet.name}.{entity.id}
            {entityUri && ` = <${entityUri}>`}
        </div>
    );

    return (
        <div className={className}>
            <Dropdown headerLabel={header} showInitially={expanded}>
                <LabelReadonlyUriInput
                    label='Uri'
                    uri={entity.uri ?? ''}
                    className='col-span-2'
                ></LabelReadonlyUriInput>
                {instance}
            </Dropdown>
        </div>
    );
}
