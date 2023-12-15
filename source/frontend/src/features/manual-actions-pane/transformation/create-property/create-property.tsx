import { Panel } from 'reactflow';
import { useCreateProperty } from './use-create-property';
import { twMerge } from 'tailwind-merge';
import { NodeSelect } from '../../utils/node-select';
import { BipartiteDiagram } from '../../bipartite-diagram/bipartite-diagram';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { Header } from '../../utils/header';
import { LabelInput } from '../../utils/label-input';

export function CreateProperty() {
    const { diagram, tab, nodeSelection, sourceEntity, targetEntity, propertyName, setPropertyName, createProperty, cancel } = useCreateProperty();

    return (
        <div>
            <Header label='Create Property'></Header>
            <LabelInput label='Name' value={propertyName} onChange={(value) => setPropertyName(value)}></LabelInput>
            <div>
                <div className='grid grid-cols-2'>
                    <button
                        className={twMerge('bg-slate-100 hover:bg-slate-400 p-2', tab.literalTabActive && 'bg-slate-300 ')}
                        onClick={tab.switchToLiteralTargetTab}
                    >
                        Literal
                    </button>
                    <button
                        className={twMerge('bg-slate-100 hover:bg-slate-400 p-2 ', tab.entityTabActive && 'bg-slate-300 ')}
                        onClick={tab.switchToEntityTargetTab}
                    >
                        Other
                    </button>
                </div>
                <div>
                    {tab.entityTabActive ? (
                        <>
                            <NodeSelect label='Source' displayValue={sourceEntity?.name} onSelect={nodeSelection.onSourceNodeSelect}></NodeSelect>
                            <NodeSelect label='Target' displayValue={targetEntity?.name} onSelect={nodeSelection.onTargetNodeSelect}></NodeSelect>
                            {sourceEntity && targetEntity && (
                                <BipartiteDiagram
                                    sourceNodes={diagram.sourceNodes}
                                    targetNodes={diagram.entityTarget.targetNodes}
                                    edges={diagram.entityTarget.edges}
                                    nodeTypes={diagram.nodeTypes}
                                    edgeTypes={diagram.edgeTypes}
                                    onConnect={diagram.entityTarget.onConnect}
                                    layout={diagram.layout}
                                ></BipartiteDiagram>
                            )}
                        </>
                    ) : (
                        <>
                            <NodeSelect label='Source' displayValue={sourceEntity?.name} onSelect={nodeSelection.onSourceNodeSelect}></NodeSelect>
                            {sourceEntity && (
                                <BipartiteDiagram
                                    sourceNodes={diagram.sourceNodes}
                                    targetNodes={diagram.literalTarget.targetNodes}
                                    edges={diagram.literalTarget.edges}
                                    nodeTypes={diagram.nodeTypes}
                                    edgeTypes={diagram.edgeTypes}
                                    onConnect={diagram.literalTarget.onConnect}
                                    layout={diagram.layout}
                                >
                                    <Panel position='bottom-center'>
                                        <button className='bg-blue-200 rounded p-1' onClick={diagram.literalTarget.addLiteralNode}>
                                            Add Literal
                                        </button>
                                    </Panel>
                                </BipartiteDiagram>
                            )}
                        </>
                    )}
                </div>
            </div>
            <ActionOkCancel onOk={createProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
