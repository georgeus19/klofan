import { useEffect, useState } from 'react';
import { useDiagramContext } from '../diagram/diagram-context';
import { Property } from '@klofan/instances/representation';
import { Header } from '../../manual-actions-pane/utils/header';
import { twMerge } from 'tailwind-merge';
import { Entity } from '@klofan/instances/representation';
import { EntityView } from '../../manual-actions-pane/utils/entity-view.tsx';

export type ShownDetailProps = {
    height?: string;
};

export function EntitySetDetail({ height }: ShownDetailProps) {
    const {
        diagram: { propertySetSelection, nodeSelection },
        instances,
    } = useDiagramContext();

    const [entities, setEntities] = useState<Entity[]>([]);

    useEffect(() => {
        const selectedEntitySet = nodeSelection.selectedNode?.data;
        if (selectedEntitySet) {
            instances.entities(selectedEntitySet).then((entities) => setEntities(entities));
        }
    }, [nodeSelection.selectedNode]);
    const selectedEntitySet = nodeSelection.selectedNode?.data;

    if (!selectedEntitySet) {
        return <></>;
    }

    // const propertiesView = entities.map((property, entityIndex) => (
    //     <div className='grid grid-cols-12 p-2 bg-slate-400 bg-opacity-60' key={entityIndex}>
    //         <div className='col-start-5'>Entity.{entityIndex}:</div>
    //         {property.literals.map((literal, index) => (
    //             <div className='col-start-7 col-span-6' key={index}>
    //                 "{literal.value}"
    //             </div>
    //         ))}
    //     </div>
    // ));
    const entitiesView = entities.map((entity) => (
        <EntityView
            key={entity.id}
            entitySet={selectedEntitySet}
            entity={entity}
            showLiteralProperties
            showEntityProperties
        ></EntityView>
    ));
    return (
        <div className={'bg-slate-200'}>
            <Header className='text-lg bg-opacity-70' label={`${selectedEntitySet.name}`}></Header>
            <div className={twMerge('flex flex-col gap-1 text-center overflow-auto', height)}>
                {entitiesView}
                {/*    {propertiesView}*/}
            </div>
        </div>
    );
}
