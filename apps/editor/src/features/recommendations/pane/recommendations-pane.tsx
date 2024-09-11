import { twMerge } from 'tailwind-merge';
import { useEditorContext } from '../../editor/editor-context.tsx';
import { useRecommendationsContext } from '../recommendations-context.tsx';
import { Header } from '../../manual-actions-pane/utils/header.tsx';
import { DiagramRecommendationDiff } from '../diagram-diff/diagram-recommendation-diff.tsx';
import { useState } from 'react';
import { RecommendationDescription } from '../description/recommendation-description.tsx';
import { useErrorBoundary } from 'react-error-boundary';
import { RecommendationsList } from './recommendations-list.tsx';
import { Buffering } from '../../utils/buffering.tsx';

export type RecommendationsPaneProps = {
    className?: string;
};

export type ShowOption = 'description' | 'diff';

export function RecommendationsPane({ className }: RecommendationsPaneProps) {
    const { manualActions, schema } = useEditorContext();

    const {
        showRecommendationDetail,
        selectedRecommendations,
        recommendationsLoadState,
        shownRecommendationDetail,
        getRecommendations,
        hideRecommendationDetail,
    } = useRecommendationsContext();
    const [showOption, setShowOption] = useState<ShowOption>('diff');
    const { showBoundary } = useErrorBoundary();

    return (
        <div className={twMerge('flex', className, shownRecommendationDetail ? 'w-full' : '')}>
            <div className={twMerge('bg-slate-200 flex flex-col gap-1 overflow-y-auto', className)}>
                <Header label='Recommendations'></Header>
                <button
                    className='rounded shadow bg-blue-200 hover:bg-blue-300 p-2 w-96'
                    onClick={() => {
                        try {
                            getRecommendations();
                        } catch (error) {
                            showBoundary(error);
                        }
                    }}
                >
                    Get Recommendations
                </button>
                {(recommendationsLoadState.type === 'loaded' ||
                    (recommendationsLoadState.type === 'loading' &&
                        recommendationsLoadState.recommendationsPresent)) && (
                    <RecommendationsList
                        showOption={showOption}
                        onRecommendationDescriptionClick={(recommendation) => {
                            setShowOption('description');
                            showRecommendationDetail(recommendation).catch((error) =>
                                showBoundary(error)
                            );
                            manualActions.hide();
                        }}
                        onRecommendationDiffClick={(recommendation) => {
                            setShowOption('diff');
                            showRecommendationDetail(recommendation).catch((error) =>
                                showBoundary(error)
                            );
                            manualActions.hide();
                        }}
                    ></RecommendationsList>
                )}
                {recommendationsLoadState.type === 'loading' && (
                    <div>
                        <Buffering className='p-2' alt='Loading recommendations...'></Buffering>
                    </div>
                )}
                {recommendationsLoadState.type === 'no-recommendations-yielded' && (
                    <div className='text-center text-lg'>No suitable recommendations found.</div>
                )}
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
