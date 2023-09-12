import { ISchemaModel, SchemaModel, IEntity, Entity, IProperty, Property, ILiteral, Literal } from './schema';

import {
    IInstanceModel,
    InMemoryInstanceModel,
    IEntityInstance,
    EntityInstance,
    IPropertyInstance,
    PropertyInstance,
    ILiteralInstance,
    LiteralInstance,
} from './instance';

export interface Command {
    execute(): [ISchemaModel, IInstanceModel];
}
export class MovePropertyCommand implements Command {
    private newSchemaModel: SchemaModel;
    private newInstanceModel: InMemoryInstanceModel;
    constructor(
        private schemaModel: ISchemaModel,
        private instanceModel: IInstanceModel,
        private property: IProperty,
        private sourceEntity: IEntity,
        private targetEntity: IEntity
    ) {
        this.newSchemaModel = new SchemaModel(schemaModel);
        this.newInstanceModel = new InMemoryInstanceModel(instanceModel);
    }
    execute(): [ISchemaModel, IInstanceModel] {
        const newSourceEntity = this.sourceEntity.removeProperty(this.newSchemaModel, this.property);
        const newTargetEntity = this.targetEntity.addProperty(this.newSchemaModel, this.property);
        const sourceInstanceEntities = this.instanceModel.getEntities(this.sourceEntity);
        sourceInstanceEntities.forEach((instance) => {
            const newSourceInstanceEntity = instance.removeProperty(this.newInstanceModel, this.instanceModel.getProperty(instance, this.property));
            this.newInstanceModel.addEntity(newSourceEntity, newSourceInstanceEntity);
        });
        const targetInstanceEntities = this.instanceModel.getEntities(this.targetEntity);
        targetInstanceEntities.forEach((instance, i) => {
            const newTargetInstanceEntity = instance.addProperty(
                this.newInstanceModel,
                this.instanceModel.getProperty(sourceInstanceEntities[i], this.property)
            );
            this.newInstanceModel.addEntity(newTargetEntity, newTargetInstanceEntity);
        });
        this.newSchemaModel.addEntity(newSourceEntity);
        this.newSchemaModel.addEntity(newTargetEntity);
        return [this.newSchemaModel, this.newInstanceModel];
    }
}
