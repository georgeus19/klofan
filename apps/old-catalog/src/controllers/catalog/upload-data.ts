import { endpointErrorHandler } from '../../utils/endpoint-error-handler';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { parseMultipartRequest } from '../../utils/parse-multipart-request';
import { parseInput } from '../../utils/parse-request';
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

const uploadFileSchema = z.object({
    // TODO SANITIZITE name and description.
    name: z.array(z.string().min(3)).length(1),
    description: z.array(z.string().min(3)).min(0).max(1),
    files: z
        .array(
            z.object({
                filepath: z.string(),
                originalFilename: z.string(),
                mimetype: z.string().regex(new RegExp('^text/turtle$')),
            })
        )
        .min(1),
});

export const uploadDataToCatalog = endpointErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
    console.log('loadDataToCatalog');
    console.log(request.headers['content-type']);
    console.log('body', request.params);
    const body = await parseMultipartRequest(request);
    const {
        name: [name],
        description,
        files,
    } = await parseInput(uploadFileSchema, body);
    const sparqlStore = new SparlqEndpointStore(sparqlEndpoint);
    const inputData = new GraphInputDataSelector(new NamedNode(`urn:${uuidv4()}/${name}`));
    const sparqlUpdates = inputData.save(files, name, description.length > 0 ? description[0] : undefined);
    await sparqlStore.update(sparqlUpdates.join('\n'));
    const quads = await codeListAnalyzer.analyze(inputData, sparqlStore);
    const insert = `
    INSERT DATA {
        GRAPH ${CATALOG.MetadataGraph().toSparql()} {
            ${quads.map((q) => q.toSparql()).join('\n')}
        }
    }
    `;
    console.log(insert);
    await sparqlStore.update(insert);
    response.status(200).send({ name: name, files, sparqlUpdates });
});
