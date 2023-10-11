import { SafeMap } from '../safe-map';
import { EntityInstances, InstanceLink, InstanceState, LiteralValue, instanceKey } from '../state/instance-state';
import { id } from '../state/schema-state';
import _ from 'lodash';
import { EntityInput } from './create-entity-input';

export function createInstanceState(entityInput: EntityInput): InstanceState {
    const entities = fillInstanceEntities(new SafeMap<id, EntityInstances>(), entityInput);
    const properties = fillInstanceProperties(
        new SafeMap<string, ((InstanceLink & LiteralValue) | InstanceLink | LiteralValue | null)[]>(),
        entityInput
    );
    return {
        entities: entities,
        properties: properties,
    };
}

function fillInstanceProperties(
    properties: SafeMap<string, ((InstanceLink & LiteralValue) | InstanceLink | LiteralValue | null)[]>,
    entityInput: EntityInput
): SafeMap<string, ((InstanceLink & LiteralValue) | InstanceLink | LiteralValue | null)[]> {
    entityInput.instances.forEach((value, key) => {
        const propertyId = entityInput.propertyIds.safeGet(key);

        let targetInstanceIndex = 0;

        const instanceProperties = value.map((instanceInfo) => {
            let instanceLinks: (InstanceLink & LiteralValue) | InstanceLink | LiteralValue | null = null;
            if (instanceInfo.instances > 0) {
                instanceLinks = {
                    linkedInstance: entityInput.properties.safeGet(key).id,
                    indices: _.range(targetInstanceIndex, targetInstanceIndex + instanceInfo.instances),
                };
                targetInstanceIndex += instanceInfo.instances;
            }

            if (instanceInfo.literals.length > 0) {
                if (instanceLinks === null) {
                    instanceLinks = { value: [] };
                }
                (instanceLinks as LiteralValue).value = instanceInfo.literals
                    .filter((literal): literal is number | string | boolean | bigint | symbol => literal !== null && literal !== undefined)
                    .map((literal) => literal.toString());
            }

            return instanceLinks;
        });

        properties.set(instanceKey(entityInput.id, propertyId), instanceProperties);
    });

    entityInput.properties.forEach((value) => fillInstanceProperties(properties, value));

    return properties;
}

function fillInstanceEntities(entities: SafeMap<id, EntityInstances>, entityInput: EntityInput): SafeMap<id, EntityInstances> {
    entities.set(entityInput.id, { count: entityInput.instanceCount });
    entityInput.properties.forEach((value) => {
        fillInstanceEntities(entities, value);
    });
    return entities;
}
