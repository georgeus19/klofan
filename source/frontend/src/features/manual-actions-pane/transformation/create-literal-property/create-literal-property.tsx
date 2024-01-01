import { Panel } from 'reactflow';
import { BipartiteDiagram } from '../../bipartite-diagram/bipartite-diagram';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { Header } from '../../utils/header';
import { LabelInput } from '../../utils/general-label-input/label-input';
import { useCreateLiteralProperty } from './use-create-literal-property';
import { EntityNodeSelector } from '../../utils/diagram-node-selection/entity-selector/entity-node-selector';
import { UriLabelInput } from '../../utils/uri/uri-label-input';

export function CreateLiteralProperty() {
    const { diagram, sourceEntity, propertySourceSelector, property, createProperty, cancel, error } = useCreateLiteralProperty();

    return (
        <div>
            <Header label='Create Property'></Header>
            <LabelInput label='Name' value={property.name} updateValue={property.setName} id='name'></LabelInput>
            <UriLabelInput label='Uri' {...property.uri} onChangeDone={() => {}} usePrefix id='uri'></UriLabelInput>
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
