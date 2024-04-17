import { useDiagramContext } from '../diagram/diagram-context';
import { Header } from '../../manual-actions-pane/utils/header';
import { EntityView } from '../../utils/entity-view.tsx';
import { VirtualList } from '../../utils/virtual-list.tsx';
import { useEntities } from '../../utils/use-entities.ts';
import { LabelReadonlyUriInput } from '../../manual-actions-pane/utils/uri/label-readonly-uri-input.tsx';
import { twMerge } from 'tailwind-merge';

export type ShownDetailProps = {
    height: string;
    topHeight: string;
};

export function EntitySetDetail({ height, topHeight }: ShownDetailProps) {
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
        <div className={twMerge('bg-slate-200')}>
            <div className={twMerge('overflow-auto', topHeight)}>
                <Header
                    className='text-lg bg-opacity-70'
                    label={`${selectedEntitySet.name}`}
                ></Header>
                <LabelReadonlyUriInput
                    label='Uri'
                    key={`uri`}
                    uri={selectedEntitySet.uri ?? ''}
                ></LabelReadonlyUriInput>
                <div className='overflow-auto'>
                    {selectedEntitySet.types.map((type, index) => (
                        <LabelReadonlyUriInput
                            label='Type'
                            key={`type${type}${index}`}
                            uri={type ?? ''}
                        ></LabelReadonlyUriInput>
                    ))}
                </div>
            </div>
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
