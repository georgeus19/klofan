import { Entity, Property } from '@klofan/schema/representation';
import { RawInstances, propertyInstanceKey } from '../../representation/raw-instances';
import { Literal } from '../../representation/literal';

export interface UpdatePropertyLiterals {
    type: 'update-property-literals';
    data: {
        entity: Entity;
        property: Property;
        literals: {
            from: Literal;
            to: Literal;
        };
    };
}

export function updatePropertyLiterals(instances: RawInstances, transformation: UpdatePropertyLiterals): void {
    const propertyKey = propertyInstanceKey(transformation.data.entity.id, transformation.data.property.id);
    instances.propertyInstances[propertyKey] = instances.propertyInstances[propertyKey].map((propertyInstance) => {
        const newInstance = { ...propertyInstance };
        const updatedLiterals = propertyInstance.literals.map((literal) =>
            literal.value === transformation.data.literals.from.value ? { ...transformation.data.literals.to } : literal
        );
        return {
            ...propertyInstance,
            literals: updatedLiterals,
        };
    });
}
