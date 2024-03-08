import { useEffect } from 'react';
import { usePropertySetEndsSelector } from '../property-ends-selector/use-property-set-ends-selector.ts';
import { EntitySet } from '@klofan/schema/representation';
import { useEditorContext } from '../../../../editor/editor-context';
import { showNodeSelectionHelp } from '../../../../help/content/show-node-selection-help';

/**
 * Hook for creating a selectable field for entity set. The entity set is filled in when user selects a node in the
 * main diagram after `onSelectStart()` has been run.
 */
export function useEntitySetNodeSelector(setEntitySet: (entitySet: EntitySet) => void) {
    const propertySetEnds = usePropertySetEndsSelector();

    const {
        diagram: {
            nodeSelection: { selectedNode, clearSelectedNode },
        },
        help,
    } = useEditorContext();

    useEffect(() => {
        if (selectedNode && propertySetEnds.selected) {
            setEntitySet(selectedNode.data);

            clearSelectedNode();
            propertySetEnds.unselect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    return {
        onSelectStart: () => {
            showNodeSelectionHelp(help);
            propertySetEnds.selectSource();
        },
    };
}
