import { EntitySet } from '@klofan/schema/representation';
import { EntityRepresentationBuilder } from './entity-representation-builder';
import { DataFactory, NamedNode } from 'n3';
const { namedNode } = DataFactory;

export class NamedNodeBuilder implements EntityRepresentationBuilder {
    constructor(private entity: EntitySet & { uri: string }) {}

    getRepresentation(instance: number): NamedNode {
        const connector = this.entity.uri.slice(-1) === '/' ? '' : '';
        return namedNode(`${this.entity.uri}${connector}${instance}`);
    }
}
