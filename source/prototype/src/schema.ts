import { IInstanceModel, InMemoryInstanceModel } from './instance';

export interface IEntity {
    getId(): string;
    addProperty(schemaModel: ISchemaModel, property: IProperty): IEntity;
    removeProperty(schemaModel: ISchemaModel, property: IProperty): IEntity;
    getProperties(): IProperty[];
}

export class Entity implements IEntity {
    constructor(
        private schemaModel: ISchemaModel,
        private id: string,
        private propertyIds: string[]
    ) {}

    getId(): string {
        return this.id;
    }
    addProperty(schemaModel: ISchemaModel, property: IProperty): IEntity {
        const clone = this.clone(schemaModel);
        clone.propertyIds.push(property.getId());
        return clone;
    }
    removeProperty(schemaModel: ISchemaModel, property: IProperty): IEntity {
        const clone = this.clone(schemaModel);
        clone.propertyIds = clone.propertyIds.filter((propertyId) => propertyId !== property.getId());
        return clone;
    }
    getProperties(): IProperty[] {
        return this.propertyIds.map((propertyId) => this.schemaModel.property(propertyId)).filter((property) => property != null) as IProperty[];
    }

    private clone(schemaModel: ISchemaModel): Entity {
        return new Entity(schemaModel, this.id, [...this.propertyIds]);
    }
}

export interface IProperty {
    getId(): string;
    getUri(): string | undefined;
    getName(): string;
    getValue(): IEntity | ILiteral;
    changeValue(schemaModel: ISchemaModel, value: IEntity | ILiteral): IProperty;
}

export class Property implements IProperty {
    constructor(
        private schemaModel: ISchemaModel,
        private id: string,
        private name: string,
        private valudId: string,
        private uri?: string
    ) {}
    getId(): string {
        return this.id;
    }
    getUri(): string | undefined {
        return this.uri;
    }
    getName(): string {
        return this.name;
    }
    getValue(): IEntity | ILiteral {
        throw new Error('Method not implemented.');
    }
    changeValue(schemaModel: ISchemaModel, value: IEntity | ILiteral): IProperty {
        const clone = this.clone(schemaModel);
        clone.valudId = value.getId();
        throw new Error('Method not implemented.');
    }

    private clone(schemaModel: ISchemaModel): Property {
        return new Property(schemaModel, this.id, this.name, this.valudId);
    }
}

export interface ILiteral {
    getId(): string;
}

export class Literal implements ILiteral {
    constructor(private id: string) {}
    getId(): string {
        return this.id;
    }
}

export interface InstanceStore {
    // Store for data in the form of EntityInstance, PropertyInstance, LiteralInstance.
}

export interface ISchemaModel {
    entities(): IEntity[];
    properties(): IProperty[];
    literals(): ILiteral[];
    entity(id: string): IEntity | null;
    property(id: string): IProperty | null;
    literal(id: string): ILiteral | null;

    getBaseSchemaModel(): ISchemaModel | null;
}

// export interface InstanceModel {
//     entities(): EntityInstance[];
//     properties(): PropertyInstance[];
//     literals(): LiteralInstance[];

// }

export class SchemaModel implements ISchemaModel {
    private _entities = new Map<string, IEntity>();
    private _properties = new Map<string, IProperty>();
    private _literals = new Map<string, ILiteral>();
    private _baseSchemaModel: ISchemaModel | null;
    constructor(baseSchemaModel: ISchemaModel | null = null) {
        this._baseSchemaModel = baseSchemaModel;
    }

    addEntity(entity: IEntity): void {
        this._entities.set(entity.getId(), entity);
    }

    addProperty(property: IProperty): void {
        this._properties.set(property.getId(), property);
    }

    addLiteral(literal: ILiteral): void {
        this._literals.set(literal.getId(), literal);
    }

    entities(): IEntity[] {
        throw new Error('Method not implemented.');
    }
    properties(): IProperty[] {
        throw new Error('Method not implemented.');
    }
    literals(): ILiteral[] {
        throw new Error('Method not implemented.');
    }
    // TODO: handle deleted entities
    entity(id: string): IEntity | null {
        const entity = this._entities.get(id);
        if (entity) {
            return entity;
        }

        if (this._baseSchemaModel) {
            return this._baseSchemaModel.entity(id);
        }

        return null;
    }
    // TODO: handle deleted properties
    property(id: string): IProperty | null {
        const property = this._properties.get(id);
        if (property) {
            return property;
        }

        if (this._baseSchemaModel) {
            return this._baseSchemaModel.property(id);
        }

        return null;
    }
    // TODO: handle deleted literals
    literal(id: string): ILiteral | null {
        const literal = this._literals.get(id);
        if (literal) {
            return literal;
        }

        if (this._baseSchemaModel) {
            return this._baseSchemaModel.literal(id);
        }
        return null;
    }
    getBaseSchemaModel(): ISchemaModel | null {
        return this._baseSchemaModel;
    }
}
