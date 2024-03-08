import { EntitySet } from '@klofan/schema/representation';
import { EntityRepresentationBuilder } from './entity-representation-builder';
import { BlankNode, DataFactory } from 'n3';
const { blankNode } = DataFactory;

export class BlankNodeBuilder implements EntityRepresentationBuilder {
    constructor(private entity: EntitySet) {}

    getRepresentation(instance: number): BlankNode {
        return blankNode(`${this.entity.id}${this.entity.name}_${instance}`);
    }
}
