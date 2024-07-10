import { useRecommendationsContext } from '../recommendations-context.tsx';
import { ShowOption } from './recommendations-pane.tsx';
import { IdentifiableRecommendation } from '@klofan/recommender/recommendation';
import { twMerge } from 'tailwind-merge';
import { VirtualList } from '../../utils/virtual-list.tsx';
import { useEditorContext } from '../../editor/editor-context.tsx';
import { useErrorBoundary } from 'react-error-boundary';
import { Divider } from '../../utils/divider.tsx';

export type RecommendationsListProps = {
    showOption: ShowOption;
    onRecommendationDescriptionClick: (recommendation: IdentifiableRecommendation) => void;
    onRecommendationDiffClick: (recommendation: IdentifiableRecommendation) => void;
};
export function RecommendationsList({
    showOption,
    onRecommendationDescriptionClick,
    onRecommendationDiffClick,
}: RecommendationsListProps) {
    const { schema } = useEditorContext();
    const { showBoundary } = useErrorBoundary();

    const {
        selectedRecommendations,
        categories,
        selectCategory,
        applyRecommendation,
        shownRecommendationDetail,
    } = useRecommendationsContext();
    const recommendationsList = (recommendation: IdentifiableRecommendation) => {
        return (
            <div
                key={recommendation.id}
                className='grid grid-cols-12 gap-1 rounded p-1 bg-slate-200 mx-2 my-2 text-lg'
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
                    <div>Area</div>
                    <div>{recommendation.area}</div>
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
                            shownRecommendationDetail.recommendation.id === recommendation.id &&
                            showOption === 'description'
                            ? 'bg-yellow-200 hover:bg-yellow-200'
                            : ''
                    )}
                    onClick={() => onRecommendationDescriptionClick(recommendation)}
                >
                    Description
                </button>
                <button
                    className={twMerge(
                        'col-span-4 rounded shadow bg-blue-200 hover:bg-blue-300 p-1',
                        shownRecommendationDetail &&
                            shownRecommendationDetail.recommendation.id === recommendation.id &&
                            showOption === 'diff'
                            ? 'bg-yellow-200 hover:bg-yellow-200'
                            : ''
                    )}
                    onClick={() => onRecommendationDiffClick(recommendation)}
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
        <>
            <div className='m-1 rounded bg-slate-300'>
                <div className='grid grid-cols-4'>
                    <div className='rounded text-center text-lg p-1'>Category</div>
                    <select
                        defaultValue='Select category...'
                        onChange={(e) =>
                            selectCategory(
                                categories.find((c) => c.name === e.target.value) ?? categories[0]
                            )
                        }
                        className='col-span-3 rounded bg-blue-200 rounded shadow bg-blue-200 hover:bg-blue-300 border-2 border-slate-400 px-1 focus:bg-yellow-200 h-10 w-full text-center text-lg'
                    >
                        {categories.map((category) => (
                            <option
                                className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300 overflow-auto whitespace-nowrap text-center'
                                key={category.name}
                                value={category.name}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='flex items-center mt-1'>
                    <div className='w-5'></div>
                    <div className='flex-grow border-t border-y-2 rounded border-gray-400'></div>
                    <div className='w-5'></div>
                </div>
                <VirtualList items={selectedRecommendations.recommendations} height='max-h-160'>
                    {(recommendation: IdentifiableRecommendation) =>
                        recommendationsList(recommendation)
                    }
                </VirtualList>
            </div>
        </>
    );
}
