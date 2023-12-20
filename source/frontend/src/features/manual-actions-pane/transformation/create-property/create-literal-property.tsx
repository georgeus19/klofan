import { Panel } from 'reactflow';
import { NodeSelect } from '../../utils/node-select';
import { BipartiteDiagram } from '../../bipartite-diagram/bipartite-diagram';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { Header } from '../../utils/header';
import { LabelInput } from '../../utils/label-input';
import { useCreateLiteralProperty } from './use-create-literal-property';

export function CreateLiteralProperty() {
    const { diagram, nodeSelection, sourceEntity, propertyName, setPropertyName, createProperty, cancel } = useCreateLiteralProperty();

    return (
        <div>
            <Header label='Create Property'></Header>
            <LabelInput label='Name' value={propertyName} onChange={(value) => setPropertyName(value)}></LabelInput>
            <NodeSelect label='Source' displayValue={sourceEntity?.name} onSelect={nodeSelection.onSourceNodeSelect}></NodeSelect>
            {sourceEntity && (
                <BipartiteDiagram
                    sourceNodes={diagram.sourceNodes}
                    targetNodes={diagram.targetNodes}
                    edges={diagram.edges}
                    nodeTypes={diagram.nodeTypes}
                    edgeTypes={diagram.edgeTypes}
                    onConnect={diagram.onConnect}
                    layout={diagram.layout}
                >
                    <Panel position='bottom-center'>
                        <button className='bg-blue-200 rounded p-1' onClick={diagram.addLiteralNode}>
                            Add Literal
                        </button>
                    </Panel>
                </BipartiteDiagram>
            )}
            <ActionOkCancel onOk={createProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
