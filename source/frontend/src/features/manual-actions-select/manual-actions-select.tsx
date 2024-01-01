import { Writer } from 'n3';
import { parseCsv } from '../../core/parse/csv/parse-csv';
import { parseJson } from '../../core/parse/json/parse-json';
import { useEditorContext } from '../editor/editor-context';
import { FileLoader } from '../file/file-loader';
import { FileSaver } from '../file/file-saver';
import { saveAsDataSchema } from '../../core/schema/save/data-schema/save';
import { IdentityEntityInstanceUriBuilder } from '../../core/instances/save/uri-builders/identity-instance-uri-builder';
import { save } from '../../core/instances/save/save';
import { resetId } from '../../core/utils/identifier-generator';

export function ManualActionsSelect() {
    const {
        diagram: { nodePositioning },
        manualActions,
        schema,
        history,
        instances,
        addSchemaAndInstances,
    } = useEditorContext();

    const onImport = (file: { content: string; type: string }) => {
        const { schema, instances } = file.type === 'application/json' ? parseJson(file.content) : parseCsv(file.content);
        resetId();
        addSchemaAndInstances({ schema: schema, instances: instances });
    };

    const onSchemaExport = (download: (file: File) => void) => {
        const writer = new Writer();
        saveAsDataSchema(schema, { defaultEntityUri: 'http://example.com/entity', defaultPropertyUri: 'http://example.com/property' }, writer);
        writer.end((error, result: string) => {
            download(new File([result], 'schema.ttl', { type: 'text/turtle' }));
        });
    };

    const onInstancesExport = (download: (file: File) => void) => {
        const writer = new Writer();
        const entityInstanceUriBuilders = Object.fromEntries(
            schema
                .entities()
                .map((entity) => [entity.id, new IdentityEntityInstanceUriBuilder(entity.uri ?? `http://example.com/entity/${entity.name}`)])
        );
        save(
            instances,
            schema,
            { defaultPropertyUri: 'http://example.com/property', entityInstanceUriBuilders: entityInstanceUriBuilders },
            writer
        ).then(() => {
            writer.end((error, result: string) => {
                download(new File([result], 'instances.ttl', { type: 'text/turtle' }));
            });
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

            <FileLoader className='p-2 rounded shadow bg-blue-200' onFileLoad={onImport}>
                Import
            </FileLoader>
            <div className='relative group'>
                <div className='p-2 rounded shadow bg-blue-200'>Export</div>
                <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                    <FileSaver className='block p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onFileSave={onSchemaExport}>
                        Schema
                    </FileSaver>
                    <FileSaver className='block p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onFileSave={onInstancesExport}>
                        Instances
                    </FileSaver>
                </div>
            </div>
        </div>
    );
}
