import { Writer } from 'n3';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { Dropdown } from '../../utils/dropdown';
import { Header } from '../../utils/header';
import { EntityUris } from './entity-uris.tsx';
import { PropertyUris } from './property-uris';
import { save } from '@klofan/instances/save';
import { useEditorContext } from '../../../editor/editor-context';
import { useUriInput } from '../../utils/uri/use-uri-input';
import { BlankNodeBuilder, NamedNodeBuilder } from '@klofan/instances/save';
import { EntitySet } from '@klofan/schema/representation';
import { download } from '../download';

export type ExportInstancesShown = {
    type: 'export-instances-shown';
};

export function ExportInstances() {
    const { schema, instances, manualActions } = useEditorContext();
    const defaultPropertyUri = useUriInput('https://example.com/property');

    const exportInstances = () => {
        const writer = new Writer();
        const entityRepresentationBuilders = Object.fromEntries(
            schema
                .entitySets()
                .map((entitySet) => [
                    entitySet.id,
                    entitySet.uri
                        ? new NamedNodeBuilder(entitySet as EntitySet & { uri: string })
                        : new BlankNodeBuilder(entitySet),
                ])
        );
        save(
            instances,
            schema,
            {
                defaultPropertyUri: defaultPropertyUri.asIri(),
                entityRepresentationBuilders: entityRepresentationBuilders,
            },
            writer
        ).then(() => {
            writer.end((error, result: string) => {
                download(new File([result], 'instances.ttl', { type: 'text/turtle' }));
            });
            manualActions.onActionDone();
        });
    };

    const cancel = () => {
        manualActions.onActionDone();
    };
    return (
        <div>
            <Header label='Export Instances'></Header>
            <Dropdown headerLabel='Entity Uris' showInitially>
                <EntityUris className='mx-2'></EntityUris>
            </Dropdown>
            <Dropdown headerLabel='Property Uris' showInitially>
                <PropertyUris
                    className='mx-2'
                    defaultPropertyUri={defaultPropertyUri}
                ></PropertyUris>
            </Dropdown>
            <ActionOkCancel onOk={exportInstances} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
