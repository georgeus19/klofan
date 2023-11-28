import { identifier } from '../../../core/schema/utils/identifier';
import { Node as ReactFlowNode } from 'reactflow';

export type SourceNode<T> = ReactFlowNode<T & { layout: LayoutOptions }, identifier> & { type: 'source' };
export type TargetNode<T> = ReactFlowNode<T & { layout: LayoutOptions }, identifier> & { type: 'target' };
export type BipartiteNode<ST, TT> = SourceNode<ST> | TargetNode<TT>;

export function sourceNodes<ST, TT>(nodes: BipartiteNode<ST, TT>[]): SourceNode<ST>[] {
    return nodes.filter((node): node is SourceNode<ST> => node.type === 'source');
}

export function targetNodes<ST, TT>(nodes: BipartiteNode<ST, TT>[]): TargetNode<TT>[] {
    return nodes.filter((node): node is TargetNode<TT> => node.type === 'target');
}

export interface DiagramOptions {
    layout: LayoutOptions;
}

export interface LayoutOptions {
    width: number;
    widthTailwind: string;
    height: number;
    heightTailwind: string;
    node: {
        sourceX: number;
        targetX: number;
        yIncrement: number;
        width: number;
        widthTailwind: string;
        height: number;
        heightTailwind: string;
    };
    topPadding: number;
    bottomPadding: number;
}

export const defaultLayout: LayoutOptions = {
    width: 384,
    widthTailwind: 'w-96',
    height: 384,
    heightTailwind: 'h-96',
    node: {
        sourceX: 10,
        targetX: 248,
        yIncrement: 50,
        width: 128,
        widthTailwind: 'w-32',
        height: 40,
        heightTailwind: 'h-10',
    },
    topPadding: 10,
    bottomPadding: 10,
};
