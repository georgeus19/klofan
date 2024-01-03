import { useEffect } from 'react';
import { usePropertyEndsSelector } from '../property-ends-selector/use-property-ends-selector';
import { Entity } from '../../../../../core/schema/representation/item/entity';
import { useEditorContext } from '../../../../editor/editor-context';

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

            // help.showEntityInstanceToLiteralInstanceDiagramHelp();

            clearSelectedNode();
            propertyEnds.unselect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode]);

    return {
        onSelectStart: () => {
            help.showNodeSelectionHelp();
            propertyEnds.selectSource();
        },
    };
}
