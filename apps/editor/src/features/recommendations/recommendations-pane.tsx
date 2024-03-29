import { twMerge } from 'tailwind-merge';
import { useEditorContext } from '../editor/editor-context';
import { Dropdown } from '../utils/dropdown.tsx';
import { useRecommendationsContext } from './recommendations-context';
import { Header } from '../manual-actions-pane/utils/header';
import { DiagramRecommendationDiff } from './diagram-recommendation-diff.tsx';
import { useState } from 'react';
import { RecommendationDescription } from './recommendation-description.tsx';
import { useErrorBoundary } from 'react-error-boundary';
import { Recommendation } from '@klofan/recommender/recommendation';
import { toUri } from '../manual-actions-pane/utils/uri/use-uri-input.ts';
import { ReadonlyInput } from '../manual-actions-pane/utils/general-label-input/readonly-input.tsx';
import { VirtualList } from '../utils/virtual-list.tsx';

export type RecommendationsPaneProps = {
    className?: string;
};

export type ShowOption = 'description' | 'diff';

export function RecommendationsPane({ className }: RecommendationsPaneProps) {
    const { manualActions, schema } = useEditorContext();
    const [toggle, setToggle] = useState<{ type: 'Expert' } | { type: 'General' }>({
        type: 'Expert',
    });

    const {
        recommendations,
        showRecommendationDetail,
        applyRecommendation,
        shownRecommendationDetail,
        getRecommendations,
        hideRecommendationDetail,
    } = useRecommendationsContext();
    const [showOption, setShowOption] = useState<ShowOption>('diff');
    const { showBoundary } = useErrorBoundary();

    const recommendationsList = (recommendation: Recommendation, index: number) => {
        if (recommendation.recommenderType !== toggle.type) {
            return <></>;
        }
        return (
            <div
                key={index}
                className='grid grid-cols-12 gap-1 rounded p-1 bg-slate-400 mx-2 my-1 text-lg'
            >
                <div className='col-span-12 row-span-2 grid grid-cols-2'>
                    {schema.hasItem(recommendation.mainSchemaMatch ?? '') ? (
                        <>
                            <div>About Entity</div>
                            <div>{schema.item(recommendation.mainSchemaMatch ?? '').name}</div>
                        </>
                    ) : (
                        <></>
                    )}
                    {schema.hasRelation(recommendation.mainSchemaMatch ?? '') ? (
                        <>
                            <div>About Property</div>
                            <div>{schema.relation(recommendation.mainSchemaMatch ?? '').name}</div>
                        </>
                    ) : (
                        <></>
                    )}
                    <div>Category</div>
                    <div>{recommendation.category}</div>
                    {recommendation.score && (
                        <>
                            <div>Score</div> <div>{recommendation.score.toFixed(0)}</div>
                        </>
                    )}
                </div>
                <button
                    className={twMerge(
                        'col-start-1 col-span-4 rounded shadow bg-blue-200 hover:bg-blue-300 p-1',
                        shownRecommendationDetail &&
                            shownRecommendationDetail.recommendationIndex === index &&
                            showOption === 'description'
                            ? 'bg-yellow-200 hover:bg-yellow-200'
                            : ''
                    )}
                    onClick={() => {
                        setShowOption('description');
                        showRecommendationDetail(recommendation, index).catch((error) =>
                            showBoundary(error)
                        );
                        manualActions.hide();
                    }}
                >
                    Description
                </button>
                <button
                    className={twMerge(
                        'col-span-4 rounded shadow bg-blue-200 hover:bg-blue-300 p-1',
                        shownRecommendationDetail &&
                            shownRecommendationDetail.recommendationIndex === index &&
                            showOption === 'diff'
                            ? 'bg-yellow-200 hover:bg-yellow-200'
                            : ''
                    )}
                    onClick={() => {
                        setShowOption('diff');
                        showRecommendationDetail(recommendation, index).catch((error) =>
                            showBoundary(error)
                        );
                        manualActions.hide();
                    }}
                >
                    Diff
                </button>
                <button
                    className='col-span-4 rounded shadow bg-blue-200 hover:bg-blue-300 p-1'
                    onClick={() =>
                        applyRecommendation(recommendation).catch((error) => showBoundary(error))
                    }
                >
                    Accept
                </button>
            </div>
        );
    };

    return (
        <div className={twMerge('flex', className, shownRecommendationDetail ? 'w-full' : '')}>
            <div className={twMerge('bg-slate-300 flex flex-col gap-1 overflow-y-auto', className)}>
                <Header label='Recommendations'></Header>
                <button
                    className='rounded shadow bg-blue-200 hover:bg-blue-300 p-2 w-96'
                    onClick={() => getRecommendations().catch((error) => showBoundary(error))}
                >
                    Get Recommendations
                </button>
                <div className='grid grid-cols-2'>
                    <button
                        className={twMerge(
                            'mx-1 rounded shadow bg-blue-200 hover:bg-blue-300 p-1',
                            toggle.type === 'Expert' ? 'bg-blue-400 hover:bg-blue-400' : ''
                        )}
                        onClick={() => setToggle({ type: 'Expert' })}
                    >
                        Expert
                    </button>
                    <button
                        className={twMerge(
                            'mx-1 rounded shadow bg-blue-200 hover:bg-blue-300 p-1',
                            toggle.type === 'General' ? 'bg-blue-400 hover:bg-blue-400' : ''
                        )}
                        onClick={() => setToggle({ type: 'General' })}
                    >
                        General
                    </button>
                </div>
                <VirtualList items={recommendations} height='max-h-160'>
                    {(recommendation: Recommendation, index) =>
                        recommendationsList(recommendation, index)
                    }
                </VirtualList>
            </div>
            {shownRecommendationDetail && (
                <div className='grow relative grid grid-cols-1'>
                    <button
                        className='rounded shadow bg-blue-200 hover:bg-blue-300 p-2 z-50 fixed top-1/2 -translate-x-1/2  translate-y-1/2'
                        onClick={hideRecommendationDetail}
                    >
                        Cancel
                    </button>
                    {showOption === 'diff' && (
                        <div className='w-full relative grid grid-cols-2'>
                            <DiagramRecommendationDiff
                                shownRecommendationDetail={shownRecommendationDetail}
                            ></DiagramRecommendationDiff>
                        </div>
                    )}
                    {showOption === 'description' && (
                        <RecommendationDescription
                            recommendation={shownRecommendationDetail.recommendation}
                        ></RecommendationDescription>
                    )}
                </div>
            )}
        </div>
    );
}
