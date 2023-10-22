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
    entities: { [key: id]: Entity };
    properties: { [key: id]: Property };
}

export function createEmptySchemaState(): SchemaState {
    return { entities: {}, properties: {} };
}
