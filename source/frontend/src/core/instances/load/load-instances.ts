import { Instances } from '../instances';
import { PropertyInstance } from '../representation/property-instance';
import { propertyInstanceKey } from '../representation/raw-instances';
import { identifier } from '../../schema/utils/identifier';
import { InMemoryInstances } from '../in-memory-instances';
import { EntityTreeNode } from '../../parse/tree/entity-tree/entity-tree';
import _ from 'lodash';
import { Literal } from '../representation/literal';

export function loadInstances(entityTree: EntityTreeNode): Instances {
    const entities = fillInstanceEntities({}, entityTree);
    const properties = fillInstanceProperties({}, entityTree);
    return new InMemoryInstances({
        entityInstances: entities,
        propertyInstances: properties,
    });
}

function fillInstanceProperties(
    properties: { [key: string]: PropertyInstance[] },
    entityTree: EntityTreeNode
): { [key: string]: PropertyInstance[] } {
    Object.values(entityTree.properties).forEach((propertyInfo) => {
        let targetInstanceIndex = 0;

        const instanceProperties = propertyInfo.instances.map((instanceInfo) => {
            const instanceLinks: PropertyInstance = {
                targetInstanceIndices: _.range(targetInstanceIndex, targetInstanceIndex + instanceInfo.instances),
                literals: instanceInfo.literals
                    .filter((literal): literal is number | string | boolean | bigint | symbol => literal !== null && literal !== undefined)
                    .map((literal): Literal => ({ value: literal.toString() })),
            };
            targetInstanceIndex += instanceInfo.instances;

            return instanceLinks;
        });

        properties[propertyInstanceKey(entityTree.id, propertyInfo.id)] = instanceProperties;
    });

    Object.values(entityTree.properties).forEach((propertyInfo) => fillInstanceProperties(properties, propertyInfo.targetEntity));

    return properties;
}

function fillInstanceEntities(
    entities: { [key: identifier]: { count: number } },
    entityTree: EntityTreeNode
): { [key: identifier]: { count: number } } {
    entities[entityTree.id] = { count: entityTree.instanceCount };
    Object.values(entityTree.properties).forEach((propertyInfo) => {
        fillInstanceEntities(entities, propertyInfo.targetEntity);
    });
    return entities;
}
