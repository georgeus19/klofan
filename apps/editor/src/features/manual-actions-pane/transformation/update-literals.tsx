import { useState } from 'react';
import { EntitySet, PropertySet } from '@klofan/schema/representation';
import { useErrorBoundary } from 'react-error-boundary';
import { useEditorContext } from '../../editor/editor-context.tsx';
import { Header } from '../utils/header.tsx';
import { ActionOkCancel } from '../utils/action-ok-cancel.tsx';
import { createUpdatePropertyLiteralsPatternTransformation } from '@klofan/transform';
import { LabelInput } from '../utils/general-label-input/label-input.tsx';
import { twMerge } from 'tailwind-merge';
import { LabelReadonlyInput } from '../utils/general-label-input/label-readonly-input.tsx';
import { useUriInput } from '../utils/uri/use-uri-input.ts';
import { UriLabelInput } from '../utils/uri/uri-label-input.tsx';

export interface UpdateLiteralsShown {
    type: 'update-literals-shown';
}

export interface UpdateLiteralsProps {
    entitySet: EntitySet;
    propertySet: PropertySet;
}

function useLiteralUpdate() {
    const [literalUpdate, setLiteralUpdate] = useState<{
        type: 'pattern' | 'all';
        literalType?: string;
        literalLanguage?: string;
        matchPattern: string;
        replacementPattern: string;
    }>({ type: 'all', matchPattern: '(.*)', replacementPattern: '$1' });

    const updateLanguage = (language: string) => {
        setLiteralUpdate({ ...literalUpdate, literalType: undefined, literalLanguage: language });
    };

    const updateType = (type: string) => {
        setLiteralUpdate({ ...literalUpdate, literalType: type, literalLanguage: undefined });
    };

    const updateMatchPattern = (matchPattern: string) => {
        setLiteralUpdate({ ...literalUpdate, matchPattern: matchPattern });
    };

    const updateReplacementPattern = (replacementPattern: string) => {
        setLiteralUpdate({ ...literalUpdate, replacementPattern: replacementPattern });
    };

    const toPattern = () => {
        setLiteralUpdate({
            ...literalUpdate,
            type: 'pattern',
        });
    };

    const toAll = () => {
        setLiteralUpdate({
            ...literalUpdate,
            type: 'all',
        });
    };

    return {
        literalUpdate,
        toPattern,
        toAll,
        updateLanguage,
        updateType,
        updateMatchPattern,
        updateReplacementPattern,
    };
}

export function UpdateLiterals({ entitySet, propertySet }: UpdateLiteralsProps) {
    const { manualActions, schema, instances, updateSchemaAndInstances, help } = useEditorContext();
    const [error, setError] = useState<string | null>(null);
    const typeUri = useUriInput('');
    const {
        literalUpdate,
        updateLanguage,
        updateType,
        updateMatchPattern,
        updateReplacementPattern,
        toPattern,
        toAll,
    } = useLiteralUpdate();
    const { showBoundary } = useErrorBoundary();

    const updateLiterals = () => {
        const literals =
            literalUpdate.type === 'pattern'
                ? literalUpdate
                : { ...literalUpdate, matchPattern: '(.*)', replacementPattern: '$1' };
        const transformation = createUpdatePropertyLiteralsPatternTransformation({
            entitySet: entitySet,
            literals: literals,
            propertySet: propertySet,
        });
        updateSchemaAndInstances(transformation).catch((error) => showBoundary(error));
        help.hideHelp();
        manualActions.onActionDone();
    };

    const cancel = () => {
        help.hideHelp();
        manualActions.onActionDone();
    };

    return (
        <div>
            <Header label='Update Literals'></Header>
            <LabelReadonlyInput
                label='PropertySet'
                value={`${entitySet.name}.${propertySet.name}`}
            ></LabelReadonlyInput>
            <div className='grid grid-cols-2'>
                <button
                    className={twMerge(
                        'mx-1 rounded shadow bg-blue-200 hover:bg-blue-300 p-1',
                        literalUpdate.type === 'all'
                            ? 'bg-blue-600 hover:bg-blue-600 text-white'
                            : ''
                    )}
                    onClick={() => toAll()}
                >
                    All
                </button>
                <button
                    className={twMerge(
                        'mx-1 rounded shadow bg-blue-200 hover:bg-blue-300 p-1',
                        literalUpdate.type === 'pattern'
                            ? 'bg-blue-600 hover:bg-blue-600 text-white'
                            : ''
                    )}
                    onClick={() => toPattern()}
                >
                    Pattern
                </button>
            </div>
            <div>
                <LabelInput
                    value={literalUpdate.literalLanguage ?? ''}
                    updateValue={(value: string) => {
                        updateLanguage(value);
                        typeUri.updateUri('');
                    }}
                    label='Language'
                    id='a-language'
                ></LabelInput>
                <UriLabelInput
                    label='Type'
                    {...typeUri}
                    onChangeDone={updateType}
                    id='a-type'
                    usePrefix
                ></UriLabelInput>
                {literalUpdate.type === 'pattern' && (
                    <>
                        <LabelInput
                            value={literalUpdate.matchPattern ?? ''}
                            updateValue={updateMatchPattern}
                            label='Match'
                            id='a-match'
                        ></LabelInput>
                        <LabelInput
                            value={literalUpdate.replacementPattern ?? ''}
                            updateValue={updateReplacementPattern}
                            label='Replacement'
                            id='a-replace'
                        ></LabelInput>
                    </>
                )}
            </div>

            <ActionOkCancel onOk={updateLiterals} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
