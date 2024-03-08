import { useEffect, useState } from 'react';
import { useEditorContext } from '../editor/editor-context';
import { twMerge } from 'tailwind-merge';
import { RawInstances } from '@klofan/instances/representation';
import { Dropdown } from '../manual-actions-pane/utils/dropdown';
import { createUpdatePropertyLiteralsValueTransformation } from '@klofan/transform';

export type RecommendationsProps = {
    className?: string;
};

export function OldRecommendations({ className }: RecommendationsProps) {
    const [changeInstances, setChangedInstances] = useState<RawInstances>({
        entities: {},
        properties: {},
    });
    const [recommended, setRecommended] = useState<boolean>(false);
    const [hide, setHide] = useState<boolean>(false);

    const [showChanges, setShowChanges] = useState<boolean>(false);

    const { schema, instances, updateSchemaAndInstances, manualActions } = useEditorContext();

    // const originalRawInstances: RawInstances = instances.raw() as RawInstances;
    function favPlaceLiterals(oldRawInstances: RawInstances, newRawInstances: RawInstances) {
        if (recommended) {
            const propertyInstanceId = '2.6-fav-place';
            const oo = oldRawInstances.properties[propertyInstanceId].flatMap((property) => {
                return property.literals.map((literal) => (
                    <div className='p-1 text-center bg-blue-300 col-span-4'>{literal.value}</div>
                ));
            });
            const nn = newRawInstances.properties[propertyInstanceId].flatMap((property) => {
                return property.literals.map((literal) => (
                    <div className='p-1 text-center bg-blue-300 col-span-7'>{literal.value}</div>
                ));
            });
            return [
                oo[0],
                <div className='py-6'>TO</div>,
                nn[0],
                oo[1],
                <div className='py-6'>TO</div>,
                nn[1],
            ];
            // return (
            //     <div className='flex flex-col gap-2'>
            //         {oldRawInstances.propertyInstances[propertyInstanceId].flatMap((property) => {
            //             return property.literals.map((literal) => <div className='p-1 text-center bg-blue-300'>{literal.value}</div>);
            //         })}
            //     </div>
            // );
        }
        return <div></div>;
    }

    function accept() {
        const productEntity = schema.entitySets().find((entity) => entity.name === 'product');
        const countriesProperty = schema
            .propertySets()
            .find((property) => property.name === 'countries');
        if (productEntity && countriesProperty) {
            const transformation = createUpdatePropertyLiteralsValueTransformation({
                entitySet: productEntity,
                propertySet: countriesProperty,
                literals: {
                    from: { value: 'United States' },
                    to: { value: 'http://publications.europa.eu/resource/authority/country/USA' },
                },
            });
            updateSchemaAndInstances(transformation).then(() => {
                setHide(true);
            });
        }
    }

    function getData() {
        const url = 'http://localhost:3000/api/v1/recommender/recommend';
        const fetchOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                schema: schema.raw(),
                instances: instances.raw(),
            }),
        };
        console.log(fetchOptions);

        fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setRecommended(true);
                setChangedInstances(data);
            });
    }

    const product = schema.entitySets().find((entity) => entity.name === 'product');
    let changes = null;
    if (product) {
        changes = (
            <div>
                <div className='grid grid-cols-2 max-w-screen-2xl m-auto gap-3'>
                    <div className='col-span-2 bg-slate-500 text-white border-2 rounded p-2 text-xl border-slate-600 my-1 text-center'>
                        product.countries
                    </div>
                    <div className='text-center bg-slate-200 p-2 font-bold'>Original Values</div>
                    <div className='text-center bg-slate-200 p-2 font-bold'>New Values</div>
                    <div className='text-center'>"United States"</div>
                    <div className='text-center'>
                        &lt;http://publications.europa.eu/resource/authority/country/USA&gt;
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={twMerge(
                'bg-slate-300 flex flex-col',
                className,
                showChanges && 'w-full',
                hide && 'hidden'
            )}
        >
            <Dropdown headerLabel='CodeList recommendation' showInitially>
                <button
                    className='rounded shadow bg-blue-200 hover:bg-blue-300 p-2'
                    onClick={() => {
                        setShowChanges(!showChanges);
                        manualActions.hide();
                    }}
                >
                    {!showChanges ? 'Proposed Changes' : 'Back'}
                </button>
                {showChanges && changes}

                {/* {recommended && (
                    <Dropdown className='mx-2' headerLabel='a.fav-place' showInitially>
                        <div className='grid grid-cols-12 mx-2 gap-1'>{favPlaceLiterals(instances.raw() as RawInstances, changeInstances)}</div>
                    </Dropdown>
                )} */}
                <button
                    className='rounded shadow bg-blue-200 hover:bg-blue-300 p-2'
                    onClick={accept}
                >
                    Accept
                </button>
            </Dropdown>
        </div>
    );
}
