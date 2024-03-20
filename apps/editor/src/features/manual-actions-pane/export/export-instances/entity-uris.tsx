import { EntitySet } from '@klofan/schema/representation';
import { createUpdateEntitySetUriTransformation } from '@klofan/transform';
import { useEditorContext } from '../../../editor/editor-context';
import { Dropdown } from '../../../utils/dropdown.tsx';
import { validUri } from '../../utils/uri/use-uri-input';
import { UriCard } from './uri-card';
import { useErrorBoundary } from 'react-error-boundary';

export function EntityUris({ className }: { className?: string }) {
    const { schema, updateSchemaAndInstances } = useEditorContext();
    const { showBoundary } = useErrorBoundary();

    const entitySets = schema.entitySets();
    const updateEntityUri = (entity: EntitySet, uri: string) => {
        const uriNotUpdated = (entity.uri === undefined && uri === '') || entity.uri === uri;
        if (!uriNotUpdated) {
            const transformation = createUpdateEntitySetUriTransformation(schema, entity.id, uri);
            updateSchemaAndInstances(transformation).catch((error) => showBoundary(error));
        }
    };

    return (
        <div className={className}>
            <Dropdown headerLabel='Blank Nodes' showInitially>
                <div className='flex gap-1 flex-col'>
                    {entitySets
                        .filter((entity) => !entity.uri)
                        .map((entity) => (
                            <UriCard
                                key={entity.id}
                                id={entity.id}
                                label={entity.name}
                                onChangeDone={(uri: string) => updateEntityUri(entity, uri)}
                                uri={entity.uri}
                            ></UriCard>
                        ))}
                </div>
            </Dropdown>
            <Dropdown headerLabel='Entities With Invalid Uri' showInitially>
                <div className='flex gap-1 flex-col'>
                    {entitySets
                        .filter((entity) => entity.uri)
                        .filter((entity) => !validUri(entity.uri ?? ''))
                        .map((entity) => (
                            <UriCard
                                key={entity.id}
                                id={entity.id}
                                label={entity.name}
                                onChangeDone={(uri: string) => updateEntityUri(entity, uri)}
                                uri={entity.uri}
                            ></UriCard>
                        ))}
                </div>
            </Dropdown>
        </div>
    );
}
