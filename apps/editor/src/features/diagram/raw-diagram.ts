import { Node as ReactFlowNode, Edge as ReactFlowEdge } from 'reactflow';
import { identifier } from '@klofan/utils';
import { Entity, Relation as SchemaRelation } from '@klofan/schema/representation';

export type RawDiagram = {
    nodes: SchemaNode[];
    edges: SchemaEdge[];
};

export type SchemaNode = ReactFlowNode<Entity, identifier>;
export type EntityNode = ReactFlowNode<Entity, identifier>;

export type SchemaEdge = ReactFlowEdge<SchemaRelation> & { data: SchemaRelation };
