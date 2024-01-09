import { Node as ReactFlowNode, Edge as ReactFlowEdge } from 'reactflow';
import { identifier } from '../../core/schema/utils/identifier';
import { Relation as SchemaRelation } from '../../core/schema/representation/relation/relation';
import { Entity } from '../../core/schema/representation/item/entity';

export type RawDiagram = {
    nodes: SchemaNode[];
    edges: SchemaEdge[];
};

export type SchemaNode = ReactFlowNode<Entity, identifier>;
export type EntityNode = ReactFlowNode<Entity, identifier>;

export type SchemaEdge = ReactFlowEdge<SchemaRelation> & { data: SchemaRelation };
