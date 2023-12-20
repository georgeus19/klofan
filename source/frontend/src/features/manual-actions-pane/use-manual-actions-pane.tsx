import { useState } from 'react';
import { NodeSelection } from '../diagram/use-node-selection';
import { Entity } from '../../core/schema/representation/item/entity';
import { Property } from '../../core/schema/representation/relation/property';
import { Schema } from '../../core/schema/schema';
import { ManualActionShown } from './actions';
import { MoveEntityProperty } from './transformation/move-entity-property';
import { MoveLiteralProperty } from './transformation/move-literal-property';
import { CreateEntity } from './transformation/create-entity';
import { EntityDetail } from './detail/entity-detail';
import { CreateLiteralProperty } from './transformation/create-property/create-literal-property';
import { CreateEntityProperty } from './transformation/create-property/create-entity-property';

export type ManualActionsPane = {
    shownAction: ManualActionShown;
    onActionDone: () => void;
    showMoveProperty: (entity: Entity, property: Property) => void;
    showCreateEntity: () => void;
    showCreateLiteralProperty: () => void;
    showCreateEntityProperty: () => void;
    showEntityDetail: (entity: Entity) => void;
    hide: () => void;
};

export function useManualActionsPane(nodeSelection: NodeSelection, schema: Schema): ManualActionsPane {
    const [sideAction, setSideAction] = useState<ManualActionShown>({ type: 'blank-shown', component: <div></div> });
    // Add locking mechanism - so that when creating a property, it cannot e.g. change to entity detail!
    const [sideActionLocked, setSideActionLocked] = useState(false);

    return {
        shownAction: sideAction,
        onActionDone: () => {
            setSideAction({ type: 'blank-shown', component: <div></div> });
            nodeSelection.enableSelectedStyle();
            setSideActionLocked(false);
        },
        showMoveProperty: (entity: Entity, property: Property) => {
            if (schema.hasEntity(property.value)) {
                setSideAction({
                    type: 'move-entity-property-shown',
                    component: <MoveEntityProperty entity={entity} property={property}></MoveEntityProperty>,
                });
                setSideActionLocked(true);
                nodeSelection.disableSelectedStyle();
                nodeSelection.clearSelectedNode();
            } else {
                setSideAction({
                    type: 'move-literal-property-shown',
                    component: <MoveLiteralProperty entity={entity} property={property}></MoveLiteralProperty>,
                });
                setSideActionLocked(true);
                nodeSelection.disableSelectedStyle();
                nodeSelection.clearSelectedNode();
            }
        },
        showCreateEntity: () => {
            setSideAction({ type: 'create-entity-shown', component: <CreateEntity></CreateEntity> });
            setSideActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showCreateLiteralProperty: () => {
            setSideAction({ type: 'create-literal-property-shown', component: <CreateLiteralProperty></CreateLiteralProperty> });
            setSideActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showCreateEntityProperty: () => {
            setSideAction({ type: 'create-entity-property-shown', component: <CreateEntityProperty></CreateEntityProperty> });
            setSideActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showEntityDetail: (entity: Entity) => {
            if (!sideActionLocked) {
                setSideAction({ type: 'entity-detail-shown', component: <EntityDetail entity={entity}></EntityDetail> });
            }
        },
        hide: () => {
            setSideAction({ type: 'blank-shown', component: <div></div> });
            nodeSelection.clearSelectedNode();
            nodeSelection.enableSelectedStyle();
        },
    };
}
