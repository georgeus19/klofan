import { endpointErrorHandler } from '../../utils/endpoint-error-handler';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { parseMultipartRequest } from '../../utils/parse-multipart-request';
import { parseInput, parseRequest } from '../../utils/parse-request';
import { SparlqEndpointStore } from '../../sparql-store';
import { MemoryLevel } from 'memory-level';
import { DataFactory } from 'rdf-data-factory';
import { Quadstore } from 'quadstore';
import { Engine } from 'quadstore-comunica';
import { Bindings } from '@rdfjs/types';
import { LFQ } from '../../queries/load-file';
import { GraphInputDataSelector } from '../../queries/input-data-selector';
import { NamedNode } from '../../queries/named-node';
import { v4 as uuidv4 } from 'uuid';
import { analyzerConfiguration, codeListAnalyzer, sparqlEndpoint } from '../../main';
import * as CATALOG from '../../named-nodes/catalog';
import * as SKOS from '../../named-nodes/skos';
import { Variable } from '../../queries/variable';
import { UploadedData } from '@klofan/old-catalog-types';
import * as DCTERMS from '../../named-nodes/dcterms';
import { RawSchema } from '@klofan/schema/representation';
import { Property, RawInstances } from '@klofan/instances/representation';
import { Schema } from '@klofan/schema';
import { InMemoryInstances } from '@klofan/instances';
import * as _ from 'lodash';
import { alternativePath } from '../../queries/paths';

const requestSchema = z.object({
    body: z.object({
        schema: z.object({}).passthrough(),
        instances: z.object({}).passthrough(),
    }),
});

export const recommend = endpointErrorHandler(
    async (request: Request, response: Response, next: NextFunction) => {
        const sparqlStore = new SparlqEndpointStore(sparqlEndpoint);
        console.log('BODY', request.body);
        const { body } = await parseRequest(requestSchema, request);
        const schema = new Schema(request.body.schema);
        const instances = new InMemoryInstances(request.body.instances);
        // const literals: string[] = _.uniq(
        //     propertyInstances.flatMap((propertyInstances) => propertyInstances.flatMap((p) => p.literals.map((l) => l.value)))
        // );

        const codeList = new Variable('codeList');
        const code = new Variable('code');
        const codeEntity = new Variable('codeEntity');

        const getCodes = `
        SELECT ${code.toSparql()}, ${codeEntity.toSparql()}
        WHERE {
            GRAPH ${CATALOG.MetadataGraph().toSparql()} {
                ${codeList.toSparql()} a ${CATALOG.CodeList().toSparql()} .
            }
            ${codeEntity.toSparql()}
                ${SKOS.inScheme().toSparql()} ${codeList.toSparql()} ;
                ${alternativePath(analyzerConfiguration.codePredicates)} ${code.toSparql()} .
            FILTER(isLiteral(${code.toSparql()}))
        }
            
            `;
        console.log(getCodes);

        const codes = await sparqlStore.selectQuery(getCodes);
        const pairs: { entity: string; property: string }[] = schema
            .entities()
            .flatMap((entity) =>
                entity.properties.map((propertyId) => ({ entity: entity.id, property: propertyId }))
            );
        const newInstances: RawInstances = { ...(instances.raw() as RawInstances) };
        for (const p of pairs) {
            const propertyInstances: Property[] = await instances.properties(p.entity, p.property);
            newInstances.properties[`${p.entity}.${p.property}`] = propertyInstances.map((pi) => {
                pi.literals = pi.literals.map((literal) => {
                    const matchingRow: any = _.find(
                        codes,
                        (row: any) => row[code.value].value === literal.value
                    );
                    if (matchingRow) {
                        return { value: matchingRow[codeEntity.value].value };
                    }
                    return literal;
                });
                return pi;
            });
        }
        console.log('ewInstances', newInstances);
        response.status(200).send(newInstances);
    }
);
