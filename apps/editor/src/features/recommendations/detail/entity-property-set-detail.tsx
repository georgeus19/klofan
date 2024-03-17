import { useDiagramContext } from '../diagram/diagram-context';
import { Header } from '../../manual-actions-pane/utils/header';
import { ReadonlyInput } from '../../manual-actions-pane/utils/general-label-input/readonly-input.tsx';
import { VirtualList } from '../../utils/virtual-list.tsx';
import { usePrefixesContext } from '../../prefixes/prefixes-context.tsx';
import { useEntities } from '../../utils/use-entities.ts';
import { toUri } from '../../manual-actions-pane/utils/uri/use-uri-input.ts';

export type ShownDetailProps = {
    height: string;
};

export function EntityPropertySetDetail({ height }: ShownDetailProps) {
    const {
        diagram: { propertySetSelection },
        schema,
        instances,
    } = useDiagramContext();

    const { matchPrefix } = usePrefixesContext();

    const sourceEntitySet = propertySetSelection.selectedPropertySet?.entitySet ?? null;
    const { entities: sourceEntities } = useEntities(sourceEntitySet, instances);
    const targetIsEntitySet = schema.hasEntitySet(
        propertySetSelection.selectedPropertySet?.propertySet.value ?? ''
    );

    const targetEntitySet =
        propertySetSelection.selectedPropertySet && targetIsEntitySet
            ? schema.entitySet(propertySetSelection.selectedPropertySet.propertySet.value)
            : null;
    const { entities: targetEntities } = useEntities(targetEntitySet, instances);

    if (!propertySetSelection.selectedPropertySet) {
        return <></>;
    }
    if (!targetIsEntitySet) {
        return <></>;
    }

    return (
        <div className={'bg-slate-200'}>
            <Header
                className='text-lg bg-opacity-70'
                label={`${propertySetSelection.selectedPropertySet.entitySet.name}.${propertySetSelection.selectedPropertySet.propertySet.name}`}
            ></Header>
            <VirtualList items={sourceEntities} height={height}>
                {(entity) => {
                    const sourceEntityUri = toUri(matchPrefix(entity.uri ?? ''), true);
                    return (
                        <div key={entity.id} className='grid grid-cols-2 mx-2'>
                            <div className='col-start-1 p-2 bg-slate-300 shadow text-center truncate hover:overflow-auto hover:text-clip'>
                                {propertySetSelection.selectedPropertySet!.entitySet.name}.
                                {entity.id}
                                {sourceEntityUri && ` = <${sourceEntityUri}>`}
                            </div>
                            {entity.properties[
                                propertySetSelection.selectedPropertySet!.propertySet.id
                            ].targetEntities.map((targetEntityIndex, index) => {
                                const targetEntityUri = toUri(
                                    matchPrefix(targetEntities.at(targetEntityIndex)?.uri ?? ''),
                                    true
                                );
                                const uriAddition = targetEntityUri
                                    ? ` = <${targetEntityUri}>`
                                    : '';
                                return (
                                    <div
                                        className='col-start-2 overflow-auto p-2 bg-purple-100 text-center shadow'
                                        key={`E${index}`}
                                    >
                                        <ReadonlyInput
                                            value={`${schema.entitySet(propertySetSelection.selectedPropertySet!.propertySet.value).name}.${targetEntityIndex}${uriAddition}`}
                                            className='w-full'
                                        ></ReadonlyInput>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }}
            </VirtualList>
        </div>
    );
}
