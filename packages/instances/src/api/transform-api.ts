export type { Transformation } from '../transform/transformations/transformation';

export type { AllToOneMapping } from '../transform/mapping/all-to-one-mapping';
export {
    getAllToOneProperties,
    isAllToOneMappingEligible,
} from '../transform/mapping/all-to-one-mapping';
export type { JoinMapping } from '../transform/mapping/join-mapping';
export { getJoinedProperties } from '../transform/mapping/join-mapping';
export type { ManualMapping } from '../transform/mapping/manual-mapping';
export type { Mapping } from '../transform/mapping/mapping';
export type { OneToAllMapping } from '../transform/mapping/one-to-all-mapping';
export {
    getOneToAllProperties,
    isOneToAllMappingEligible,
} from '../transform/mapping/one-to-all-mapping';
export type { OneToOneMapping } from '../transform/mapping/one-to-one-mapping';
export {
    getOneToOneProperties,
    isOneToOneMappingEligible,
} from '../transform/mapping/one-to-one-mapping';
export type {
    EntitySetWithInstances,
    ItemWithInstances,
    PreserveMapping,
} from '../transform/mapping/preserve-mapping';
export {
    getPreservedProperties,
    isPreserveMappingEligible,
} from '../transform/mapping/preserve-mapping';

export type { CreateEntities } from '../transform/transformations/create-entities';
export { createEntities } from '../transform/transformations/create-entities';
export type { CreateProperties } from '../transform/transformations/create-properties';
export { createProperties } from '../transform/transformations/create-properties';
export type { MoveProperties } from '../transform/transformations/move-properties';
export { moveProperties } from '../transform/transformations/move-properties';
export type {
    EntityUriMapping,
    UpdateEntitiesUris,
} from '../transform/transformations/update-entities-uris';
export type { UpdatePropertyLiterals } from '../transform/transformations/update-property-literals';
export { updatePropertyLiterals } from '../transform/transformations/update-property-literals';
export { updateEntitiesUris } from '../transform/transformations/update-entities-uris';

export type { TransformationChanges } from '../transform/transformation-changes';
export { transformationChanges } from '../transform/transformation-changes';
