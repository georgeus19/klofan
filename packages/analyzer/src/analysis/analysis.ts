import { AnalysisProvenance } from './provenance';
import { Optional } from '@klofan/utils';

export interface Analysis {
    id: string;
    type: string;
    provenance: AnalysisProvenance;
    internal: unknown;
}

export type InternalAnalysis = Optional<Analysis, 'id' | 'provenance'>;
