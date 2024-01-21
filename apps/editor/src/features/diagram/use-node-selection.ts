import { useCallback, useState } from 'react';
import { EntityNode, SchemaNode } from './raw-diagram';

export interface NodeSelection {
    selectedNode: EntityNode | null;
    selectedStyle: string;
    enableSelectedStyle: () => void;
    disableSelectedStyle: () => void;
    addSelectedNode: (node: EntityNode) => void;
    clearSelectedNode: () => void;
}

export function useNodeSelection(): NodeSelection {
    const [selectedNode, setSelectedNode] = useState<SchemaNode | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>('bg-yellow-200');

    const addSelectedNode = useCallback((node: SchemaNode) => setSelectedNode(node), []);
    const clearSelectedNode = useCallback(() => setSelectedNode(null), []);
    const enableSelectedStyle = useCallback(() => setSelectedStyle('bg-yellow-200'), []);
    const disableSelectedStyle = useCallback(() => setSelectedStyle(''), []);

    return { selectedNode, clearSelectedNode, addSelectedNode, selectedStyle, enableSelectedStyle, disableSelectedStyle };
}
