export type UploadedData = {
    label: string;
    iri: string;
    description?: string;
    uploaded: string; // xsd:dateTime
};

export type CodeList = {
    type: 'code-list';
    label: string;
    iri: string;
};

export type AnalysedStructure = CodeList;
