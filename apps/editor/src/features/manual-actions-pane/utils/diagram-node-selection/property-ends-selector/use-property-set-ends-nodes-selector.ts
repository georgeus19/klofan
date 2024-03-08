import { useEffect } from 'react';
import { usePropertySetEndsSelector } from './use-property-set-ends-selector.ts';
import { EntitySet } from '@klofan/schema/representation';
import { useEditorContext } from '../../../../editor/editor-context';
import { showNodeSelectionHelp } from '../../../../help/content/show-node-selection-help';
import { showEntityToEntityDiagramHelp } from '../../../../help/content/show-entity-to-entity-help.tsx';

/**
 * Hook for enabling selection of property source and target from the main diagram.
 */
export function usePropertySetEndsNodesSelector(
    source: { entitySet: EntitySet | null; set: (entitySet: EntitySet) => void },
    target: { entitySet: EntitySet | null; set: (entitySet: EntitySet) => void }
) {
    const propertySetEnds = usePropertySetEndsSelector();
    const {
        help,
        diagram: {
            nodeSelection: { selectedNode, clearSelectedNode },
        },
    } = useEditorContext();

    useEffect(() => {
        if (selectedNode && propertySetEnds.selected) {
            if (propertySetEnds.sourceSelected) {
                source.set(selectedNode.data);
            } else {
                target.set(selectedNode.data);
            }

            if (
                (source.entitySet && propertySetEnds.targetSelected) ||
                (target.entitySet && propertySetEnds.sourceSelected)
            ) {
                showEntityToEntityDiagramHelp(help);
            }

            clearSelectedNode();
            propertySetEnds.unselect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    return {
        onSourceSelectStart: () => {
            showNodeSelectionHelp(help);
            propertySetEnds.selectSource();
        },
        onTargetSelectStart: () => {
            showNodeSelectionHelp(help);
            propertySetEnds.selectTarget();
        },
    };
}
