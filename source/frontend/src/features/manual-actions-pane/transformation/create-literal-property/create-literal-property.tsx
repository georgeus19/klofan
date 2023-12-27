import { Panel } from 'reactflow';
import { BipartiteDiagram } from '../../bipartite-diagram/bipartite-diagram';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { Header } from '../../utils/header';
import { LabelInput } from '../../utils/label-input';
import { useCreateLiteralProperty } from './use-create-literal-property';
import { EntityNodeSelector } from '../../utils/diagram-node-selection/entity-selector/entity-node-selector';

export function CreateLiteralProperty() {
    const { diagram, sourceEntity, propertySourceSelector, propertyName, setPropertyName, createProperty, cancel, error } =
        useCreateLiteralProperty();

    return (
        <div>
            <Header label='Create Property'></Header>
            <LabelInput label='Name' value={propertyName} onChange={(value) => setPropertyName(value)}></LabelInput>
            <EntityNodeSelector label='Source' {...propertySourceSelector} entity={sourceEntity}></EntityNodeSelector>
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
            {error && <div className='bg-rose-200 p-2 border rounded border-rose-700 text-rose-700'>{error}</div>}
            <ActionOkCancel onOk={createProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
