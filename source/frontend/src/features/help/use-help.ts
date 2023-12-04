import { useState } from 'react';
import { HelpContent } from './help';

export function useHelp() {
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
