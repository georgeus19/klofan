import { Instances } from '../instances';
import { InstanceProperty } from '../representation/instance-property';
import { instanceKey } from '../representation/raw-instances';
import { EntityInstances } from '../representation/entity-instances';
import { identifier } from '../../schema/utils/identifier';
import { InMemoryInstanceReader } from '../in-memory-instance-reader';
import { EntityTreeNode } from '../../parse/tree/entity-tree/entity-tree';
import _ from 'lodash';
import { Literal } from '../representation/literal';

export function loadInstances(entityTree: EntityTreeNode): Instances {
    const entities = fillInstanceEntities({}, entityTree);
    const properties = fillInstanceProperties({}, entityTree);
    return new InMemoryInstanceReader({
        entityInstances: entities,
        instanceProperties: properties,
    });
}

function fillInstanceProperties(
    properties: { [key: string]: InstanceProperty[] },
    entityTree: EntityTreeNode
): { [key: string]: InstanceProperty[] } {
    Object.values(entityTree.properties).forEach((propertyInfo) => {
        let targetInstanceIndex = 0;

        const instanceProperties = propertyInfo.instances.map((instanceInfo) => {
            const instanceLinks: InstanceProperty = {
                targetInstanceIndices: _.range(targetInstanceIndex, targetInstanceIndex + instanceInfo.instances),
                literals: instanceInfo.literals
                    .filter((literal): literal is number | string | boolean | bigint | symbol => literal !== null && literal !== undefined)
                    .map((literal): Literal => ({ value: literal.toString() })),
            };
            targetInstanceIndex += instanceInfo.instances;

            // if (instanceInfo.instances > 0) {
            //     instanceLinks.entities = {
            //         targetEntity: propertyInfo.targetEntity.id,
            //         indices: _.range(targetInstanceIndex, targetInstanceIndex + instanceInfo.instances),
            //     };
            // }

            // if (instanceInfo.literals.length > 0) {
            //     instanceLinks.literals = ;
            // }

            return instanceLinks;
        });

        properties[instanceKey(entityTree.id, propertyInfo.id)] = instanceProperties;
    });

    Object.values(entityTree.properties).forEach((propertyInfo) => fillInstanceProperties(properties, propertyInfo.targetEntity));

    return properties;
}

function fillInstanceEntities(entities: { [key: identifier]: EntityInstances }, entityTree: EntityTreeNode): { [key: identifier]: EntityInstances } {
    entities[entityTree.id] = { count: entityTree.instanceCount };
    Object.values(entityTree.properties).forEach((propertyInfo) => {
        fillInstanceEntities(entities, propertyInfo.targetEntity);
    });
    return entities;
}
