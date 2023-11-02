import { RawSchema } from '../../representation/raw-schema';
import { Transformation } from './transformation';

export interface AddEntity extends Transformation {
    type: 'add-entity';
    data: {
        entityId: string;
        name?: string;
        uri?: string;
    };
}

function addEntity(schema: RawSchema, transformation: AddEntity): void {}
