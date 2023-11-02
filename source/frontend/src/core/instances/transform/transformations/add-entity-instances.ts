import { Transformation } from './transformation';

export interface AddEntityInstances extends Transformation {
    type: 'add-entity-instances';
    data: {
        entityId: string;
        name?: string;
        uri?: string;
    };
}

function addEntity(instances: Instances, transformation: AddEntity): void {}
