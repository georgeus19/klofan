import { DiagramContextProvider } from './diagram/diagram-context.tsx';
import { EntitySetDetail } from './detail/entity-set-detail.tsx';
import { EntityPropertySetDetail } from './detail/entity-property-set-detail.tsx';
import { LiteralPropertySetDetail } from './detail/literal-property-set-detail.tsx';
import ReactFlow, { Background, BackgroundVariant, ReactFlowProvider } from 'reactflow';
import { edgeTypes, nodeTypes, Recommendations } from './use-recommendations.ts';

export type RecommendationDetailProps = Required<
    Pick<Recommendations, 'shownRecommendationDetail'>
>;

export function DiagramRecommendationDiff({
    shownRecommendationDetail,
}: RecommendationDetailProps) {
    return (
        <>
            <DiagramContextProvider value={shownRecommendationDetail.old}>
                <div className='w-1/2 flex flex-col'>
                    <EntitySetDetail height='h-60'></EntitySetDetail>
                    <EntityPropertySetDetail height='h-60'></EntityPropertySetDetail>
                    <LiteralPropertySetDetail height='h-60'></LiteralPropertySetDetail>
                    <ReactFlowProvider>
                        <ReactFlow
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            nodes={shownRecommendationDetail.old.diagram.nodes}
                            edges={shownRecommendationDetail.old.diagram.edges}
                            onNodesChange={shownRecommendationDetail.old.diagram.onNodesChange}
                            draggable={true}
                            elementsSelectable={true}
                        >
                            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
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
                    <EntityPropertySetDetail height='h-60'></EntityPropertySetDetail>
                    <LiteralPropertySetDetail height='h-60'></LiteralPropertySetDetail>
                    <ReactFlowProvider>
                        <ReactFlow
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            nodes={shownRecommendationDetail.new.diagram.nodes}
                            edges={shownRecommendationDetail.new.diagram.edges}
                            onNodesChange={shownRecommendationDetail.new.diagram.onNodesChange}
                            draggable={true}
                            elementsSelectable={true}
                        >
                            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                        </ReactFlow>
                    </ReactFlowProvider>
                </div>
            </DiagramContextProvider>
        </>
    );
}
