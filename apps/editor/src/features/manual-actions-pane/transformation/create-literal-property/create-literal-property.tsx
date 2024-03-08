import { Panel } from 'reactflow';
import { BipartiteDiagram } from '../../bipartite-diagram/bipartite-diagram';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { Header } from '../../utils/header';
import { LabelInput } from '../../utils/general-label-input/label-input';
import { useCreateLiteralProperty } from './use-create-literal-property';
import { EntitySetNodeSelector } from '../../utils/diagram-node-selection/entity-set-selector/entity-set-node-selector.tsx';
import { UriLabelInput } from '../../utils/uri/uri-label-input';
import { ErrorMessage } from '../../utils/error-message';

export function CreateLiteralProperty() {
    const {
        diagram,
        sourceEntity,
        propertySourceSelector,
        property,
        createProperty,
        cancel,
        error,
    } = useCreateLiteralProperty();

    return (
        <div>
            <Header label='Create PropertySet'></Header>
            <LabelInput
                label='Name'
                value={property.name}
                updateValue={property.setName}
                id='name'
            ></LabelInput>
            <UriLabelInput
                label='Uri'
                {...property.uri}
                onChangeDone={() => {}}
                usePrefix
                id='uri'
            ></UriLabelInput>
            <EntitySetNodeSelector
                label='Source'
                {...propertySourceSelector}
                entitySet={sourceEntity}
            ></EntitySetNodeSelector>
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
                        <button
                            className='bg-blue-200 rounded p-1'
                            onClick={diagram.addLiteralNode}
                        >
                            Add Literal
                        </button>
                    </Panel>
                </BipartiteDiagram>
            )}
            <ErrorMessage error={error}></ErrorMessage>
            <ActionOkCancel onOk={createProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
