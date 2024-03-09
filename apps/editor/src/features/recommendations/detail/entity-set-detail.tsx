import { useEffect, useRef, useState } from 'react';
import { useDiagramContext } from '../diagram/diagram-context';
import { Property } from '@klofan/instances/representation';
import { Header } from '../../manual-actions-pane/utils/header';
import { twMerge } from 'tailwind-merge';
import { Entity } from '@klofan/instances/representation';
import { EntityView } from '../../manual-actions-pane/utils/entity-view.tsx';
import { ViewportList } from 'react-viewport-list';

export type ShownDetailProps = {
    height?: string;
};

export function EntitySetDetail({ height }: ShownDetailProps) {
    const {
        diagram: { propertySetSelection, nodeSelection },
        schema,
        instances,
    } = useDiagramContext();
    const ref = useRef<HTMLDivElement | null>(null);

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
    // const entitiesView = entities.map((entity) => (
    //     <EntityView
    //         key={entity.id}
    //         entitySet={selectedEntitySet}
    //         entity={entity}
    //         showLiteralProperties
    //         showEntityProperties
    //     ></EntityView>
    // ));

    const Row = ({ index }: { index: number }) => (
        <EntityView
            key={entities[index].id}
            entitySet={selectedEntitySet}
            entity={entities[index]}
            schema={schema}
            showLiteralProperties
            showEntityProperties
        ></EntityView>
    );

    return (
        <div className={'bg-slate-200'}>
            <Header className='text-lg bg-opacity-70' label={`${selectedEntitySet.name}`}></Header>
            {/*<div className={twMerge('flex flex-col gap-1 text-center overflow-auto', height)}>*/}
            <div className={twMerge('scroll-container overflow-auto h-60')} ref={ref}>
                <ViewportList viewportRef={ref} items={entities}>
                    {(entity) => (
                        <EntityView
                            key={entity.id}
                            entitySet={selectedEntitySet}
                            entity={entity}
                            schema={schema}
                            showLiteralProperties
                            showEntityProperties
                        ></EntityView>
                    )}
                </ViewportList>
            </div>
        </div>
    );
}
// <div className={twMerge('', height)}>
//     {/*<AutoSizer>*/}
//     {/*    {({ height, width }) => (*/}
//     {/*        <List*/}
//     {/*            height={height}*/}
//     {/*            rowCount={entities.length}*/}
//     {/*            rowHeight={20}*/}
//     {/*            rowRenderer={Row}*/}
//     {/*            width={width}*/}
//     {/*        />*/}
//     {/*    )}*/}
//     {/*</AutoSizer>*/}
//     <List itemSize={40} height={100} itemCount={entities.length} width='100%'>
//         {Row}
//     </List>
//     {/*{entitiesView}*/}
//     {/*    {propertiesView}*/}
// </div>
