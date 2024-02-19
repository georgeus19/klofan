export interface Analysis {
    id: string;
    type: string;
    dataset: any;
    internal: any;
}

export type AnalysisWithoutId = Omit<Analysis, 'id'>;
