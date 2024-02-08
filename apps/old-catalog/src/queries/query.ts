export interface TopQuery {
    sparql: string;
}

export class UpdateQuery {
    constructor(private sparql: string) {}
}

export interface WherePattern {
    type: 'where-pattern';
    sparql: string;
}
