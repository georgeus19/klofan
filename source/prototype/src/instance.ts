import { IEntity, IProperty } from './schema';

export interface IEntityInstance {
    getId(): string;
    getUri(): string | undefined;
    addProperty(instanceModel: IInstanceModel, property: IPropertyInstance): IEntityInstance;
    removeProperty(instanceModel: IInstanceModel, property: IPropertyInstance): IEntityInstance;
    getProperties(): IPropertyInstance[];
}

export class EntityInstance implements IEntityInstance {
    constructor(
        private instanceModel: IInstanceModel,
        private id: string,
        private propertyIds: string[],
        private uri?: string
    ) {}
    getId(): string {
        return this.id;
    }
    getUri(): string | undefined {
        return this.uri;
    }
    addProperty(instanceModel: IInstanceModel, property: IPropertyInstance): IEntityInstance {
        const clone = this.clone(instanceModel);
        clone.propertyIds.push(property.getId());
        return clone;
    }
    removeProperty(instanceModel: IInstanceModel, property: IPropertyInstance): IEntityInstance {
        const clone = this.clone(instanceModel);
        clone.propertyIds = clone.propertyIds.filter((propertyId) => propertyId !== property.getId());
        return clone;
    }
    getProperties(): IPropertyInstance[] {
        return this.propertyIds.map((propertyId) => this.instanceModel.property(propertyId));
    }

    private clone(instanceModel: IInstanceModel): EntityInstance {
        return new EntityInstance(instanceModel, this.id, [...this.propertyIds]);
    }
}

export interface IPropertyInstance {
    getId(): string;
    getValue(): IEntityInstance | ILiteralInstance;
}

export class PropertyInstance implements IPropertyInstance {
    constructor(
        private instanceModel: IInstanceModel,
        private id: string,
        private valueId: string
    ) {}
    getId(): string {
        return this.id;
    }
    getValue(): IEntityInstance | ILiteralInstance {
        throw new Error('Method not implemented.');
    }
}

export interface ILiteralInstance {
    getId(): string;
    getValue(): string;
    getType(): string | undefined;
}
export class LiteralInstance implements ILiteralInstance {
    constructor(
        private id: string,
        private value: string,
        private type?: string
    ) {}
    getId(): string {
        return this.id;
    }
    getValue(): string {
        return this.value;
    }
    getType(): string | undefined {
        return this.type;
    }
}

export interface IInstanceModel {
    getEntities(entity: IEntity): IEntityInstance[];
    getProperty(entity: IEntityInstance, property: IProperty): IPropertyInstance;
    entities(): IEntityInstance[];
    properties(): IPropertyInstance[];
    literals(): ILiteralInstance[];
    entity(id: string): IEntityInstance;
    property(id: string): IPropertyInstance;
    literal(id: string): ILiteralInstance;

    safeEntity(id: string): IEntityInstance | null;
    safeProperty(id: string): IPropertyInstance | null;
    safeLiteral(id: string): ILiteralInstance | null;

    getBaseInstanceModel(): IInstanceModel | null;
}

export class InMemoryInstanceModel implements IInstanceModel {
    private _entities = new Map<string, IEntityInstance>();
    private _properties = new Map<string, IPropertyInstance>();
    private _literals = new Map<string, ILiteralInstance>();
    private _baseInstanceModel: IInstanceModel | null;

    private _entityInstanceMapping = new Map<string, IEntityInstance[]>();
    private _propertyInstanceMapping = new Map<string, IPropertyInstance[]>();

    constructor(baseInstanceModel: IInstanceModel | null = null) {
        this._baseInstanceModel = baseInstanceModel;
    }
    getEntities(entity: IEntity): IEntityInstance[] {
        const entities = this._entityInstanceMapping.get(entity.getId());
        if (entities) {
            return entities;
        }
        throw new Error('Method not implemented.');
    }

    getProperty(entity: IEntityInstance, property: IProperty): IPropertyInstance {
        const intances = this._propertyInstanceMapping.get(property.getId());
        if (intances) {
            for (const instance of intances) {
                for (const prop of entity.getProperties()) {
                    if (instance.getId() == prop.getId()) {
                        return instance;
                    }
                }
            }
        }
        console.log(this._propertyInstanceMapping);
        console.log(entity, property);
        throw new Error();
    }

    addEntity(entity: IEntity, entityInstance: IEntityInstance): void {
        const instances = this._entityInstanceMapping.get(entity.getId());
        if (instances) {
            instances.push(entityInstance);
        } else {
            this._entityInstanceMapping.set(entity.getId(), [entityInstance]);
        }
        this._entities.set(entityInstance.getId(), entityInstance);
    }

    addProperty(property: IProperty, propertyInstance: IPropertyInstance): void {
        const instances = this._propertyInstanceMapping.get(property.getId());
        if (instances) {
            instances.push(propertyInstance);
        } else {
            this._propertyInstanceMapping.set(property.getId(), [propertyInstance]);
        }
        this._properties.set(propertyInstance.getId(), propertyInstance);
    }

    addLiteral(literal: ILiteralInstance): void {
        this._literals.set(literal.getId(), literal);
    }

    entities(): IEntityInstance[] {
        throw new Error('Method not implemented.');
    }
    properties(): IPropertyInstance[] {
        throw new Error('Method not implemented.');
    }
    literals(): ILiteralInstance[] {
        throw new Error('Method not implemented.');
    }
    entity(id: string): IEntityInstance {
        return this.safeEntity(id)!;
    }
    property(id: string): IPropertyInstance {
        return this.safeProperty(id)!;
    }
    literal(id: string): ILiteralInstance {
        return this.safeLiteral(id)!;
    }
    safeEntity(id: string): IEntityInstance | null {
        const entity = this._entities.get(id);
        if (entity) {
            return entity;
        }

        if (this._baseInstanceModel) {
            return this._baseInstanceModel.entity(id);
        }

        return null;
    }
    safeProperty(id: string): IPropertyInstance | null {
        const property = this._properties.get(id);
        if (property) {
            return property;
        }

        if (this._baseInstanceModel) {
            return this._baseInstanceModel.property(id);
        }

        return null;
    }
    safeLiteral(id: string): ILiteralInstance | null {
        const literal = this._literals.get(id);
        if (literal) {
            return literal;
        }

        if (this._baseInstanceModel) {
            return this._baseInstanceModel.literal(id);
        }
        return null;
    }
    getBaseInstanceModel(): IInstanceModel | null {
        return this._baseInstanceModel;
    }
}
