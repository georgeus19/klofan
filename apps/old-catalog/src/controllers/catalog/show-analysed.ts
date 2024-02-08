import { endpointErrorHandler } from '../../utils/endpoint-error-handler';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { parseMultipartRequest } from '../../utils/parse-multipart-request';
import { parseInput, parseRequest } from '../../utils/parse-request';
import { SparlqEndpointStore } from '../../sparql-store';
import { analyzerConfiguration, codeListAnalyzer, sparqlEndpoint } from '../../main';
import * as CATALOG from '../../named-nodes/catalog';
import * as SKOS from '../../named-nodes/skos';
import { Variable } from '../../queries/variable';
import { AnalysedStructure, UploadedData } from '@klofan/old-catalog-types';
import * as DCTERMS from '../../named-nodes/dcterms';
import { alternativePath } from '../../queries/paths';
import * as _ from 'lodash';

const showAnalysedRequestSchema = z.object({
    query: z.object({
        iri: z.string(),
    }),
});

export const showAnalysed = endpointErrorHandler(async (request: Request, response: Response, next: NextFunction) => {
    const sparqlStore = new SparlqEndpointStore(sparqlEndpoint);
    const {
        query: { iri },
    } = await parseRequest(showAnalysedRequestSchema, request);
    console.log('IRI', iri);
    const codeListVariable = new Variable('codeList');
    const codeListLabelVariable = new Variable('codeListLabel');
    const analysedStructuresQuery = `
    SELECT DISTINCT ${codeListVariable.toSparql()}, ${codeListLabelVariable.toSparql()}
    WHERE {
        ${codeListVariable.toSparql()}
            ${CATALOG.inputData().toSparql()} <${iri}> ;
            ${alternativePath(analyzerConfiguration.labelPredicates)} ${codeListLabelVariable.toSparql()} .
    }
    `;
    console.log(analysedStructuresQuery);

    // const sparqlUpdates = inputData(files);
    const analysedStructures = await sparqlStore.selectQuery(analysedStructuresQuery);

    const res: AnalysedStructure[] = Object.values(_.groupBy(analysedStructures, (o: any) => o[codeListVariable.value].value)).flatMap(
        (codeListGroup: any[]) => {
            const englishLabel = codeListGroup.find((tuple: any) => tuple[codeListLabelVariable.value].language === 'en');
            return {
                type: 'code-list',
                label: englishLabel ? englishLabel[codeListLabelVariable.value].value : codeListGroup[0][codeListLabelVariable.value].value,
                iri: codeListGroup[0][codeListVariable.value].value,
            };
        }
    );

    response.status(200).send(res);
});
