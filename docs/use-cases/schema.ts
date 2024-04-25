
interface EntitySet { id: string; properties: PropertySet[]; }
interface LiteralSet { id: string; }
interface PropertySet { id: string; uri?: string; value: EntitySet | LiteralSet; }

interface RawSchema { 
    items: { [key: identifier]: Item };
    relations: { [key: identifier]: Relation };
}


interface EntitySet { id: string; properties: identifier[]; }
interface LiteralSet { id: string; }
interface PropertySet { id: string; uri?: string; value: identifier; }
interface Schema { 
    items: { [key: identifier]: EntitySet | LiteralSet };
    relations: { [key: identifier]: PropertySet };
}

interface Schema {
    // Get raw data for state purposes.
    raw:() => RawSchema
    // Query schema
    // entitySets(), entitySet(ID), propertySet(ID)
    // Transform schema - get new schema
    transform: (transformations: Transformation[]) => Schema;
}

export interface Property {
    targetEntities: number[];
    literals: Literal[];
}
export interface RawInstances {
    entities: {
        [key: identifier]: {uri?: string}[];
    };
    properties: { [key: identifier]: Property[] };
}

export interface Instances {
    // Raw instances (or some unique id) for the purpose of storing it as state in react.
    raw(): unknown;
    // Query instances.
    // ... - entities(entitySet), properties(entitySet, propertySet)
    // Transform instances by producing new instances with applied transformations.
    transform(transformations: Transformation[]): Promise<Instances>;
}