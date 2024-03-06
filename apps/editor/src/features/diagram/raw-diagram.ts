import { Node as ReactFlowNode, Edge as ReactFlowEdge } from 'reactflow';
import { identifier } from '@klofan/utils';
import { EntitySet, Relation as SchemaRelation } from '@klofan/schema/representation';

export type RawDiagram = {
    nodes: SchemaNode[];
    edges: SchemaEdge[];
};

export type SchemaNode = ReactFlowNode<EntitySet, identifier>;
export type EntityNode = ReactFlowNode<EntitySet, identifier>;

export type SchemaEdge = ReactFlowEdge<SchemaRelation> & { data: SchemaRelation };
