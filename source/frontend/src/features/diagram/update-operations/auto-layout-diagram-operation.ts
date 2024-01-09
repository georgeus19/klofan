import { LayoutOptions } from 'elkjs';

export type AutoLayoutDiagram = {
    type: 'auto-layout-diagram';
    layout: LayoutOptions;
    nodeSizes: { [nodeId: string]: { width?: number | null; height?: number | null } };
};
