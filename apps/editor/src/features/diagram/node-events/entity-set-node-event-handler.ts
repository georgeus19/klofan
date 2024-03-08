import { EntitySet } from '@klofan/schema/representation';

export interface EntitySetNodeEventHandler {
    onNodeClick: (entity: EntitySet) => void;
}
