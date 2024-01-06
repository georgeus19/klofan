import { Entity } from '../../../schema/representation/item/entity';
import { EntityInstanceRepresentationBuilder } from './instance-uri-builder';
import { BlankNode, DataFactory } from 'n3';
const { blankNode } = DataFactory;

export class BlankNodeInstanceBuilder implements EntityInstanceRepresentationBuilder {
    constructor(private entity: Entity) {}

    getRepresentation(instance: number): BlankNode {
        return blankNode(`${this.entity.id}${this.entity.name}_${instance}`);
    }
}
