import { identifier } from '@klofan/utils';
import { Node as ReactFlowNode } from 'reactflow';
import { LayoutOptions } from './layout';

export type SourceNode<T> = ReactFlowNode<T & { layout: LayoutOptions }, identifier> & { type: 'source' };
export type TargetNode<T> = ReactFlowNode<T & { layout: LayoutOptions }, identifier> & { type: 'target' };
export type BipartiteNode<ST, TT> = SourceNode<ST> | TargetNode<TT>;

export const sourceIdPrefix = 'source';
export const targetIdPrefix = 'target';

export function sourceNodes<ST, TT>(nodes: BipartiteNode<ST, TT>[]): SourceNode<ST>[] {
    return nodes.filter((node): node is SourceNode<ST> => node.type === 'source');
}

export function targetNodes<ST, TT>(nodes: BipartiteNode<ST, TT>[]): TargetNode<TT>[] {
    return nodes.filter((node): node is TargetNode<TT> => node.type === 'target');
}

export interface DiagramOptions {
    layout: LayoutOptions;
}
