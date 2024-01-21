import { Writer } from 'n3';
import { parseCsv } from '@klofan/parse';
import { parseJson } from '@klofan/parse';
import { useEditorContext } from '../editor/editor-context';
import { FileLoader } from '../file/file-loader';
import { FileSaver } from '../file/file-saver';
import { saveAsDataSchema } from '@klofan/schema/save';
import { resetId } from '@klofan/utils';
import { Prefix } from '../prefixes/use-prefixes';
import { usePrefixesContext } from '../prefixes/prefixes-context';
import { UpdateOperation } from '../editor/history/update-operation';
import { loadSchema } from '@klofan/schema/load';
import { loadInstances } from '@klofan/instances/load';
import { parse as csvParse } from 'csv-parse/browser/esm/sync';

export function ManualActionsSelect() {
    const {
        diagram: { nodePositioning },
        manualActions,
        schema,
        history,
        addSchemaAndInstances,
        runOperations,
    } = useEditorContext();

    const { addPrefix } = usePrefixesContext();

    const onImport = (file: { content: string; type: string }) => {
        manualActions.onActionDone();
        resetId();
        const tree = file.type === 'application/json' ? parseJson(file.content) : parseCsv(file.content, csvParse);
        addSchemaAndInstances({ schema: loadSchema(tree), instances: loadInstances(tree) });
    };

    const onSchemaExport = (download: (file: File) => void) => {
        const writer = new Writer();
        saveAsDataSchema(schema, { defaultEntityUri: 'http://example.com/entity', defaultPropertyUri: 'http://example.com/property' }, writer);
        writer.end((error, result: string) => {
            download(new File([result], 'schema.ttl', { type: 'text/turtle' }));
        });
    };

    const onImportOperations = (file: { content: string; type: string }) => {
        try {
            manualActions.onActionDone();
            const content: { operations: UpdateOperation[]; prefixes: Prefix[] } = JSON.parse(file.content);
            if (content.operations.find((operation) => operation.type === 'import-schema-and-instances')) {
                resetId();
            }
            for (const prefix of content.prefixes) {
                addPrefix(prefix);
            }
            runOperations(content.operations);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className='flex gap-2'>
            <div className='relative group'>
                <div className='p-2 rounded shadow bg-blue-200'>Auto Layout</div>
                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                    <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={() => nodePositioning.layoutNodesVertically()}>
                        vertical layout
                    </button>
                    <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={() => nodePositioning.layoutNodesHorizontally()}>
                        horizontal layout
                    </button>
                    <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={() => nodePositioning.layoutNodesRadially()}>
                        radial layout
                    </button>
                    <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={() => nodePositioning.layoutNodesUsingForce()}>
                        force layout
                    </button>
                </div>
            </div>

            <div className='relative group'>
                <div className='p-2 rounded shadow bg-blue-200'>Create</div>
                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                    <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={manualActions.showCreateEntity}>
                        entity
                    </button>
                    <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={manualActions.showCreateEntityProperty}>
                        entity property
                    </button>
                    <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={manualActions.showCreateLiteralProperty}>
                        literal property
                    </button>
                </div>
            </div>
            <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={history.undo}>
                Undo
            </button>

            <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={history.redo}>
                Redo
            </button>

            <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={manualActions.showPrefixes}>
                Prefixes
            </button>

            <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={manualActions.showUpdateEntityInstancesUris}>
                Uris
            </button>
            <div className='relative group'>
                <div className='p-2 rounded shadow bg-blue-200'>Import</div>
                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                    <FileLoader name='Data' className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onFileLoad={onImport}></FileLoader>
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
                    <FileSaver className='block p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onFileSave={onSchemaExport}>
                        Schema
                    </FileSaver>
                    <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={manualActions.showExportInstances}>
                        Instances
                    </button>
                    <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={manualActions.showExportOperations}>
                        Transformations
                    </button>
                </div>
            </div>
        </div>
    );
}
