import { SafeMap } from '../safe-map';

/**
 * Type for entity and property ids. Since it is primitive, it is lowercase.
 */
export type id = string;

export interface Entity {
    id: id;
    literal: boolean;
    properties: id[];
}

export interface Property {
    id: id;
    name: string;
    value: id;
}

export interface SchemaState {
    entities: SafeMap<id, Entity>;
    properties: SafeMap<id, Property>;
}

export function createEmptySchemaState(): SchemaState {
    return { entities: new SafeMap<id, Entity>(), properties: new SafeMap<id, Property>() };
}
