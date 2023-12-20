import { NodeSelect } from '../../utils/node-select';
import { BipartiteDiagram } from '../../bipartite-diagram/bipartite-diagram';
import { ActionOkCancel } from '../../utils/action-ok-cancel';
import { Header } from '../../utils/header';
import { LabelInput } from '../../utils/label-input';
import { useCreateEntityProperty } from './use-create-entity-property';

export function CreateEntityProperty() {
    const { diagram, nodeSelection, sourceEntity, targetEntity, propertyName, setPropertyName, createProperty, cancel } = useCreateEntityProperty();

    return (
        <div>
            <Header label='Create Entity Property'></Header>
            <LabelInput label='Name' value={propertyName} onChange={(value) => setPropertyName(value)}></LabelInput>
            <div>
                <NodeSelect label='Source' displayValue={sourceEntity?.name} onSelect={nodeSelection.onSourceNodeSelect}></NodeSelect>
                <NodeSelect label='Target' displayValue={targetEntity?.name} onSelect={nodeSelection.onTargetNodeSelect}></NodeSelect>
                {sourceEntity && targetEntity && (
                    <BipartiteDiagram
                        sourceNodes={diagram.sourceNodes}
                        targetNodes={diagram.targetNodes}
                        edges={diagram.edges}
                        nodeTypes={diagram.nodeTypes}
                        edgeTypes={diagram.edgeTypes}
                        onConnect={diagram.onConnect}
                        layout={diagram.layout}
                    ></BipartiteDiagram>
                )}
            </div>
            <ActionOkCancel onOk={createProperty} onCancel={cancel}></ActionOkCancel>
        </div>
    );
}
