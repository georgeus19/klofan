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
import { codeListAnalyzer, sparqlEndpoint } from '../../main';
import * as CATALOG from '../../named-nodes/catalog';
import * as SKOS from '../../named-nodes/skos';
import { Variable } from '../../queries/variable';
import { UploadedData } from '@klofan/old-catalog-types';
import * as DCTERMS from '../../named-nodes/dcterms';

const showUpdadedDataRequestSchema = z.object({
    query: z.object({
        offset: z.coerce.number().nonnegative(),
        limit: z.coerce.number().positive(),
    }),
});

export const showUploadedData = endpointErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
    const sparqlStore = new SparlqEndpointStore(sparqlEndpoint);
    const {
        query: { offset, limit },
    } = await parseRequest(showUpdadedDataRequestSchema, request);
    const uploadedData = new Variable('uploadedData');
    const uploadedDataName = new Variable('uploadedDataName');
    const uploadedDataCreated = new Variable('uploadedDataCreated');
    const uploadedDataDescription = new Variable('uploadedDataDescription');
    const listUploadedData = `
        SELECT ${uploadedData.toSparql()}, ${uploadedDataName.toSparql()}, ${uploadedDataCreated.toSparql()}, ${uploadedDataDescription.toSparql()}
        WHERE {
            ${uploadedData.toSparql()} 
                a ${CATALOG.InputData().toSparql()} ;
                ${DCTERMS.title().toSparql()} ${uploadedDataName.toSparql()} ;
                ${DCTERMS.created().toSparql()} ${uploadedDataCreated.toSparql()} .
            
            OPTIONAL {
                ${uploadedData.toSparql()} ${DCTERMS.description().toSparql()} ${uploadedDataDescription.toSparql()} .
            }

        }
        ORDER BY ${uploadedDataCreated.toSparql()}
        OFFSET ${offset}
        LIMIT ${limit}
    `;
    // const sparqlUpdates = inputData(files);
    const uploadedDataList = await sparqlStore.selectQuery(listUploadedData);
    console.log(uploadedDataList);
    const res: UploadedData[] = uploadedDataList.map(
        (row: any): UploadedData => ({
            iri: row[uploadedData.value].value,
            label: row[uploadedDataName.value].value,
            description: row[uploadedDataDescription.value]?.value ?? undefined,
            uploaded: row[uploadedDataCreated.value].value,
        })
    );

    response.status(200).send(res);
});
