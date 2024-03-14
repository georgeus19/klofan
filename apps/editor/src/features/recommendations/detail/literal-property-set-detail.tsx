import { useDiagramContext } from '../diagram/diagram-context';
import { Header } from '../../manual-actions-pane/utils/header';
import { ReadonlyInput } from '../../manual-actions-pane/utils/general-label-input/readonly-input.tsx';
import { VirtualList } from '../../utils/virtual-list.tsx';
import { useProperties } from '../../utils/use-properties.ts';

export type ShownDetailProps = {
    height: string;
};

export function LiteralPropertySetDetail({ height }: ShownDetailProps) {
    const {
        diagram: { propertySetSelection },
        schema,
        instances,
    } = useDiagramContext();

    const { properties } = useProperties(propertySetSelection.selectedPropertySet, instances);

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
            <VirtualList items={properties} height={height}>
                {(property, entityIndex) => {
                    return (
                        <div key={entityIndex} className='grid grid-cols-2 mx-2'>
                            <div className='col-start-1 overflow-auto p-2 bg-slate-300 shadow text-center'>
                                {propertySetSelection.selectedPropertySet!.entitySet.name}.
                                {entityIndex}
                            </div>
                            {property.literals.map((literal, index) => (
                                <div
                                    className='col-start-2 overflow-auto p-2 bg-blue-100 text-center'
                                    key={`L${literal.value}${index}`}
                                >
                                    <ReadonlyInput
                                        value={literal.value}
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
