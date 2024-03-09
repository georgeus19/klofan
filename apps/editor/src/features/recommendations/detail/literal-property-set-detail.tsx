import { useEffect, useState } from 'react';
import { useDiagramContext } from '../diagram/diagram-context';
import { Property } from '@klofan/instances/representation';
import { Header } from '../../manual-actions-pane/utils/header';
import { twMerge } from 'tailwind-merge';

export type ShownDetailProps = {
    height?: string;
};

export function LiteralPropertySetDetail({ height }: ShownDetailProps) {
    const {
        diagram: { propertySetSelection },
        instances,
    } = useDiagramContext();

    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        if (propertySetSelection.selectedPropertySet) {
            instances
                .properties(
                    propertySetSelection.selectedPropertySet.entitySet.id,
                    propertySetSelection.selectedPropertySet.propertySet.id
                )
                .then((propertis) => setProperties(propertis));
        }
    }, [propertySetSelection.selectedPropertySet]);

    if (!propertySetSelection.selectedPropertySet) {
        return <></>;
    }

    const propertiesView = properties.map((property, entityIndex) => (
        <div className='grid grid-cols-12 p-2 bg-slate-400 bg-opacity-60' key={entityIndex}>
            <div className='col-start-5'>Entity.{entityIndex}:</div>
            {property.literals.map((literal, index) => (
                <div className='col-start-7 col-span-6' key={index}>
                    "{literal.value}"
                </div>
            ))}
        </div>
    ));
    return (
        <div className={'bg-slate-200'}>
            <Header
                className='text-lg bg-opacity-70'
                label={`${propertySetSelection.selectedPropertySet.entitySet.name}.${propertySetSelection.selectedPropertySet.propertySet.name}`}
            ></Header>
            <div className={twMerge('flex flex-col gap-1 text-center overflow-auto', height)}>
                {propertiesView}
            </div>
        </div>
    );
}
