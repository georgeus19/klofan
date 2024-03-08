import { Positioning } from './layout/use-positioning';
import { EntitySetNodeEventHandler } from './node-events/entity-set-node-event-handler.ts';
import { SchemaEdge, SchemaNode } from './raw-diagram';
import { NodeSelection } from './use-node-selection';

/**
 * Api for accessing and manipulating main schema diagram passed down to components.
 */
export type SchemaDiagram = {
    nodes: SchemaNode[];
    edges: SchemaEdge[];
    nodePositioning: Positioning;
    nodeEvents: {
        entitySetNodeEventHandler: EntitySetNodeEventHandler;
    };
    nodeSelection: NodeSelection;
};
