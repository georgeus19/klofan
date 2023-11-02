export type transformationType = 'add-entity';

export interface Transformation {
    type: transformationType;
    data: unknown;
}
