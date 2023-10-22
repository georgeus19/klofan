import { EntityInstances, InstanceState, instanceKey, PropertyInstance } from '../state/instance-state';
import { id } from '../state/schema-state';
import _ from 'lodash';
import { EntityInput } from './create-entity-input';

export function createInstanceState(entityInput: EntityInput): InstanceState {
    const entities = fillInstanceEntities({}, entityInput);
    const properties = fillInstanceProperties({}, entityInput);
    return {
        entities: entities,
        properties: properties,
    };
}

function fillInstanceProperties(properties: { [key: string]: PropertyInstance[] }, entityInput: EntityInput): { [key: string]: PropertyInstance[] } {
    Object.values(entityInput.properties).forEach((propertyInfo) => {
        let targetInstanceIndex = 0;

        const instanceProperties = propertyInfo.instances.map((instanceInfo) => {
            const instanceLinks: PropertyInstance = {};
            if (instanceInfo.instances > 0) {
                instanceLinks.entities = {
                    targetEntity: propertyInfo.targetEntity.id,
                    indices: _.range(targetInstanceIndex, targetInstanceIndex + instanceInfo.instances),
                };
                targetInstanceIndex += instanceInfo.instances;
            }

            if (instanceInfo.literals.length > 0) {
                instanceLinks.literals = instanceInfo.literals
                    .filter((literal): literal is number | string | boolean | bigint | symbol => literal !== null && literal !== undefined)
                    .map((literal) => literal.toString());
            }

            return instanceLinks;
        });

        properties[instanceKey(entityInput.id, propertyInfo.id)] = instanceProperties;
    });

    Object.values(entityInput.properties).forEach((propertyInfo) => fillInstanceProperties(properties, propertyInfo.targetEntity));

    return properties;
}

function fillInstanceEntities(entities: { [key: id]: EntityInstances }, entityInput: EntityInput): { [key: id]: EntityInstances } {
    entities[entityInput.id] = { count: entityInput.instanceCount };
    Object.values(entityInput.properties).forEach((propertyInfo) => {
        fillInstanceEntities(entities, propertyInfo.targetEntity);
    });
    return entities;
}
