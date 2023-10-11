import { SafeMap } from '../safe-map';
import { id } from '../state/schema-state';
import { SchemaEntityInput } from './induce-schema-entities';
import { InstanceEntityInput, getNewId, isPrimitiveType, primitiveType } from './utils';

export interface InstanceInfo {
    literals: primitiveType[];
    instances: number;
}

export interface EntityInput {
    literal: boolean;
    id: id;
    propertyIds: SafeMap<string, id>;
    properties: SafeMap<string, EntityInput>;
    instances: SafeMap<string, InstanceInfo[]>;
    instanceCount: number;
}

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
            propertyIds: new SafeMap<string, id>(),
            properties: new SafeMap<string, EntityInput>(),
            instances: new SafeMap<string, InstanceInfo[]>(),
            instanceCount: 0,
        };
    } else {
        const id = getNewId();
        const properties = new SafeMap<string, EntityInput>(Object.entries(schemaInput).map(([key, value]) => [key, convertToEntityInput(value)]));
        const propertyIds = new SafeMap<string, id>(Object.keys(schemaInput).map((key) => [key, getNewId() + `-${key}`]));
        const instances = new SafeMap<string, InstanceInfo[]>(Object.keys(schemaInput).map((key) => [key, []]));
        return {
            id: id,
            literal: false,
            propertyIds: propertyIds,
            properties: properties,
            instances: instances,
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
        entityInput.properties.entries().forEach(([key, value]) => {
            if (Object.hasOwn(input, key)) {
                const { literals, instances } = parseInstances(fillInstancestoEntityInput(input[key as keyof typeof input], value));

                entityInput.instances.safeGet(key).push({ literals: literals, instances: instances });
                value.instanceCount += instances;
            } else {
                entityInput.instances.safeGet(key).push({ literals: [], instances: 0 });
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
