import { useEffect } from 'react';
import { usePropertyEndsSelector } from './use-property-ends-selector';
import { Entity } from '../../../../../core/schema/representation/item/entity';
import { useEditorContext } from '../../../../editor/editor-context';
import { showNodeSelectionHelp } from '../../../../help/content/show-node-selection-help';
import { showEntityInstanceToEntityInstanceDiagramHelp } from '../../../../help/content/show-entity-instance-to-entity-instance-help';

/**
 * Hook for enabling selection of property source and target from the main diagram.
 * @param source
 * @param target
 * @returns
 */
export function usePropertyEndsNodesSelector(
    source: { entity: Entity | null; set: (entity: Entity) => void },
    target: { entity: Entity | null; set: (entity: Entity) => void }
) {
    const propertyEnds = usePropertyEndsSelector();
    const {
        help,
        diagram: {
            nodeSelection: { selectedNode, clearSelectedNode },
        },
    } = useEditorContext();

    useEffect(() => {
        if (selectedNode && propertyEnds.selected) {
            if (propertyEnds.sourceSelected) {
                source.set(selectedNode.data);
            } else {
                target.set(selectedNode.data);
            }

            if ((source.entity && propertyEnds.targetSelected) || (target.entity && propertyEnds.sourceSelected)) {
                showEntityInstanceToEntityInstanceDiagramHelp(help);
            }

            clearSelectedNode();
            propertyEnds.unselect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    return {
        onSourceSelectStart: () => {
            showNodeSelectionHelp(help);
            propertyEnds.selectSource();
        },
        onTargetSelectStart: () => {
            showNodeSelectionHelp(help);
            propertyEnds.selectTarget();
        },
    };
}
