import { Writer } from 'n3';
import { parseCsv } from '../../core/parse/csv/parse-csv';
import { parseJson } from '../../core/parse/json/parse-json';
import { useEditorContext } from '../editor/editor-context';
import { FileLoader } from '../file/file-loader';
import { FileSaver } from '../file/file-saver';
import { saveAsDataSchema } from '../../core/schema/save/data-schema/save';
import { resetId } from '../../core/utils/identifier-generator';

export function ManualActionsSelect() {
    const {
        diagram: { nodePositioning },
        manualActions,
        schema,
        history,
        addSchemaAndInstances,
    } = useEditorContext();

    const onImport = (file: { content: string; type: string }) => {
        manualActions.onActionDone();
        resetId();
        const { schema, instances } = file.type === 'application/json' ? parseJson(file.content) : parseCsv(file.content);
        addSchemaAndInstances({ schema: schema, instances: instances });
    };

    const onSchemaExport = (download: (file: File) => void) => {
        const writer = new Writer();
        saveAsDataSchema(schema, { defaultEntityUri: 'http://example.com/entity', defaultPropertyUri: 'http://example.com/property' }, writer);
        writer.end((error, result: string) => {
            download(new File([result], 'schema.ttl', { type: 'text/turtle' }));
        });
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
            <FileLoader className='p-2 rounded shadow bg-blue-200' onFileLoad={onImport}>
                Import
            </FileLoader>
            <div className='relative group'>
                <div className='p-2 rounded shadow bg-blue-200'>Export</div>
                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                    <FileSaver className='block p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onFileSave={onSchemaExport}>
                        Schema
                    </FileSaver>
                    <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={manualActions.showExportInstances}>
                        Instances
                    </button>
                </div>
            </div>
        </div>
    );
}
