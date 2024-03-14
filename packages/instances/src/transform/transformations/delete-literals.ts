import { EntitySet, Item, PropertySet } from '@klofan/schema/representation';
import { RawInstances, propertyKey } from '../../representation/raw-instances';
import { Mapping, getProperties } from '../mapping/mapping';
import { TransformationChanges } from '../transformation-changes';
import { Literal } from '../../representation/literal';
import { Entity, EntityReference } from '../../representation/entity';
import * as _ from 'lodash';
import { Property } from '../../representation/property';

export interface DeleteLiterals {
    type: 'delete-literals';
    data: {
        entitySet: EntitySet;
        propertySet: PropertySet;
        literalsToDelete: Literal[];
    };
}

export function deleteLiterals(
    instances: RawInstances,
    { data: { entitySet, propertySet, literalsToDelete } }: DeleteLiterals
) {
    let literalsLeft = 0;
    const propertiesKey = propertyKey(entitySet.id, propertySet.id);
    instances.properties[propertiesKey] = instances.properties[propertiesKey].map(
        (property): Property => {
            const newLiterals = property.literals.filter(
                (literal) => literalsToDelete.filter((l) => l.value === literal.value).length === 0
            );
            if (newLiterals.length > 0) {
                literalsLeft += newLiterals.length;
            }
            return {
                ...property,
                literals: newLiterals,
            };
        }
    );
    if (literalsLeft === 0) {
        delete instances.properties[propertiesKey];
    }
}

export function deleteLiteralsChanges(transformation: DeleteLiterals): TransformationChanges {
    return {
        entities: [transformation.data.entitySet.id],
        properties: [transformation.data.propertySet.id],
    };
}
