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
import { ExportInstances } from './export/export-instances/export-intances';
import { showExportInstancesHelp } from '../help/content/show-export-intances-help';

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
    showExportInstances: () => void;
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
            help.hideHelp();
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
            help.hideHelp();
            setShownAction({ type: 'create-entity-shown', component: <CreateEntity></CreateEntity> });
            setShownActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showCreateLiteralProperty: () => {
            help.hideHelp();
            setShownAction({ type: 'create-literal-property-shown', component: <CreateLiteralProperty></CreateLiteralProperty> });
            setShownActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showCreateEntityProperty: () => {
            help.hideHelp();
            setShownAction({ type: 'create-entity-property-shown', component: <CreateEntityProperty></CreateEntityProperty> });
            setShownActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showEntityDetail: (entity: Entity) => {
            help.hideHelp();
            if (!shownActionLocked) {
                setShownAction({ type: 'entity-detail-shown', component: <EntityDetail entityId={entity.id}></EntityDetail> });
            }
        },
        showPrefixes: () => {
            help.hideHelp();
            setShownAction({ type: 'prefixes-shown', component: <Prefixes></Prefixes> });
            nodeSelection.clearSelectedNode();
        },
        showUpdateEntityInstancesUris: () => {
            help.hideHelp();
            setShownAction({ type: 'update-entity-instances-uris-shown', component: <UpdateEntityInstancesUris></UpdateEntityInstancesUris> });
            setShownActionLocked(true);
            nodeSelection.clearSelectedNode();
        },
        showExportInstances: () => {
            help.hideHelp();
            setShownAction({ type: 'export-instances-shown', component: <ExportInstances></ExportInstances> });
            nodeSelection.clearSelectedNode();
            showExportInstancesHelp(help);
        },
        hide: () => {
            help.hideHelp();
            setShownAction({ type: 'blank-shown', component: <div></div> });
            nodeSelection.clearSelectedNode();
            nodeSelection.enableSelectedStyle();
        },
    };
}
