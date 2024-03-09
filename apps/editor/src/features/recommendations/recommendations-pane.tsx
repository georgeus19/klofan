import { twMerge } from 'tailwind-merge';
import { useEditorContext } from '../editor/editor-context';
import { Dropdown } from '../manual-actions-pane/utils/dropdown';
import ReactFlow, { Background, BackgroundVariant, ReactFlowProvider } from 'reactflow';
import { useRecommendationsContext } from './recommendations-context';
import { edgeTypes, nodeTypes } from './use-recommendations';
import { DiagramContextProvider } from './diagram/diagram-context';
import { LiteralPropertySetDetail } from './detail/literal-property-set-detail.tsx';
import { Header } from '../manual-actions-pane/utils/header';
import { EntitySetDetail } from './detail/entity-set-detail.tsx';

export type RecommendationsPaneProps = {
    className?: string;
};

export function RecommendationsPane({ className }: RecommendationsPaneProps) {
    const { manualActions } = useEditorContext();
    const {
        recommendations,
        showRecommendationDetail,
        shownRecommendationDetail,
        getRecommendations,
        hideRecommendationDetail,
    } = useRecommendationsContext();

    const recommendationsList = recommendations.map((recommendation, index) => (
        <div key={index} className='grid grid-cols-12 rounded p-1 bg-slate-500 mx-2'>
            <div className='col-span-6'>
                Category:{' '}
                <span className='text-white rounded p-1  '>{recommendation.category}</span>
            </div>
            <button
                className='col-start-10 col-span-3 rounded shadow bg-blue-200 hover:bg-blue-300 p-2'
                onClick={() => {
                    showRecommendationDetail(recommendation, index);
                    manualActions.hide();
                }}
            >
                Detail
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
                <div className='w-full relative flex'>
                    <button
                        className='rounded shadow bg-blue-200 hover:bg-blue-300 p-2 z-50 fixed top-1/2 -translate-x-1/2  translate-y-1/2'
                        onClick={hideRecommendationDetail}
                    >
                        Cancel
                    </button>
                    <DiagramContextProvider value={shownRecommendationDetail.old}>
                        <div className='w-1/2 flex flex-col'>
                            <EntitySetDetail height='h-60'></EntitySetDetail>
                            <LiteralPropertySetDetail height='h-60'></LiteralPropertySetDetail>
                            <ReactFlowProvider>
                                <ReactFlow
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                    nodes={shownRecommendationDetail.old.diagram.nodes}
                                    edges={shownRecommendationDetail.old.diagram.edges}
                                    onNodesChange={
                                        shownRecommendationDetail.old.diagram.onNodesChange
                                    }
                                    draggable={true}
                                    elementsSelectable={true}
                                >
                                    <Background
                                        variant={BackgroundVariant.Dots}
                                        gap={12}
                                        size={1}
                                    />
                                </ReactFlow>
                            </ReactFlowProvider>
                        </div>
                    </DiagramContextProvider>
                    {/* <div className='w-96 bg-slate-300'></div> */}
                    <div className='w-1 bg-slate-800 h-full'></div>
                    {/* <div className='w-96 bg-slate-300'></div> */}
                    {/* <div className='w-1/2'></div> */}
                    <DiagramContextProvider value={shownRecommendationDetail.new}>
                        <div className='w-1/2 flex flex-col'>
                            <EntitySetDetail height='h-60'></EntitySetDetail>
                            <LiteralPropertySetDetail height='h-60'></LiteralPropertySetDetail>
                            <ReactFlowProvider>
                                <ReactFlow
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                    nodes={shownRecommendationDetail.new.diagram.nodes}
                                    edges={shownRecommendationDetail.new.diagram.edges}
                                    onNodesChange={
                                        shownRecommendationDetail.new.diagram.onNodesChange
                                    }
                                    draggable={true}
                                    elementsSelectable={true}
                                >
                                    <Background
                                        variant={BackgroundVariant.Dots}
                                        gap={12}
                                        size={1}
                                    />
                                </ReactFlow>
                            </ReactFlowProvider>
                        </div>
                    </DiagramContextProvider>
                </div>
            )}
        </div>
    );
}
