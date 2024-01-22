export type { AllToOneMapping } from '../transform/mapping/all-to-one-mapping';
export { getAllToOnePropertyInstances, isAllToOneMappingEligible } from '../transform/mapping/all-to-one-mapping';
export type { JoinMapping } from '../transform/mapping/join-mapping';
export { getJoinedPropertyInstances } from '../transform/mapping/join-mapping';
export type { ManualMapping } from '../transform/mapping/manual-mapping';
export type { Mapping } from '../transform/mapping/mapping';
export type { OneToAllMapping } from '../transform/mapping/one-to-all-mapping';
export { getOneToAllPropertyInstances, isOneToAllMappingEligible } from '../transform/mapping/one-to-all-mapping';
export type { OneToOneMapping } from '../transform/mapping/one-to-one-mapping';
export { getOneToOnePropertyInstances, isOneToOneMappingEligible } from '../transform/mapping/one-to-one-mapping';
export type { EntityWithInstances, ItemWithInstances, PreserveMapping } from '../transform/mapping/preserve-mapping';
export { getPreservedPropertyInstances, isPreserveMappingEligible } from '../transform/mapping/preserve-mapping';

export type { CreateEntityInstances } from '../transform/transformations/create-entity-instances';
export { createEntityInstances } from '../transform/transformations/create-entity-instances';
export type { CreatePropertyInstances } from '../transform/transformations/create-property-instances';
export { createPropertyInstances } from '../transform/transformations/create-property-instances';
export type { MovePropertyInstances } from '../transform/transformations/move-property-instances';
export { movePropertyInstances } from '../transform/transformations/move-property-instances';
export type { Transformation } from '../transform/transformations/transformation';
export type { EntityInstanceUriMapping, UpdateEntityInstancesUris } from '../transform/transformations/update-entity-instances-uris';
export { updateEntityInstancesUris } from '../transform/transformations/update-entity-instances-uris';

export { applyTransformation } from '../transform/apply-transformation';
