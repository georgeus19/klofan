import { PropertySet, EntitySet } from '@klofan/schema/representation';
import { Schema } from '@klofan/schema';
import { ManualActionsPane } from '../../manual-actions-pane/use-manual-actions-pane';
import { EntityNodeEventHandler } from './entity-node-event-handler';
import { NodeSelection } from '../use-node-selection';
import { SchemaEdge, SchemaNode } from '../raw-diagram';
import { PropertySelection } from '../use-property-selection';

export function useNodeEvents({
    diagram,
    schema,
    nodeSelection,
    edgeSelection,
    manualActions,
}: {
    diagram: { nodes: SchemaNode[]; edges: SchemaEdge[] };
    schema: Schema;
    nodeSelection: NodeSelection;

    edgeSelection: PropertySelection;
    manualActions: ManualActionsPane;
}) {
    const entityNodeEventHandler: EntityNodeEventHandler = {
        onNodeClick: (entity: EntitySet) => {
            const selectedNode = diagram.nodes.find((node) => node.id === entity.id);
            if (selectedNode) {
                nodeSelection.addSelectedNode(selectedNode);
                manualActions.showEntityDetail(schema.entity(selectedNode.id));
            }
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onPropertyClick: (_property: PropertySet) => {},
    };

    return {
        entityNodeHandler: entityNodeEventHandler,
    };
}
