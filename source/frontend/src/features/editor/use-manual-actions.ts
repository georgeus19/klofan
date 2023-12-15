import { useState } from 'react';
import { ShowAction } from '../action-bar/actions';
import { NodeSelection } from '../diagram/use-node-selection';
import { Entity } from '../../core/schema/representation/item/entity';
import { Property } from '../../core/schema/representation/relation/property';
import { Schema } from '../../core/schema/schema';

export type ManualActions = {
    shownAction: ShowAction;
    onActionDone: () => void;
    showMoveProperty: (entity: Entity, property: Property) => void;
    showCreateEntity: () => void;
    showCreateProperty: () => void;
    showEntityDetail: (entity: Entity) => void;
    hide: () => void;
};

export function useManualActions(nodeSelection: NodeSelection, schema: Schema): ManualActions {
    const [sideAction, setSideAction] = useState<ShowAction>({ type: 'show-blank' });
    // Add locking mechanism - so that when creating a property, it cannot e.g. change to entity detail!
    const [sideActionLocked, setSideActionLocked] = useState(false);

    return {
        shownAction: sideAction,
        onActionDone: () => {
            setSideAction({ type: 'show-blank' });
            nodeSelection.enableSelectedStyle();
            setSideActionLocked(false);
        },
        showMoveProperty: (entity: Entity, property: Property) => {
            if (schema.hasEntity(property.value)) {
                setSideAction({ type: 'show-move-entity-property', entity: entity, property: property });
                setSideActionLocked(true);
                nodeSelection.disableSelectedStyle();
                nodeSelection.clearSelectedNode();
            } else {
                setSideAction({ type: 'show-move-literal-property', entity: entity, property: property });
                setSideActionLocked(true);
                nodeSelection.disableSelectedStyle();
                nodeSelection.clearSelectedNode();
            }
        },
        showCreateEntity: () => {
            setSideAction({ type: 'show-create-entity' });
            setSideActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showCreateProperty: () => {
            setSideAction({ type: 'show-create-property' });
            setSideActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showEntityDetail: (entity: Entity) => {
            if (!sideActionLocked) {
                setSideAction({ type: 'show-entity-detail', entity: entity });
            }
        },
        hide: () => {
            setSideAction({ type: 'show-blank' });
            nodeSelection.clearSelectedNode();
            nodeSelection.enableSelectedStyle();
        },
    };
}
