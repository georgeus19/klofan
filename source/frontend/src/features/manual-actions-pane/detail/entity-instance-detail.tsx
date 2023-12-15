import { EntityInstance } from '../../../core/instances/entity-instance';
import { Entity } from '../../../core/schema/representation/item/entity';
import { GraphProperty } from '../../../core/schema/representation/relation/graph-property';

export interface EntityInstanceDetailProps {
    entity: Entity;
    properties: GraphProperty[];
    entityInstance: EntityInstance;
    className: string;
}

export function EntityInstanceDetail({ entity, properties, entityInstance, className }: EntityInstanceDetailProps) {
    return (
        <div className={className}>
            <div className='bg-slate-400 p-2 rounded shadow text-white'>
                {entity.name}-{entityInstance.id}
            </div>
            <ul className='grid grid-cols-2 items-center gap-1'>
                {properties
                    .filter((property) => property.value.type === 'literal')
                    .filter((property) => entityInstance.properties[property.id].literals.length > 0)
                    .flatMap((property) =>
                        entityInstance.properties[property.id].literals.map((literal, index) => (
                            <li key={`${entity.id}${property.id}${index}`} className='contents'>
                                <div className='overflow-auto p-2 text-center'>{property.name}</div>
                                <div className='overflow-auto p-2 text-center'>"{literal.value}"</div>
                            </li>
                        ))
                    )}
            </ul>
        </div>
    );
}
