import { Entity } from '../../core/schema/representation/item/entity';
import { Schema } from '../../core/schema/schema';
import { ManualActions } from '../editor/use-manual-actions';
import { EntityNodeEventHandler } from './node-events/entity-node-event-handler';
import { NodeSelection } from './use-node-selection';
import { SchemaEdge, SchemaNode } from './use-positioning';

export function useNodeEvents({
    diagram,
    schema,
    nodeSelection,
    manualActions,
}: {
    diagram: { nodes: SchemaNode[]; edges: SchemaEdge[] };
    schema: Schema;
    nodeSelection: NodeSelection;
    manualActions: ManualActions;
}) {
    const entityNodeEventHandler: EntityNodeEventHandler = {
        onNodeClick: (entity: Entity) => {
            const selectedNode = diagram.nodes.find((node) => node.id === entity.id);
            if (selectedNode) {
                nodeSelection.addSelectedNode(selectedNode);
                manualActions.showEntityDetail(schema.entity(selectedNode.id));
            }
        },
        onPropertyClick: (property: Property) => {},
    };

    return {
        entityNodeHandler: entityNodeEventHandler,
    };
}
