export interface TopQuery {
    sparql: string;
}

export interface WherePattern {
    type: 'where-pattern';
    sparql: string;
}
