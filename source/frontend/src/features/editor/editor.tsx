import 'reactflow/dist/style.css';
import { HTMLProps } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Panel, Node as ReactFlowNode, Edge as ReactFlowEdge, BackgroundVariant } from 'reactflow';
import { identifier } from '../../core/schema/utils/identifier';
import { Relation as SchemaRelation } from '../../core/schema/representation/relation/relation';
import { Entity } from '../../core/schema/representation/item/entity';
import EntityNode from '../diagram/entity-node';
import { SchemaContextProvider } from '../schema-context';
import { FileLoader } from '../file/file-loader';
import { downHierarchyLayoutNodes, forceLayoutNodes, radialLayoutNodes, rightHierarchyLayoutNodes } from '../diagram/layout';
import { FileSaver } from '../file/file-saver';
import { ActionBar } from '../action-bar/action-bar';
import { ActionContextProvider } from '../action-bar/action-context';
import { InstancesContextProvider } from '../instances-context';
import { NodeSelectionContextProvider } from '../diagram/node-selection/node-selection-context';
import { HelpContextProvider } from '../help/help-context';
import { Help } from '../help/help';
import { useEditor } from './use-editor';
import { EntityNodeEventHandlerContextProvider } from '../diagram/node-events/entity-node-event-handler-context';

export type SchemaNode = ReactFlowNode<Entity, identifier>;
export type EntityNode = ReactFlowNode<Entity, identifier>;

export type SchemaEdge = ReactFlowEdge<SchemaRelation> & { data: SchemaRelation };

export default function Editor({ className }: HTMLProps<HTMLDivElement>) {
    const {
        userData: { schema, instances, updateSchema, updateInstances, onImport, onSchemaExport, onInstancesExport },
        diagram: { nodes, edges, nodeTypes, layoutNodes, edgeTypes, nodeEvents: nodeEvents, onNodesChange, nodeSelection },
        manualActions,
        help,
        history,
    } = useEditor();

    return (
        <SchemaContextProvider schema={schema} updateSchema={updateSchema}>
            <InstancesContextProvider instances={instances} updateInstances={updateInstances}>
                <EntityNodeEventHandlerContextProvider eventHandler={nodeEvents.entityNodeHandler}>
                    <HelpContextProvider context={help}>
                        <ActionContextProvider onActionDone={manualActions.onActionDone} showMoveProperty={manualActions.showMoveProperty}>
                            <NodeSelectionContextProvider nodeSelection={nodeSelection}>
                                <div className='grow flex'>
                                    <div className='bg-slate-100 grow'>
                                        <ReactFlow
                                            nodeTypes={nodeTypes}
                                            edgeTypes={edgeTypes}
                                            nodes={nodes}
                                            edges={edges}
                                            // fitView
                                            // connectionMode={ConnectionMode.Loose}
                                            onNodesChange={onNodesChange}
                                            // onEdgesChange={onEdgesChange}
                                            // onConnect={onConnect}
                                            elementsSelectable={true}
                                            onSelect={(event) => {
                                                console.log('SELECT', event);
                                            }}
                                        >
                                            <Controls />
                                            <MiniMap />
                                            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                                            <Panel position='top-center' className='flex gap-2'>
                                                <div className='relative group'>
                                                    <div className='p-2 rounded shadow bg-blue-200'>Auto Layout</div>
                                                    <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                                                        <button
                                                            className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                                                            onClick={() => layoutNodes(downHierarchyLayoutNodes)}
                                                        >
                                                            vertical layout
                                                        </button>
                                                        <button
                                                            className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                                                            onClick={() => layoutNodes(rightHierarchyLayoutNodes)}
                                                        >
                                                            horizontal layout
                                                        </button>
                                                        <button
                                                            className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                                                            onClick={() => layoutNodes(radialLayoutNodes)}
                                                        >
                                                            radial layout
                                                        </button>
                                                        <button
                                                            className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                                                            onClick={() => layoutNodes(forceLayoutNodes)}
                                                        >
                                                            force layout
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className='relative group'>
                                                    <div className='p-2 rounded shadow bg-blue-200'>Create</div>
                                                    <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                                                        <button
                                                            className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                                                            onClick={manualActions.showCreateEntity}
                                                        >
                                                            entity
                                                        </button>
                                                        <button
                                                            className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                                                            onClick={manualActions.showCreateProperty}
                                                        >
                                                            property
                                                        </button>
                                                    </div>
                                                </div>
                                                <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={history.undo}>
                                                    Undo
                                                </button>

                                                <button className='p-2 rounded shadow bg-blue-200 hover:bg-blue-300' onClick={history.redo}>
                                                    Redo
                                                </button>

                                                <FileLoader className='p-2 rounded shadow bg-blue-200' onFileLoad={onImport}>
                                                    Import
                                                </FileLoader>
                                                <div className='relative group'>
                                                    <div className='p-2 rounded shadow bg-blue-200'>Export</div>
                                                    <div className='absolute hidden group-hover:flex z-10 flex-col bg-slate-300 min-w-[10rem] shadow rounded'>
                                                        <FileSaver
                                                            className='block p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                                                            onFileSave={onSchemaExport}
                                                        >
                                                            Schema
                                                        </FileSaver>
                                                        <FileSaver
                                                            className='block p-2 rounded shadow bg-blue-200 hover:bg-blue-300'
                                                            onFileSave={onInstancesExport}
                                                        >
                                                            Instances
                                                        </FileSaver>
                                                    </div>
                                                </div>
                                            </Panel>
                                        </ReactFlow>
                                    </div>
                                    {help.help.show && <Help className='absolute right-96 m-1 w-96' content={help.help.content}></Help>}
                                    <ActionBar action={manualActions.shownAction}></ActionBar>
                                </div>
                            </NodeSelectionContextProvider>
                        </ActionContextProvider>
                    </HelpContextProvider>
                </EntityNodeEventHandlerContextProvider>
            </InstancesContextProvider>
        </SchemaContextProvider>
    );
}
