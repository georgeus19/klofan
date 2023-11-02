export type transformationType = 'add-entity-instances';

export interface Transformation {
    type: transformationType;
    data: unknown;
}
