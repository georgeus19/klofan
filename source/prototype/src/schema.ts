export interface EntityInstance {
    id: string;
    // uri: string;
}

export interface PropertyInstance {
    id: string;
    // uri: string;
}
export interface LiteralInstance {
    id: string;
    // uri: string;
}

export interface Instance {
    id: string;
    value: string;
}

export interface Entity {
    id: string;
    properties: Property[];

    // getInstances(): EntityInstance[];
}
export interface Property {
    name: string;
    // uri: string;
    value: Entity | Literal;

    // getInstances(entity: EntityInstance): EntityInstance[] | LiteralInstance[];
}
export interface Literal {
    id: string;
    // getInstances(): LiteralInstance[];
}

export interface InstanceStore {
    // Store for data in the form of EntityInstance, PropertyInstance, LiteralInstance.
}

export interface BaseModel {
    entities: Entity[];
    properties: Property[];
}
