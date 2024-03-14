import { useState } from 'react';
import { NodeSelection } from '../diagram/use-node-selection';
import { PropertySet, EntitySet } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { ManualActionShown } from './actions';
import { MoveEntityPropertySet } from './transformation/move-entity-property-set.tsx';
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
import { ExportOperations } from './export/export-operations';
import { showExportOperationsHelp } from '../help/content/show-export-operations-help';

export type ManualActionsPane = {
    shownAction: ManualActionShown;
    onActionDone: () => void;
    showMoveProperty: (entity: EntitySet, property: PropertySet) => void;
    showCreateEntitySet: () => void;
    showCreateLiteralPropertySet: () => void;
    showCreateEntityPropertySet: () => void;
    showEntitySetDetail: (entitySet: EntitySet) => void;
    showPrefixes: () => void;
    showUpdateEntitiesUris: () => void;
    showExportInstances: () => void;
    showExportOperations: () => void;
    hide: () => void;
};

export function useManualActionsPane(
    nodeSelection: NodeSelection,
    schema: Schema,
    help: Help
): ManualActionsPane {
    const [shownAction, setShownAction] = useState<ManualActionShown>({
        type: 'blank-shown',
        component: <div></div>,
    });
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
        showMoveProperty: (entitySet: EntitySet, propertySet: PropertySet) => {
            help.hideHelp();
            if (schema.hasEntitySet(propertySet.value)) {
                setShownAction({
                    type: 'move-entity-property-set-shown',
                    component: (
                        <MoveEntityPropertySet
                            entitySet={entitySet}
                            propertySet={propertySet}
                        ></MoveEntityPropertySet>
                    ),
                });
                setShownActionLocked(true);
                nodeSelection.disableSelectedStyle();
                nodeSelection.clearSelectedNode();
            } else {
                setShownAction({
                    type: 'move-literal-property-set-shown',
                    component: (
                        <MoveLiteralProperty
                            entity={entitySet}
                            property={propertySet}
                        ></MoveLiteralProperty>
                    ),
                });
                setShownActionLocked(true);
                nodeSelection.disableSelectedStyle();
                nodeSelection.clearSelectedNode();
            }
        },
        showCreateEntitySet: () => {
            help.hideHelp();
            setShownAction({
                type: 'create-entity-set-shown',
                component: <CreateEntity></CreateEntity>,
            });
            setShownActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showCreateLiteralPropertySet: () => {
            help.hideHelp();
            setShownAction({
                type: 'create-literal-property-set-shown',
                component: <CreateLiteralProperty></CreateLiteralProperty>,
            });
            setShownActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showCreateEntityPropertySet: () => {
            help.hideHelp();
            setShownAction({
                type: 'create-entity-property-set-shown',
                component: <CreateEntityProperty></CreateEntityProperty>,
            });
            setShownActionLocked(true);
            nodeSelection.disableSelectedStyle();
            nodeSelection.clearSelectedNode();
        },
        showEntitySetDetail: (entity: EntitySet) => {
            help.hideHelp();
            if (!shownActionLocked) {
                setShownAction({
                    type: 'entity-set-detail-shown',
                    component: <EntityDetail entityId={entity.id}></EntityDetail>,
                });
            }
        },
        showPrefixes: () => {
            help.hideHelp();
            setShownAction({ type: 'prefixes-shown', component: <Prefixes></Prefixes> });
            nodeSelection.clearSelectedNode();
        },
        showUpdateEntitiesUris: () => {
            help.hideHelp();
            setShownAction({
                type: 'update-entity-instances-uris-shown',
                component: <UpdateEntityInstancesUris></UpdateEntityInstancesUris>,
            });
            setShownActionLocked(true);
            nodeSelection.clearSelectedNode();
        },
        showExportInstances: () => {
            help.hideHelp();
            setShownAction({
                type: 'export-instances-shown',
                component: <ExportInstances></ExportInstances>,
            });
            nodeSelection.clearSelectedNode();
            showExportInstancesHelp(help);
        },
        showExportOperations: () => {
            showExportOperationsHelp(help);
            setShownAction({
                type: 'export-operations-shown',
                component: <ExportOperations></ExportOperations>,
            });
            nodeSelection.clearSelectedNode();
        },
        hide: () => {
            help.hideHelp();
            setShownAction({ type: 'blank-shown', component: <div></div> });
            nodeSelection.clearSelectedNode();
            nodeSelection.enableSelectedStyle();
        },
    };
}
