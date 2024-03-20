import { Writer } from 'n3';
import { parseCsv } from '@klofan/parse';
import { parseJson } from '@klofan/parse';
import { useEditorContext } from '../editor/editor-context';
import { FileLoader } from '../file/file-loader';
import { FileSaver } from '../file/file-saver';
import { saveAsDataSchema } from '@klofan/schema/save';
import { Prefix } from '../prefixes/use-prefixes';
import { usePrefixesContext } from '../prefixes/prefixes-context';
import { UpdateHistoryOperation } from '../editor/history/update-history-operation.ts';
import { loadSchema } from '@klofan/schema/load';
import { loadInstances } from '@klofan/instances/load';
import { parse as csvParse } from 'csv-parse/browser/esm/sync';
import { twMerge } from 'tailwind-merge';
import { useRecommendationsContext } from '../recommendations/recommendations-context.tsx';
import { useErrorBoundary } from 'react-error-boundary';

export interface ManualActionsSelectProps {
    className?: string;
}

export function ManualActionsSelect({ className }: ManualActionsSelectProps) {
    const {
        diagram: { nodePositioning },
        manualActions,
        schema,
        history,
        addSchemaAndInstances,
        runOperations,
    } = useEditorContext();

    const { showBoundary } = useErrorBoundary();

    const { shownRecommendationDetail } = useRecommendationsContext();

    const { addPrefix } = usePrefixesContext();

    const onImport = (file: { content: string; type: string }) => {
        try {
            manualActions.onActionDone();
            const tree =
                file.type === 'application/json'
                    ? parseJson(file.content)
                    : parseCsv(file.content, csvParse);
            addSchemaAndInstances({ schema: loadSchema(tree), instances: loadInstances(tree) });
        } catch (error) {
            showBoundary(error);
        }
    };

    const onSchemaExport = (download: (file: File) => void) => {
        const writer = new Writer();
        saveAsDataSchema(
            schema,
            {
                defaultEntitySetUri: 'http://example.com/entity',
                defaultPropertySetUri: 'http://example.com/property',
            },
            writer
        );
        writer.end((error, result: string) => {
            download(new File([result], 'schema.ttl', { type: 'text/turtle' }));
        });
    };

    const onImportOperations = (file: { content: string; type: string }) => {
        try {
            manualActions.onActionDone();
            const content: { operations: UpdateHistoryOperation[]; prefixes: Prefix[] } =
                JSON.parse(file.content);
            for (const prefix of content.prefixes) {
                addPrefix(prefix);
            }
            runOperations(content.operations).catch((error) => showBoundary(error));
        } catch (e) {
            console.log(e);
        }
    };

    if (shownRecommendationDetail) {
        return <></>;
    }

    return (
        <div className={twMerge('grid grid-cols-8 gap-2 m-auto text-center', className)}>
            <div className='relative group'>
                <div className='p-2 rounded shadow bg-blue-200'>Auto Layout</div>
                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                    <button
                        className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onClick={() => nodePositioning.layoutNodesVertically()}
                    >
                        vertical layout
                    </button>
                    <button
                        className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onClick={() => nodePositioning.layoutNodesHorizontally()}
                    >
                        horizontal layout
                    </button>
                    <button
                        className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onClick={() => nodePositioning.layoutNodesRadially()}
                    >
                        radial layout
                    </button>
                    <button
                        className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onClick={() => nodePositioning.layoutNodesUsingForce()}
                    >
                        force layout
                    </button>
                </div>
            </div>

            <div className='relative group'>
                <div className='p-2 rounded shadow bg-blue-200'>Create</div>
                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                    <button
                        className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onClick={manualActions.showCreateEntitySet}
                    >
                        entity
                    </button>
                    <button
                        className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onClick={manualActions.showCreateEntityPropertySet}
                    >
                        entity property
                    </button>
                    <button
                        className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onClick={manualActions.showCreateLiteralPropertySet}
                    >
                        literal property
                    </button>
                </div>
            </div>
            <button
                className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                onClick={history.undo}
            >
                Undo
            </button>

            <button
                className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                onClick={history.redo}
            >
                Redo
            </button>

            <button
                className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                onClick={manualActions.showPrefixes}
            >
                Prefixes
            </button>

            <button
                className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                onClick={manualActions.showUpdateEntitiesUris}
            >
                Uris
            </button>
            <div className='relative group'>
                <div className='p-2 rounded shadow bg-blue-200'>Import</div>
                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                    <FileLoader
                        name='Data'
                        className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onFileLoad={onImport}
                    ></FileLoader>
                    <FileLoader
                        name='Operations'
                        className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onFileLoad={onImportOperations}
                    ></FileLoader>
                </div>
            </div>

            <div className='relative group'>
                <div className='p-2 rounded shadow bg-blue-200'>Export</div>
                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                    <FileSaver
                        className='block p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onFileSave={onSchemaExport}
                    >
                        Schema
                    </FileSaver>
                    <button
                        className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onClick={manualActions.showExportInstances}
                    >
                        Instances
                    </button>
                    <button
                        className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onClick={manualActions.showExportOperations}
                    >
                        Transformations
                    </button>
                </div>
            </div>
        </div>
    );
}
