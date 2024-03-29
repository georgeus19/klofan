import { useDiagramContext } from '../diagram/diagram-context';
import { Header } from '../../manual-actions-pane/utils/header';
import { EntityView } from '../../utils/entity-view.tsx';
import { VirtualList } from '../../utils/virtual-list.tsx';
import { useEntities } from '../../utils/use-entities.ts';
import { LabelReadonlyUriInput } from '../../manual-actions-pane/utils/uri/label-readonly-uri-input.tsx';

export type ShownDetailProps = {
    height: string;
};

export function EntitySetDetail({ height }: ShownDetailProps) {
    const {
        diagram: { nodeSelection },
        schema,
        instances,
    } = useDiagramContext();

    const { entities } = useEntities(nodeSelection.selectedNode?.data ?? null, instances);
    const selectedEntitySet = nodeSelection.selectedNode?.data;

    if (!selectedEntitySet) {
        return <></>;
    }
    return (
        <div className={'bg-slate-200'}>
            <Header className='text-lg bg-opacity-70' label={`${selectedEntitySet.name}`}></Header>
            <LabelReadonlyUriInput
                label='Uri'
                key={`uri`}
                uri={selectedEntitySet.uri ?? ''}
            ></LabelReadonlyUriInput>
            {selectedEntitySet.types.map((type, index) => (
                <LabelReadonlyUriInput
                    label='Type'
                    key={`type${type}${index}`}
                    uri={type ?? ''}
                ></LabelReadonlyUriInput>
            ))}
            <VirtualList items={entities} height={height}>
                {(entity) => (
                    <EntityView
                        key={entity.id}
                        entitySet={selectedEntitySet}
                        entity={entity}
                        schema={schema}
                        showLiteralProperties
                        showEntityProperties
                        expanded
                    ></EntityView>
                )}
            </VirtualList>
        </div>
    );
}
