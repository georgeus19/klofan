import { EntityInstance } from '@klofan/instances';
import { GraphProperty, Entity } from '@klofan/schema/representation';

export interface EntityInstanceDetailProps {
    entity: Entity;
    properties: GraphProperty[];
    entityInstance: EntityInstance;
    className: string;
}

export function EntityInstanceDetail({ entity, properties, entityInstance, className }: EntityInstanceDetailProps) {
    return (
        <div className={className}>
            <div className='bg-slate-500 py-1 rounded shadow text-white text-center'>
                {entity.name}.{entityInstance.id}
            </div>
            <ul>
                {properties
                    .filter((property) => property.value.type === 'literal')
                    .filter((property) => entityInstance.properties[property.id].literals.length > 0)
                    .flatMap((property) =>
                        entityInstance.properties[property.id].literals.map((literal, index) => (
                            <li key={`${entity.id}${property.id}${index}`} className='grid grid-cols-2 items-center border-b-2 border-slate-300'>
                                <div className='overflow-auto p-0 text-center '>{property.name}</div>
                                <div className='overflow-auto p-0 text-center'>"{literal.value}"</div>
                            </li>
                        ))
                    )}
            </ul>
        </div>
    );
}
