import { EntityInstance } from '../../../core/instances/entity-instance';
import { Entity, getProperties, isEntity } from '../../../core/schema/representation/item/entity';
import { isLiteral } from '../../../core/schema/representation/item/literal';
import { useEditorContext } from '../../editor/editor-context';
import { Dropdown } from './dropdown';
import { ReadonlyInput } from './general-label-input/readonly-input';
import { LabelReadonlyUriInput } from './uri/label-readonly-uri-input';

export type EntityInstanceViewProps = {
    entity: Entity;
    entityInstance: EntityInstance;
    showLiteralProperties?: boolean;
    showEntityProperties?: boolean;
    className?: string;
};

export function EntityInstanceView({ entity, entityInstance, showEntityProperties, showLiteralProperties, className }: EntityInstanceViewProps) {
    const { schema } = useEditorContext();

    const instance = getProperties(schema, entity.id)
        .filter((property) => showEntityProperties || isLiteral(property.value))
        .filter((property) => showLiteralProperties || isEntity(property.value))
        .filter(
            (property) =>
                entityInstance.properties[property.id].literals.length > 0 || entityInstance.properties[property.id].targetInstanceIndices.length > 0
        )
        .map((property) => {
            return (
                <div key={property.id} className='grid grid-cols-2 mx-2'>
                    <div className='col-start-1 overflow-auto p-2 bg-slate-300 shadow text-center'>{property.name}</div>
                    {entityInstance.properties[property.id].literals.map((literal, index) => (
                        <div className='col-start-2 overflow-auto p-2 bg-blue-100 text-center' key={`L${literal.value}${index}`}>
                            <ReadonlyInput value={literal.value} className='w-full'></ReadonlyInput>
                        </div>
                    ))}
                    {entityInstance.properties[property.id].targetInstanceIndices.map((targetInstanceIndex, index) => (
                        <div className='col-start-2 overflow-auto p-2 bg-purple-100 text-center shadow' key={`E${index}`}>
                            <ReadonlyInput value={`${property.value.name}.${targetInstanceIndex}`} className='w-full'></ReadonlyInput>
                        </div>
                    ))}
                </div>
            );
        });

    return (
        <div className={className}>
            <Dropdown headerLabel={`${entity.name}.${entityInstance.id}`} showInitially>
                <LabelReadonlyUriInput label='Uri' uri={entityInstance.uri ?? ''} className='col-span-2'></LabelReadonlyUriInput>
                {instance}
            </Dropdown>
        </div>
    );
}
