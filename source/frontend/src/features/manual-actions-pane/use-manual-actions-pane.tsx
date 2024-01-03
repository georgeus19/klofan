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
import { CreateLiteralProperty } from './transformation/create-literal-property/create-literal-property';
import { CreateEntityProperty } from './transformation/create-entity-property/create-entity-property';
import { Prefixes } from './detail/prefixes/prefixes';
import { UpdateEntityInstancesUris } from './transformation/update-entity-instance-uri/update-entity-instances-uris';
import { Help } from '../help/use-help';

export type ManualActionsPane = {
    shownAction: ManualActionShown;
    onActionDone: () => void;
    showMoveProperty: (entity: Entity, property: Property) => void;
    showCreateEntity: () => void;
    showCreateLiteralProperty: () => void;
    showCreateEntityProperty: () => void;
    showEntityDetail: (entity: Entity) => void;
    showPrefixes: () => void;
    showUpdateEntityInstancesUris: () => void;
    hide: () => void;
};

export function useManualActionsPane(nodeSelection: NodeSelection, schema: Schema, help: Help): ManualActionsPane {
    const [shownAction, setShownAction] = useState<ManualActionShown>({ type: 'blank-shown', component: <div></div> });
    // Add locking mechanism - so that when creating a property, it cannot e.g. change to entity detail!
    const [shownActionLocked, setShownActionLocked] = useState(false);

    return {
        shownAction: shownAction,
        onActionDone: () => {
            setShownAction({ type: 'blank-shown', component: <div></div> });
            nodeSelection.enableSelectedStyle();
            setShownActionLocked(false);
            help.hideHelp();
        },
        showMoveProperty: (entity: Entity, property: Property) => {
            if (schema.hasEntity(property.value)) {
                setShownAction({
                    type: 'move-entity-property-shown',
                    component: <MoveEntityProperty entity={entity} property={property}></MoveEntityProperty>,
                });
                setShownActionLocked(true);
                nodeSelection.disableSelectedStyle();
                nodeSelection.clearSelectedNode();
            } else {
                setShownAction({
                    type: 'move-literal-property-shown',
                    component: <MoveLiteralProperty entity={entity} property={property}></MoveLiteralProperty>,
                });
                setShownActionLocked(true);
                nodeSelection.disableSelectedStyle();
                nodeSelection.clearSelectedNode();
            }
        },
        showCreateEntity: () => {
            setShownAction({ type: 'create-entity-shown', component: <CreateEntity></CreateEntity> });
            setShownActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showCreateLiteralProperty: () => {
            setShownAction({ type: 'create-literal-property-shown', component: <CreateLiteralProperty></CreateLiteralProperty> });
            setShownActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showCreateEntityProperty: () => {
            setShownAction({ type: 'create-entity-property-shown', component: <CreateEntityProperty></CreateEntityProperty> });
            setShownActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showEntityDetail: (entity: Entity) => {
            if (!shownActionLocked) {
                setShownAction({ type: 'entity-detail-shown', component: <EntityDetail entityId={entity.id}></EntityDetail> });
            }
        },
        showPrefixes: () => {
            setShownAction({ type: 'prefixes-shown', component: <Prefixes></Prefixes> });
            nodeSelection.clearSelectedNode();
        },
        showUpdateEntityInstancesUris: () => {
            setShownAction({ type: 'update-entity-instances-uris-shown', component: <UpdateEntityInstancesUris></UpdateEntityInstancesUris> });
            setShownActionLocked(true);
            nodeSelection.clearSelectedNode();
        },
        hide: () => {
            setShownAction({ type: 'blank-shown', component: <div></div> });
            nodeSelection.clearSelectedNode();
            nodeSelection.enableSelectedStyle();
        },
    };
}
