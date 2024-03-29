import { Recommendation } from '@klofan/recommender/recommendation';
import { Dropdown } from '../utils/dropdown.tsx';

export interface RecommendationDescriptionProps {
    recommendation: Recommendation;
}

export function RecommendationDescription({ recommendation }: RecommendationDescriptionProps) {
    return (
        <div className='absolute top-0 bottom-0 left-0 right-0 grid grid-cols-12 grid-rows-12 bg-slate-200'>
            <div className='col-start-3 col-span-8 rounded p-2 row-start-2 row-span-9 bg-slate-300 flex flex-col overflow-auto'>
                <h1 className='text-xl self-center'>Category: {recommendation.category}</h1>
                <Dropdown headerLabel='Description' showInitially>
                    <p className='mx-2'>
                        {recommendation.description.split('|').map((d) => (
                            <div>{d}</div>
                        ))}
                    </p>
                </Dropdown>
                {recommendation.recommendedTerms && (
                    <Dropdown headerLabel='Recommended Terms' showInitially>
                        {recommendation.recommendedTerms.map((term) => (
                            <div className='mx-2' key={term}>
                                <a
                                    className='text-blue-600 hover:underline'
                                    href={term}
                                    target='_blank'
                                >
                                    &lt;{term}&gt;
                                </a>
                            </div>
                        ))}
                    </Dropdown>
                )}
                {recommendation.related && (
                    <Dropdown headerLabel='Related' showInitially>
                        {recommendation.related.map((related) => (
                            <div className='mx-2' key={related.link}>
                                {related.name}:{' '}
                                <a
                                    className='text-blue-600 hover:underline'
                                    href={related.link}
                                    target='_blank'
                                >
                                    &lt;{related.link}&gt;
                                </a>
                            </div>
                        ))}
                    </Dropdown>
                )}
            </div>
        </div>
    );
}
