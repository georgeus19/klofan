import { useReducer } from 'react';
import { Dropdown } from '../../utils/dropdown.tsx';
import { Header } from '../utils/header';
import { useEditorContext } from '../../editor/editor-context';
import { ActionOkCancel } from '../utils/action-ok-cancel';
import { download } from './download';
import { usePrefixesContext } from '../../prefixes/prefixes-context';
import { isDiagramUpdateOperation } from '../../diagram/update-operations/update-diagram';
import { UpdateHistoryOperation } from '../../editor/history/update-history-operation.ts';

export type ExportOperationsShown = {
    type: 'export-operations-shown';
};

export type IncludeInfo = {
    transformations: boolean;
    importedData: boolean;
    prefixes: boolean;
    diagramPositions: boolean;
};
export type IncludeActions =
    | { type: 'include-data-transformations' }
    | { type: 'include-imported-data' }
    | { type: 'include-prefixes' }
    | { type: 'include-diagram-positions' };

function reducer(state: IncludeInfo, action: IncludeActions): IncludeInfo {
    switch (action.type) {
        case 'include-data-transformations':
            return { ...state, transformations: !state.transformations };
        case 'include-imported-data':
            return { ...state, importedData: !state.importedData };
        case 'include-diagram-positions':
            return { ...state, diagramPositions: !state.diagramPositions };
        case 'include-prefixes':
            return { ...state, prefixes: !state.prefixes };
    }
}

export function ExportOperations() {
    const [include, dispatchInclude] = useReducer(reducer, {
        transformations: true,
        importedData: false,
        prefixes: false,
        diagramPositions: false,
    });

    const handleDataTransformationsCheckChange = () =>
        dispatchInclude({ type: 'include-data-transformations' });
    const handleImportedDataCheckChange = () => dispatchInclude({ type: 'include-imported-data' });
    const handlePrefixesCheckChange = () => dispatchInclude({ type: 'include-prefixes' });
    const handleDiagramPositionsCheckChange = () =>
        dispatchInclude({ type: 'include-diagram-positions' });

    const { history, manualActions } = useEditorContext();
    const { prefixes } = usePrefixesContext();

    const exportOperations = () => {
        const importOperations = history.operations
            .map((operation, index) =>
                operation.type === 'import-schema-and-instances'
                    ? { dataImport: true, index }
                    : { dataImport: false }
            )
            .filter(({ dataImport }) => dataImport);

        const relevantOperations = history.operations.slice(importOperations.at(-1)?.index ?? 0);

        const includeDataTransformations = (operation: UpdateHistoryOperation) =>
            operation.type !== 'transform-schema-and-instances' || include.transformations;
        const includeInitialData = (operation: UpdateHistoryOperation) =>
            operation.type !== 'import-schema-and-instances' || include.importedData;
        const includeDiagramPositions = (operation: UpdateHistoryOperation) =>
            !isDiagramUpdateOperation(operation) || include.diagramPositions;
        const exportedOperations = relevantOperations
            .filter(includeDataTransformations)
            .filter(includeInitialData)
            .filter(includeDiagramPositions)
            .map((operation) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const o = { ...operation } as any;
                delete o.updatedEditor;
                return o;
            });

        const exportData = {
            operations: exportedOperations,
            prefixes: prefixes,
        };

        const file = new File([JSON.stringify(exportData)], 'operations.json', {
            type: 'application/json',
        });
        download(file);
        manualActions.onActionDone();
    };
    const cancel = () => {
        manualActions.onActionDone();
    };

    return (
        <div>
            <Header label='Export Operations'></Header>
            <Dropdown headerLabel='Include' showInitially>
                <div className='mx-2 flex flex-col gap-1'>
                    <label className='p-1 bg-slate-300 rounded'>
                        <input
                            className='p-1 mr-1'
                            type='checkbox'
                            checked={include.transformations}
                            onChange={handleDataTransformationsCheckChange}
                        />
                        Data Transformations
                    </label>
                    <label className='p-1 bg-slate-300 rounded'>
                        <input
                            className='p-1 mr-1'
                            type='checkbox'
                            checked={include.importedData}
                            onChange={handleImportedDataCheckChange}
                        />
                        Imported Data
                    </label>
                    <label className='p-1 bg-slate-300 rounded'>
                        <input
                            className='p-1 mr-1'
                            type='checkbox'
                            checked={include.prefixes}
                            onChange={handlePrefixesCheckChange}
                        />
                        Prefixes
                    </label>
                    <label className='p-1 bg-slate-300 rounded'>
                        <input
                            className='p-1 mr-1'
                            type='checkbox'
                            checked={include.diagramPositions}
                            onChange={handleDiagramPositionsCheckChange}
                        />
                        Diagram Positions
                    </label>
                </div>
            </Dropdown>
            <ActionOkCancel onOk={exportOperations} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
