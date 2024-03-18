import { twMerge } from 'tailwind-merge';
import { useEditorContext } from '../editor/editor-context';
import { Dropdown } from '../utils/dropdown.tsx';
import { useRecommendationsContext } from './recommendations-context';
import { Header } from '../manual-actions-pane/utils/header';
import { DiagramRecommendationDiff } from './diagram-recommendation-diff.tsx';
import { useState } from 'react';
import { RecommendationDescription } from './recommendation-description.tsx';

export type RecommendationsPaneProps = {
    className?: string;
};

export type ShowOption = 'description' | 'diff';

export function RecommendationsPane({ className }: RecommendationsPaneProps) {
    const { manualActions } = useEditorContext();
    const {
        recommendations,
        showRecommendationDetail,
        applyRecommendation,
        shownRecommendationDetail,
        getRecommendations,
        hideRecommendationDetail,
    } = useRecommendationsContext();
    const [showOption, setShowOption] = useState<ShowOption>('diff');

    const recommendationsList = recommendations.map((recommendation, index) => (
        <div key={index} className='grid grid-cols-12 gap-1 rounded p-1 bg-slate-500 mx-2'>
            <div className='col-span-6'>
                Category:{' '}
                <span className='text-white rounded p-1  '>{recommendation.category}</span>
            </div>
            <button
                className={twMerge(
                    'col-start-1 col-span-4 rounded shadow bg-blue-200 hover:bg-blue-300 p-2',
                    shownRecommendationDetail &&
                        shownRecommendationDetail.recommendationIndex === index &&
                        showOption === 'description'
                        ? 'bg-yellow-200 hover:bg-yellow-200'
                        : ''
                )}
                onClick={() => {
                    setShowOption('description');
                    showRecommendationDetail(recommendation, index);
                    manualActions.hide();
                }}
            >
                Description
            </button>
            <button
                className={twMerge(
                    'col-span-4 rounded shadow bg-blue-200 hover:bg-blue-300 p-2',
                    shownRecommendationDetail &&
                        shownRecommendationDetail.recommendationIndex === index &&
                        showOption === 'diff'
                        ? 'bg-yellow-200 hover:bg-yellow-200'
                        : ''
                )}
                onClick={() => {
                    setShowOption('diff');
                    showRecommendationDetail(recommendation, index);
                    manualActions.hide();
                }}
            >
                Diff
            </button>
            <button
                className='col-span-4 rounded shadow bg-blue-200 hover:bg-blue-300 p-2'
                onClick={() => applyRecommendation(recommendation)}
            >
                Accept
            </button>
        </div>
    ));

    return (
        <div className={twMerge('flex', className, shownRecommendationDetail ? 'w-full' : '')}>
            <div className={twMerge('bg-slate-300 flex flex-col gap-1')}>
                <Header label='Recommendations'></Header>
                <button
                    className='rounded shadow bg-blue-200 hover:bg-blue-300 p-2 w-96'
                    onClick={getRecommendations}
                >
                    Get Recommendations
                </button>
                <Dropdown headerLabel='Expert' className='my-0' showInitially>
                    {recommendationsList}
                </Dropdown>
                <Dropdown headerLabel='General' className='my-0' showInitially>
                    <></>
                </Dropdown>
            </div>
            {shownRecommendationDetail && (
                <div className='w-full relative grid grid-cols-2'>
                    <button
                        className='rounded shadow bg-blue-200 hover:bg-blue-300 p-2 z-50 fixed top-1/2 -translate-x-1/2  translate-y-1/2'
                        onClick={hideRecommendationDetail}
                    >
                        Cancel
                    </button>
                    {showOption === 'diff' && (
                        <DiagramRecommendationDiff
                            shownRecommendationDetail={shownRecommendationDetail}
                        ></DiagramRecommendationDiff>
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
