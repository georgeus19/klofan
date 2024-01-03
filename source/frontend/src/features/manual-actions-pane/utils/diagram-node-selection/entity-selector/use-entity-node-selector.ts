import { useEffect } from 'react';
import { usePropertyEndsSelector } from '../property-ends-selector/use-property-ends-selector';
import { Entity } from '../../../../../core/schema/representation/item/entity';
import { useEditorContext } from '../../../../editor/editor-context';
import { showNodeSelectionHelp } from '../../../../help/content/show-node-selection-help';

/**
 * Hook for creating a selectable field for an entity. The entity is filled in when user selects a node in the
 * main diagram after `onSelectStart()` has been run.
 */
export function useEntityNodeSelector(setEntity: (entity: Entity) => void) {
    const propertyEnds = usePropertyEndsSelector();

    const {
        diagram: {
            nodeSelection: { selectedNode, clearSelectedNode },
        },
        help,
    } = useEditorContext();

    useEffect(() => {
        if (selectedNode && propertyEnds.selected) {
            setEntity(selectedNode.data);

            clearSelectedNode();
            propertyEnds.unselect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    return {
        onSelectStart: () => {
            showNodeSelectionHelp(help);
            propertyEnds.selectSource();
        },
    };
}
