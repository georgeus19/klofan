import { Positioning } from './layout/use-positioning';
import { EntityNodeEventHandler } from './node-events/entity-node-event-handler';
import { SchemaEdge, SchemaNode } from './raw-diagram';
import { NodeSelection } from './use-node-selection';

export type SchemaDiagram = {
    nodes: SchemaNode[];
    edges: SchemaEdge[];
    nodePositioning: Positioning;
    nodeEvents: {
        entityNodeHandler: EntityNodeEventHandler;
    };
    nodeSelection: NodeSelection;
};
