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
                <div className='flex flex-col border-2 border-r-slate-800'>
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
                            fitView
                        >
                            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                        </ReactFlow>
                    </ReactFlowProvider>
                </div>
            </DiagramContextProvider>
            <DiagramContextProvider value={shownRecommendationDetail.new}>
                <div className='flex flex-col border-2 border-l-slate-800'>
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
                            fitView
                        >
                            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                        </ReactFlow>
                    </ReactFlowProvider>
                </div>
            </DiagramContextProvider>
        </>
    );
}
