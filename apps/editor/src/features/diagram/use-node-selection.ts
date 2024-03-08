import { useCallback, useState } from 'react';
import { EntitySetNode, SchemaNode } from './raw-diagram';

export interface NodeSelection {
    selectedNode: EntitySetNode | null;
    selectedStyle: string;
    enableSelectedStyle: () => void;
    disableSelectedStyle: () => void;
    addSelectedNode: (node: EntitySetNode) => void;
    clearSelectedNode: () => void;
}

/**
 * Logic for enabling selecting a schema node from diagram, visualizing it and letting other non diagram components react to it.
 */
export function useNodeSelection(): NodeSelection {
    const [selectedNode, setSelectedNode] = useState<SchemaNode | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>('bg-yellow-200');

    const addSelectedNode = useCallback((node: SchemaNode) => setSelectedNode(node), []);
    const clearSelectedNode = useCallback(() => setSelectedNode(null), []);
    const enableSelectedStyle = useCallback(() => setSelectedStyle('bg-yellow-200'), []);
    const disableSelectedStyle = useCallback(() => setSelectedStyle(''), []);

    return {
        selectedNode,
        clearSelectedNode,
        addSelectedNode,
        selectedStyle,
        enableSelectedStyle,
        disableSelectedStyle,
    };
}
