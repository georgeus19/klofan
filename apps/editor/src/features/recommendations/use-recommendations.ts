import { RawInstances } from '@klofan/instances/representation';
import { IdentifiableRecommendation } from '@klofan/recommender/recommendation';
import { RawSchema } from '@klofan/schema/representation';
import { RawDiagram, SchemaEdge, SchemaNode } from '../diagram/raw-diagram';
import EntitySetNode from './diagram-diff/diagram/entity-set-node.tsx';
import PropertySetEdge from './diagram-diff/diagram/property-set-edge.tsx';
import { useState } from 'react';
import { useEditorContext } from '../editor/editor-context';
import { reflectSchema } from '../diagram/reflect-schema/reflect-schema';
import { Schema } from '@klofan/schema';
import { InMemoryInstances } from '@klofan/instances';
import { NodeChange, applyNodeChanges } from 'reactflow';
import {
    PropertySetSelection,
    usePropertySetSelection,
} from '../diagram/use-property-set-selection.ts';
import {
    TransformationChanges,
    transformationChanges as schemaTransformationChanges,
} from '@klofan/schema/transform';
import { transformationChanges as instancesTransformationChanges } from '@klofan/instances/transform';
import { ENTITY_SET_NODE } from '../diagram/nodes/entity-set-node.tsx';
import { PROPERTY_SET_EDGE } from '../diagram/edges/property-set-edge.tsx';
import { NodeSelection, useNodeSelection } from '../diagram/use-node-selection.ts';
import { TransformSchemaAndInstances } from '../editor/update-operations/transform-schema-and-instances-operation.ts';
import * as _ from 'lodash';
import { useRecommendationLoader } from './use-recommendation-loader.ts';
import { SchemaFilter, useSchemaFilter } from './use-schema-filter.ts';
import { CategoryFilter, useCategoryFilter } from './use-category-filter.ts';

export type RecommendationDiagram = {
    nodes: SchemaNode[];
    edges: SchemaEdge[];
    onNodesChange: (changes: NodeChange[]) => void;
    propertySetSelection: PropertySetSelection;
    nodeSelection: NodeSelection;
};

export type Recommendations = {
    schemaFilter: SchemaFilter;
    categoryFilter: CategoryFilter;
    selectedRecommendations: IdentifiableRecommendation[];
    recommendationsLoadState: LoadState;
    getRecommendations: () => void;
    deleteRecommendations: () => void;
    applyRecommendation: (recommendation: IdentifiableRecommendation) => Promise<void>;
    showRecommendationDetail: (recommendation: IdentifiableRecommendation) => Promise<void>;
    hideRecommendationDetail: () => void;
    shownRecommendationDetail?: {
        recommendation: IdentifiableRecommendation;
        changes: TransformationChanges;
        old: {
            schema: Schema;
            instances: InMemoryInstances;
            diagram: RecommendationDiagram;
        };
        new: {
            schema: Schema;
            instances: InMemoryInstances;
            diagram: RecommendationDiagram;
        };
    };
};

type RawRecommendationDetail = {
    recommendation: IdentifiableRecommendation;
    changes: TransformationChanges;
    old: {
        schema: RawSchema;
        instances: RawInstances;
        diagram: RawDiagram;
    };
    new: {
        schema: RawSchema;
        instances: RawInstances;
        diagram: RawDiagram;
    };
};

export const nodeTypes = { [ENTITY_SET_NODE]: EntitySetNode };

export const edgeTypes = { [PROPERTY_SET_EDGE]: PropertySetEdge };

export type LoadState =
    | {
          recommendationsPresent: boolean;
          type: 'loading';
      }
    | { type: 'loaded' }
    | { type: 'before-load' }
    | { type: 'no-recommendations-yielded' };

export function useRecommendations(): Recommendations {
    const [recommendations, setRecommendations] = useState<{
        [recommenderType: string]: IdentifiableRecommendation[];
    }>({});

    const [recommendationsLoadState, setRecommendationsLoadingState] = useState<LoadState>({
        type: 'before-load',
    });

    const [selectedRecommendation, setSelectedRecommendation] =
        useState<RawRecommendationDetail | null>(null);
    const { schema, instances, diagram, runOperations } = useEditorContext();
    const oldPropertySetSelection = usePropertySetSelection();
    const newPropertySetSelection = usePropertySetSelection();
    const oldNodeSelection = useNodeSelection();
    const newNodeSelection = useNodeSelection();

    const recommendationLoader = useRecommendationLoader({ schema, instances });
    const schemaFilter = useSchemaFilter();
    const categoryFilter = useCategoryFilter();

    const categoryFilteredRecommendations =
        categoryFilter.selectedCategory !== null &&
        recommendations[categoryFilter.selectedCategory.name]
            ? recommendations[categoryFilter.selectedCategory.name]
            : Object.values(recommendations).flat(1);
    const selectedRecommendations = categoryFilteredRecommendations.filter((recommendation) => {
        const { itemChanges, relationChanges } = calculateSchemaChanges(recommendation);
        return schemaFilter.isFiltered(itemChanges.concat(relationChanges));
    });

    const getRecommendations = () => {
        deleteRecommendations();
        setRecommendationsLoadingState({
            type: 'loading',
            recommendationsPresent: false,
        });

        recommendationLoader.getRecommendations(
            ({ recommendations: fetchedRecommendations, partiallyLoaded }) => {
                if (fetchedRecommendations.length > 0) {
                    setRecommendations((prev) =>
                        _.groupBy(
                            [...Object.values(prev).flat(), ...fetchedRecommendations],
                            (r) => r.category.name
                        )
                    );
                    categoryFilter.updateCategories(fetchedRecommendations, true);
                    setRecommendationsLoadingState({
                        type: 'loading',
                        recommendationsPresent: true,
                    });
                } else {
                    if (partiallyLoaded) {
                        setRecommendationsLoadingState({ type: 'loaded' });
                    } else {
                        setRecommendationsLoadingState({ type: 'no-recommendations-yielded' });
                    }
                }
            }
        );
    };

    const deleteRecommendations = () => {
        setRecommendationsLoadingState({ type: 'before-load' });
        setRecommendations({});
        setSelectedRecommendation(null);
        oldPropertySetSelection.clearSelectedPropertySet();
        oldNodeSelection.clearSelectedNode();
        newPropertySetSelection.clearSelectedPropertySet();
        newNodeSelection.clearSelectedNode();
        categoryFilter.updateCategories([], false);
        schemaFilter.reset();
    };

    const showRecommendationDetail = async (recommendation: IdentifiableRecommendation) => {
        const old = {
            schema: schema.raw(),
            instances: instances.raw() as RawInstances,
            diagram: {
                nodes: structuredClone(diagram.nodes),
                edges: structuredClone(diagram.edges),
            },
        };

        let newSchema = schema;
        for (const transformation of recommendation.transformations) {
            newSchema = newSchema.transform(transformation.schemaTransformations);
        }

        let newInstances = instances;
        for (const transformation of recommendation.transformations) {
            newInstances = await newInstances.transform(transformation.instanceTransformations);
        }
        const n = {
            schema: newSchema.raw(),
            instances: newInstances.raw() as RawInstances,
            diagram: reflectSchema(
                { nodes: structuredClone(diagram.nodes), edges: structuredClone(diagram.edges) },
                newSchema
            ),
        };

        const { itemChanges, relationChanges } = calculateSchemaChanges(recommendation);

        setSelectedRecommendation({
            recommendation: recommendation,
            changes: {
                items: itemChanges,
                relations: relationChanges,
            },
            old: old,
            new: n,
        });

        oldNodeSelection.clearSelectedNode();
        newNodeSelection.clearSelectedNode();
        oldPropertySetSelection.clearSelectedPropertySet();
        newPropertySetSelection.clearSelectedPropertySet();
    };

    const hideRecommendationDetail = () => {
        setSelectedRecommendation(null);
    };

    const onNodesChange = (oldOrNew: 'new' | 'old') => (changes: NodeChange[]) =>
        setSelectedRecommendation((prev) => {
            if (prev) {
                return {
                    ...prev,
                    [oldOrNew]: {
                        ...prev[oldOrNew],
                        diagram: {
                            ...prev[oldOrNew].diagram,
                            nodes: applyNodeChanges(
                                changes,
                                prev[oldOrNew].diagram.nodes
                            ) as SchemaNode[],
                        },
                    },
                };
            }
            return null;
        });

    const shownRecommendationDetail = selectedRecommendation
        ? {
              recommendation: selectedRecommendation.recommendation,
              changes: selectedRecommendation.changes,
              old: {
                  schema: new Schema(selectedRecommendation.old.schema),
                  instances: new InMemoryInstances(selectedRecommendation.old.instances),
                  diagram: {
                      nodes: selectedRecommendation.old.diagram.nodes,
                      edges: selectedRecommendation.old.diagram.edges,
                      onNodesChange: onNodesChange('old'),
                      propertySetSelection: oldPropertySetSelection,
                      nodeSelection: oldNodeSelection,
                  },
              },
              new: {
                  schema: new Schema(selectedRecommendation.new.schema),
                  instances: new InMemoryInstances(selectedRecommendation.new.instances),
                  diagram: {
                      nodes: selectedRecommendation.new.diagram.nodes,
                      edges: selectedRecommendation.new.diagram.edges,
                      onNodesChange: onNodesChange('new'),
                      propertySetSelection: newPropertySetSelection,
                      nodeSelection: newNodeSelection,
                  },
              },
          }
        : undefined;

    const applyRecommendation = async (recommendation: IdentifiableRecommendation) => {
        const operations: TransformSchemaAndInstances[] = recommendation.transformations.map(
            (transformation) => ({
                type: 'transform-schema-and-instances',
                transformation: transformation,
            })
        );
        await runOperations(operations, true).then(() => {
            deleteRecommendations();
        });
    };

    return {
        schemaFilter: schemaFilter,
        categoryFilter,
        selectedRecommendations: selectedRecommendations,
        recommendationsLoadState,
        getRecommendations,
        deleteRecommendations,
        applyRecommendation,
        showRecommendationDetail,
        hideRecommendationDetail,
        shownRecommendationDetail: shownRecommendationDetail,
    };
}

function calculateSchemaChanges(recommendation: IdentifiableRecommendation) {
    const instancesChanges = recommendation.transformations.flatMap((transformation) =>
        transformation.instanceTransformations.map((transformation) =>
            instancesTransformationChanges(transformation)
        )
    );
    const schemaChanges = recommendation.transformations.flatMap((transformation) =>
        transformation.schemaTransformations.map((transformation) =>
            schemaTransformationChanges(transformation)
        )
    );

    const itemChanges = [
        ...instancesChanges.flatMap((ch) => ch.entities),
        ...schemaChanges.flatMap((ch) => ch.items),
    ];
    const relationChanges = [
        ...instancesChanges.flatMap((ch) => ch.properties),
        ...schemaChanges.flatMap((ch) => ch.relations),
    ];
    return { itemChanges, relationChanges };
}
