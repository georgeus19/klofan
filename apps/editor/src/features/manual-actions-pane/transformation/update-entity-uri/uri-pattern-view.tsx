import { EntitySet, getProperties } from '@klofan/schema/representation';
import { Dropdown } from '../../../utils/dropdown.tsx';
import { UriPattern, UriPatternPart } from './use-uri-pattern.ts';
import { Schema } from '@klofan/schema';
import { ChangeInput } from '../../utils/change-input.tsx';
import { ReactNode, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface UriPatternViewProps {
    entitySet: EntitySet;
    uriPattern: UriPattern;
    schema: Schema;
}

export function UriPatternView({
    entitySet,
    uriPattern: {
        uriPattern,
        updateUriPatternPart,
        addUriPatternPart,
        removeUriPatternPart,
        moveUriPatternPart,
    },
    schema,
}: UriPatternViewProps) {
    const [draggingPart, setDraggingPart] = useState<string | null>(null);

    const uriPatternView = entitySet ? (
        uriPattern
            .map((uriPatternPart, partIndex) => {
                if (uriPatternPart.type === 'uri-pattern-property-part') {
                    return {
                        part: uriPatternPart,
                        view: (
                            <>
                                <label htmlFor={`propertySet${partIndex}`} className='col-span-3'>
                                    Property:
                                </label>
                                <select
                                    id={`propertySet${partIndex}`}
                                    defaultValue='Select PropertySet'
                                    onChange={(e) =>
                                        updateUriPatternPart(
                                            {
                                                type: 'uri-pattern-property-part',
                                                propertySet: schema.propertySet(e.target.value),
                                            },
                                            partIndex
                                        )
                                    }
                                    className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200 h-7'
                                >
                                    {getProperties(schema, entitySet.id).map((propertySet) => (
                                        <option
                                            className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300 overflow-auto whitespace-nowrap'
                                            key={propertySet.id}
                                            value={propertySet.id}
                                        >
                                            {propertySet.name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        ),
                    };
                } else {
                    return {
                        part: uriPatternPart,
                        view: (
                            <>
                                <label className='col-span-3' htmlFor={`Text${partIndex}`}>
                                    Text:
                                </label>
                                <ChangeInput
                                    id={`Text${partIndex}`}
                                    value={uriPatternPart.text}
                                    onChange={(value: string) =>
                                        updateUriPatternPart(
                                            { type: 'uri-pattern-text-part', text: value },
                                            partIndex
                                        )
                                    }
                                    onChangeDone={() => {}}
                                    className='col-span-8 rounded bg-transparent border-2 border-slate-400 px-1 focus:bg-yellow-200'
                                ></ChangeInput>
                            </>
                        ),
                    };
                }
            })
            .map(({ view, part }: { view: ReactNode; part: UriPatternPart }, partIndex) => (
                <div
                    draggable
                    onDragStart={() => setDraggingPart(part.id)}
                    onDragEnd={() => setDraggingPart(null)}
                    key={part.id}
                    className={twMerge(
                        'grid grid-cols-12 gap-1 px-3 py-1 bg-slate-300 rounded shadow',
                        part.id === draggingPart ? 'bg-rose-200' : ''
                    )}
                >
                    {view}
                    <button
                        className='col-span-1 rounded shadow bg-blue-200 hover:bg-blue-300'
                        onClick={() => removeUriPatternPart(partIndex)}
                    >
                        X
                    </button>
                </div>
            ))
    ) : (
        <></>
    );

    const findDraggedAfterPart = (y: number) => {
        return uriPattern
            .filter((p) => p.id !== draggingPart)
            .reduce(
                (
                    closest: { offset: number; partId: string | null },
                    childPart,
                    childPartIndex: number
                ) => {
                    const box = [...document.querySelectorAll('#uri-pattern-container > div')][
                        childPartIndex
                    ].getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if (offset < 0 && offset > closest.offset) {
                        return {
                            offset: offset,
                            partId: childPart.id,
                        };
                    } else {
                        return closest;
                    }
                },
                {
                    offset: Number.NEGATIVE_INFINITY,
                    partId: null,
                }
            );
    };

    return (
        <div>
            <Dropdown headerLabel='Uri Pattern' showInitially>
                <div className='mx-2'>
                    <div
                        id='uri-pattern-container'
                        onDragOver={(e) => {
                            if (draggingPart) {
                                const afterPart = findDraggedAfterPart(e.clientY);
                                moveUriPatternPart(draggingPart, afterPart.partId);
                            }
                        }}
                    >
                        {uriPatternView}
                    </div>
                    <button
                        onClick={() =>
                            addUriPatternPart({ type: 'uri-pattern-text-part', text: '' })
                        }
                        className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300 w-full'
                    >
                        Add text
                    </button>
                    <button
                        onClick={() =>
                            addUriPatternPart({
                                type: 'uri-pattern-property-part',
                                propertySet:
                                    entitySet.properties.length > 0
                                        ? schema.propertySet(entitySet.properties[0])
                                        : undefined,
                            })
                        }
                        className='p-1 rounded shadow bg-blue-200 hover:bg-blue-300 w-full'
                    >
                        Add property
                    </button>
                </div>
            </Dropdown>
        </div>
    );
}
