import { Entity } from '../../../schema/representation/item/entity';
import { EntityInstanceRepresentationBuilder } from './instance-uri-builder';
import { DataFactory, NamedNode } from 'n3';
const { namedNode } = DataFactory;

export class NamedNodeInstanceBuilder implements EntityInstanceRepresentationBuilder {
    constructor(private entity: Entity & { uri: string }) {}

    getRepresentation(instance: number): NamedNode {
        const connector = this.entity.uri.slice(-1) === '/' ? '' : '';
        return namedNode(`${this.entity.uri}${connector}${instance}`);
    }
}
