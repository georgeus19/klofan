import { useDiagramContext } from '../diagram/diagram-context';
import { Header } from '../../manual-actions-pane/utils/header';
import { ReadonlyInput } from '../../manual-actions-pane/utils/general-label-input/readonly-input.tsx';
import { VirtualList } from '../../utils/virtual-list.tsx';
import { toUri } from '../../manual-actions-pane/utils/uri/use-uri-input.ts';
import { usePrefixesContext } from '../../prefixes/prefixes-context.tsx';
import { useEntities } from '../../utils/use-entities.ts';
import { literalView } from '@klofan/instances/representation';

export type ShownDetailProps = {
    height: string;
};

export function LiteralPropertySetDetail({ height }: ShownDetailProps) {
    const {
        diagram: { propertySetSelection },
        schema,
        instances,
    } = useDiagramContext();

    const { matchPrefix } = usePrefixesContext();

    const sourceEntitySet = propertySetSelection.selectedPropertySet?.entitySet ?? null;

    const { entities: sourceEntities } = useEntities(sourceEntitySet, instances);

    if (!propertySetSelection.selectedPropertySet) {
        return <></>;
    }
    const targetIsLiteralSet = schema.hasLiteralSet(
        propertySetSelection.selectedPropertySet.propertySet.value
    );
    if (!targetIsLiteralSet) {
        return <></>;
    }

    return (
        <div className={'bg-slate-200'}>
            <Header
                className='text-lg bg-opacity-70'
                label={`${propertySetSelection.selectedPropertySet.entitySet.name}.${propertySetSelection.selectedPropertySet.propertySet.name}`}
            ></Header>
            <VirtualList items={sourceEntities} height={height}>
                {(entity, entityIndex) => {
                    const sourceEntityUri = toUri(matchPrefix(entity.uri ?? ''), true);

                    return (
                        <div key={entityIndex} className='grid grid-cols-2 mx-2'>
                            <div className='col-start-1 overflow-auto p-2 bg-slate-300 shadow text-center truncate hover:overflow-auto hover:text-clip'>
                                {propertySetSelection.selectedPropertySet!.entitySet.name}.
                                {entityIndex}
                                {sourceEntityUri && ` = <${sourceEntityUri}>`}
                            </div>
                            {entity.properties[
                                propertySetSelection.selectedPropertySet!.propertySet.id
                            ].literals.map((literal, index) => (
                                <div
                                    className='col-start-2 overflow-auto p-2 bg-blue-100 text-center'
                                    key={`L${literal.value}${index}`}
                                >
                                    <ReadonlyInput
                                        value={literalView(literal)}
                                        className='w-full'
                                    ></ReadonlyInput>
                                </div>
                            ))}
                        </div>
                    );
                }}
            </VirtualList>
        </div>
    );
}
