import { XYPosition } from 'reactflow';

export interface LayoutOptions {
    width: number;
    widthTailwind: string;
    height: number;
    maxDiagramHeight: number;
    minDiagramHeight: number;
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
    maxDiagramHeight: 384,
    minDiagramHeight: 200,
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
    bottomPadding: 200,
};

export function calculateSourceNodePosition(layout: LayoutOptions, index: number): XYPosition {
    return { x: layout.node.sourceX, y: layout.node.yIncrement * index + layout.topPadding };
}

export function calculateTargetNodePosition(layout: LayoutOptions, index: number): XYPosition {
    return { x: layout.node.targetX, y: layout.node.yIncrement * index + layout.topPadding };
}
