import { Instances } from '../instances';
import { Property } from '../representation/property';
import { initEntities, propertyKey } from '../representation/raw-instances';
import { identifier, XSD } from '@klofan/utils';
import { InMemoryInstances } from '../in-memory-instances';
import { EntityTreeNode } from '@klofan/parse';

import _ from 'lodash';
import { createLiteral, Literal } from '../representation/literal';
import { EntityWithoutProperties } from '../representation/entity';

export function loadInstances(entityTree: EntityTreeNode): Instances {
    const entities = fillEntities({}, entityTree);
    const properties = fillProperties({}, entityTree);
    return new InMemoryInstances({
        entities: entities,
        properties: properties,
    });
}

function fillProperties(
    properties: { [key: string]: Property[] },
    entityTree: EntityTreeNode
): { [key: string]: Property[] } {
    Object.values(entityTree.properties).forEach((propertyInfo) => {
        let targetEntityIndex = 0;

        const instanceProperties = propertyInfo.instances.map((instanceInfo) => {
            const property: Property = {
                targetEntities: _.range(
                    targetEntityIndex,
                    targetEntityIndex + instanceInfo.instances
                ),
                literals: instanceInfo.literals
                    .filter(
                        (literal): literal is number | string | boolean | bigint | symbol =>
                            literal !== null && literal !== undefined
                    )
                    .map(
                        (literal): Literal =>
                            createLiteral({
                                value: literal.toString(),
                                type: getLiteralType(literal),
                            })
                    ),
            };
            targetEntityIndex += instanceInfo.instances;

            return property;
        });

        properties[propertyKey(entityTree.id, propertyInfo.id)] = instanceProperties;
    });

    Object.values(entityTree.properties).forEach((propertyInfo) =>
        fillProperties(properties, propertyInfo.targetEntity)
    );

    return properties;
}

function getLiteralType(literal: number | string | boolean | bigint | symbol): string {
    switch (typeof literal) {
        case 'number':
            if (Number.isInteger(literal)) {
                return XSD.INTEGER;
            } else {
                return XSD.DOUBLE;
            }
        case 'string':
            return XSD.STRING;
        case 'boolean':
            return XSD.BOOLEAN;
        case 'bigint':
            return XSD.INTEGER;
        case 'symbol':
            return XSD.STRING;
    }
}

function fillEntities(
    entities: {
        [key: identifier]: EntityWithoutProperties[];
    },
    entityTree: EntityTreeNode
): { [key: identifier]: EntityWithoutProperties[] } {
    entities[entityTree.id] = initEntities(entityTree.instanceCount);
    Object.values(entityTree.properties).forEach((propertyInfo) => {
        fillEntities(entities, propertyInfo.targetEntity);
    });
    return entities;
}
