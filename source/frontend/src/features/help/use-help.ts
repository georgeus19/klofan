import { useState } from 'react';
import { HelpContent } from './help';

export type Help = {
    help: { show: true; content: HelpContent } | { show: false };
    showNodeSelectionHelp: () => void;
    showEntityInstanceToEntityInstanceDiagramHelp: () => void;
    showEntityInstanceToLiteralInstanceDiagramHelp: () => void;
    hideHelp: () => void;
};

export function useHelp(): Help {
    const [help, setHelp] = useState<{ show: true; content: HelpContent } | { show: false }>({ show: false });

    return {
        help,
        showNodeSelectionHelp: () => setHelp({ show: true, content: { type: 'node-selection-help-content' } }),
        showEntityInstanceToEntityInstanceDiagramHelp: () =>
            setHelp({ show: true, content: { type: 'entity-instance-to-entity-instance-diagram-content' } }),
        showEntityInstanceToLiteralInstanceDiagramHelp: () =>
            setHelp({ show: true, content: { type: 'entity-instance-to-literal-instance-diagram-content' } }),
        hideHelp: () => setHelp({ show: false }),
    };
}
