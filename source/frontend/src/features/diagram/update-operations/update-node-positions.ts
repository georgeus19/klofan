import { XYPosition } from 'reactflow';

export type UpdateNodePositions = { type: 'update-node-positions'; nodeUpdates: { position: XYPosition; nodeId: string }[] };
