import { id } from '../state/schema-state';
import { SchemaEntityInput } from './induce-schema-entities';
import { InstanceEntityInput, getNewId, isPrimitiveType, primitiveType } from './utils';

export interface PropertyInfo {
    id: id;
    targetEntity: EntityInput;
    instances: { literals: primitiveType[]; instances: number }[];
}

export interface EntityInput {
    literal: boolean;
    id: id;
    properties: { [key: id]: PropertyInfo };
    instanceCount: number;
}

/**
 * Takes tree like instances(data) and their schema and merges them so that schema entity can reference easily the underlying data.
 * Also adds ids to schema entities and properties.
 */
export function createEntityInput(instanceInput: InstanceEntityInput, schemaInput: SchemaEntityInput): EntityInput {
    const entityInput = convertToEntityInput(schemaInput);
    const { instances } = parseInstances(fillInstancestoEntityInput(instanceInput, entityInput));
    entityInput.instanceCount += instances;
    return entityInput;
}

function convertToEntityInput(schemaInput: SchemaEntityInput): EntityInput {
    if (isPrimitiveType(schemaInput)) {
        return {
            id: getNewId(),
            literal: true,
            properties: {},
            instanceCount: 0,
        };
    } else {
        const id = getNewId();
        const propertyTargets = Object.entries(schemaInput).map(([key, value]): [id, EntityInput] => [key, convertToEntityInput(value)]);
        const properties = Object.fromEntries(
            propertyTargets.map(([propertyName, targetEntity]) => [
                propertyName,
                {
                    id: getNewId() + `-${propertyName}`,
                    targetEntity: targetEntity,
                    instances: [],
                },
            ])
        );
        return {
            id: id,
            literal: false,
            properties: properties,
            instanceCount: 0,
        };
    }
}

function fillInstancestoEntityInput(input: InstanceEntityInput, entityInput: EntityInput): (object | primitiveType)[] {
    if (isPrimitiveType(input)) {
        return [input];
    } else if (Array.isArray(input)) {
        return input.map((instance) => fillInstancestoEntityInput(instance, entityInput)).flat();
    } else {
        Object.entries(entityInput.properties).forEach(([property, propertyInfo]) => {
            if (Object.hasOwn(input, property)) {
                const { literals, instances } = parseInstances(
                    fillInstancestoEntityInput(input[property as keyof typeof input], propertyInfo.targetEntity)
                );

                propertyInfo.instances.push({ literals: literals, instances: instances });
                propertyInfo.targetEntity.instanceCount += instances;
            } else {
                propertyInfo.instances.push({ literals: [], instances: 0 });
            }
        });

        return [{}];
    }
}

function parseInstances(x: (object | primitiveType)[]): { literals: primitiveType[]; instances: number } {
    const literals = x.filter((i): i is primitiveType => isPrimitiveType(i));
    const instances = x.length - literals.length;
    return { literals: literals, instances: instances };
}
