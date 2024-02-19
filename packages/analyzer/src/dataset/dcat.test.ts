import { describe, expect, test } from '@jest/globals';
import { DcatDataset, getDcatDatasets } from './dcat';
import { Store, Parser } from 'n3';

describe('@klofan/Analyzer', () => {
    describe('Dcat', () => {
        describe('getDcatDatasets', () => {
            test('OneDataset', async () => {
                const parser = new Parser();
                const data = `
                @prefix ex: <http://example.org/opendata/czech/births/> . 
                @prefix ex-metadata: <http://example.org/opendata/czech/births/metadata/> .
                @prefix dcat: <http://www.w3.org/ns/dcat#> .
                @prefix dcterms: <http://purl.org/dc/terms/> .

                ex:anotherTriple a ex:Another .

                ex:czech-birth-regions a dcat:Dataset ;
                    dcterms:title "Live births values for regions in the Czech Republic."@en ;
                    dcterms:description "Live births values for regions in the Czech Republic."@en ;
                    dcat:theme <http://publications.europa.eu/resource/authority/data-theme/SOCI> ;
                    dcterms:spatial <http://publications.europa.eu/resource/authority/country/CZE> ;
                    dcterms:language <http://publications.europa.eu/resource/authority/language/CES> ;
                    dcterms:accrualPeriodicity <http://publications.europa.eu/resource/authority/frequency/ANNUAL> ;
                    dcterms:publisher <https://www.czso.cz/> ;
                    dcat:distribution ex-metadata:csv-distribution, ex-metadata:ttl-distribution ;
                    dcat:landingPage <https://www.czso.cz/csu/czso/pohyb-obyvatel-za-cr-kraje-okresy-so-orp-a-obce> .

                ex-metadata:csv-distribution a dcat:Distribution ;
                    dcterms:title "Live births values for regions in the Czech Republic in csv."@en ;
                    dcterms:format <http://publications.europa.eu/resource/authority/file-type/CSV> ;
                    dcat:mediaType <http://www.iana.org/assignments/media-types/text/csv> ;
                    dcat:accessURL <https://www.czso.cz/documents/10180/184344914/130141-22data2021.csv/a835923a-9dcc-4b23-a609-cad06188e4b4?version=1.1> ;
                    dcat:downloadURL <https://www.czso.cz/documents/10180/184344914/130141-22data2021.csv/a835923a-9dcc-4b23-a609-cad06188e4b4?version=1.1> .

                ex-metadata:ttl-distribution a dcat:Distribution ;
                    dcterms:format <http://publications.europa.eu/resource/authority/file-type/RDF_TURTLE> ;
                    dcat:mediaType <https://www.iana.org/assignments/media-types/text/turtle> ;
                    dcterms:title "Live births values for regions in the Czech Republic in turtle."@en ;
                    dcat:accessURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> ;
                    dcat:downloadURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> .
                `;
                const quads = parser.parse(data);
                const store = new Store(quads);

                const datasets: DcatDataset[] = await getDcatDatasets(store);

                const expectedDatasets: DcatDataset[] = [
                    {
                        iri: 'http://example.org/opendata/czech/births/czech-birth-regions',
                        distributions: [
                            {
                                iri: 'http://example.org/opendata/czech/births/metadata/csv-distribution',
                                mimeType: 'text/csv',
                                downloadUrl:
                                    'https://www.czso.cz/documents/10180/184344914/130141-22data2021.csv/a835923a-9dcc-4b23-a609-cad06188e4b4?version=1.1',
                                mediaType: 'http://www.iana.org/assignments/media-types/text/csv',
                            },
                            {
                                iri: 'http://example.org/opendata/czech/births/metadata/ttl-distribution',
                                mimeType: 'text/turtle',
                                downloadUrl:
                                    'https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl',
                                mediaType: 'https://www.iana.org/assignments/media-types/text/turtle',
                            },
                        ],
                    },
                ];
                expect(datasets).toEqual(expectedDatasets);
            });
            test('TwoDatasets', async () => {
                const parser = new Parser();
                const data = `
                @prefix ex: <http://example.org/opendata/czech/births/> . 
                @prefix ex-metadata: <http://example.org/opendata/czech/births/metadata/> .
                @prefix dcat: <http://www.w3.org/ns/dcat#> .
                @prefix dcterms: <http://purl.org/dc/terms/> .

                ex:czech-people-regions a dcat:Dataset ;
                    dcat:distribution ex-metadata:jsonld1-distribution, ex-metadata:ttl1-distribution .

                ex-metadata:jsonld1-distribution a dcat:Distribution ;
                    dcterms:title "Number of people in regions in Czech Republic."@en ;
                    dcat:mediaType <https://www.iana.org/assignments/media-types/application/ld+json> ;
                    dcat:accessURL <https://example.com/aa.jsonld> ;
                    dcat:downloadURL <https://example.com/aa.jsonld> .

                ex-metadata:ttl1-distribution a dcat:Distribution ;
                    dcat:mediaType <https://www.iana.org/assignments/media-types/text/turtle> ;
                    dcat:accessURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-people-dataset/output/czech-region-people-agg.ttl> ;
                    dcat:downloadURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-people-dataset/output/czech-region-people-agg.ttl> .


                ex:anotherTriple a ex:Another .

                ex:czech-birth-regions a dcat:Dataset ;
                    dcterms:title "Live births values for regions in the Czech Republic."@en ;
                    dcterms:description "Live births values for regions in the Czech Republic."@en ;
                    dcat:distribution ex-metadata:csv2-distribution, ex-metadata:ttl2-distribution ;
                    dcat:landingPage <https://www.czso.cz/csu/czso/pohyb-obyvatel-za-cr-kraje-okresy-so-orp-a-obce> .

                ex-metadata:csv2-distribution a dcat:Distribution ;
                    dcterms:title "Live births values for regions in the Czech Republic in csv."@en ;
                    dcterms:format <http://publications.europa.eu/resource/authority/file-type/CSV> ;
                    dcat:mediaType <http://www.iana.org/assignments/media-types/text/csv> ;
                    dcat:accessURL <https://www.czso.cz/documents/10180/184344914/130141-22data2021.csv/a835923a-9dcc-4b23-a609-cad06188e4b4?version=1.1> ;
                    dcat:downloadURL <https://www.czso.cz/documents/10180/184344914/130141-22data2021.csv/a835923a-9dcc-4b23-a609-cad06188e4b4?version=1.1> .

                ex-metadata:ttl2-distribution a dcat:Distribution ;
                    dcterms:format <http://publications.europa.eu/resource/authority/file-type/RDF_TURTLE> ;
                    dcat:mediaType <https://www.iana.org/assignments/media-types/text/turtle> ;
                    dcterms:title "Live births values for regions in the Czech Republic in turtle."@en ;
                    dcat:accessURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> ;
                    dcat:downloadURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> .
                `;
                const quads = parser.parse(data);
                const store = new Store(quads);

                const datasets: DcatDataset[] = await getDcatDatasets(store);

                const expectedDatasets: DcatDataset[] = [
                    {
                        iri: 'http://example.org/opendata/czech/births/czech-people-regions',
                        distributions: [
                            {
                                iri: 'http://example.org/opendata/czech/births/metadata/jsonld1-distribution',
                                mimeType: 'application/ld+json',
                                downloadUrl: 'https://example.com/aa.jsonld',
                                mediaType: 'https://www.iana.org/assignments/media-types/application/ld+json',
                            },
                            {
                                iri: 'http://example.org/opendata/czech/births/metadata/ttl1-distribution',
                                mimeType: 'text/turtle',
                                downloadUrl:
                                    'https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-people-dataset/output/czech-region-people-agg.ttl',
                                mediaType: 'https://www.iana.org/assignments/media-types/text/turtle',
                            },
                        ],
                    },
                    {
                        iri: 'http://example.org/opendata/czech/births/czech-birth-regions',
                        distributions: [
                            {
                                iri: 'http://example.org/opendata/czech/births/metadata/csv2-distribution',
                                mimeType: 'text/csv',
                                downloadUrl:
                                    'https://www.czso.cz/documents/10180/184344914/130141-22data2021.csv/a835923a-9dcc-4b23-a609-cad06188e4b4?version=1.1',
                                mediaType: 'http://www.iana.org/assignments/media-types/text/csv',
                            },
                            {
                                iri: 'http://example.org/opendata/czech/births/metadata/ttl2-distribution',
                                mimeType: 'text/turtle',
                                downloadUrl:
                                    'https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl',
                                mediaType: 'https://www.iana.org/assignments/media-types/text/turtle',
                            },
                        ],
                    },
                ];
                expect(datasets).toEqual(expectedDatasets);
            });
            test('NoDistribution', async () => {
                const parser = new Parser();
                const data = `
                @prefix ex: <http://example.org/opendata/czech/births/> . 
                @prefix ex-metadata: <http://example.org/opendata/czech/births/metadata/> .
                @prefix dcat: <http://www.w3.org/ns/dcat#> .
                @prefix dcterms: <http://purl.org/dc/terms/> .

                ex:anotherTriple a ex:Another .

                ex:czech-birth-regions a dcat:Dataset ;
                    dcterms:title "Live births values for regions in the Czech Republic."@en ;
                    dcterms:description "Live births values for regions in the Czech Republic."@en ;
                    dcat:theme <http://publications.europa.eu/resource/authority/data-theme/SOCI> ;
                    dcat:distribution ex-metadata:csv-distribution, ex-metadata:ttl-distribution ;
                    dcat:landingPage <https://www.czso.cz/csu/czso/pohyb-obyvatel-za-cr-kraje-okresy-so-orp-a-obce> .
                `;
                const quads = parser.parse(data);
                const store = new Store(quads);

                const datasets: DcatDataset[] = await getDcatDatasets(store);

                const expectedDatasets: DcatDataset[] = [];

                expect(datasets).toEqual(expectedDatasets);
            });
            test('NoDownloadUrl', async () => {
                const parser = new Parser();
                const data = `
                @prefix ex: <http://example.org/opendata/czech/births/> . 
                @prefix ex-metadata: <http://example.org/opendata/czech/births/metadata/> .
                @prefix dcat: <http://www.w3.org/ns/dcat#> .
                @prefix dcterms: <http://purl.org/dc/terms/> .

                ex:anotherTriple a ex:Another .

                ex:czech-birth-regions a dcat:Dataset ;
                    dcterms:title "Live births values for regions in the Czech Republic."@en ;
                    dcterms:description "Live births values for regions in the Czech Republic."@en ;
                    dcat:theme <http://publications.europa.eu/resource/authority/data-theme/SOCI> ;
                    dcterms:spatial <http://publications.europa.eu/resource/authority/country/CZE> ;
                    dcterms:language <http://publications.europa.eu/resource/authority/language/CES> ;
                    dcterms:accrualPeriodicity <http://publications.europa.eu/resource/authority/frequency/ANNUAL> ;
                    dcterms:publisher <https://www.czso.cz/> ;
                    dcat:distribution ex-metadata:ttl-distribution ;
                    dcat:landingPage <https://www.czso.cz/csu/czso/pohyb-obyvatel-za-cr-kraje-okresy-so-orp-a-obce> .

                ex-metadata:ttl-distribution a dcat:Distribution ;
                    dcterms:format <http://publications.europa.eu/resource/authority/file-type/RDF_TURTLE> ;
                    dcat:mediaType <https://www.iana.org/assignments/media-types/text/turtle> ;
                    dcterms:title "Live births values for regions in the Czech Republic in turtle."@en ;
                    dcat:accessURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> .
                `;
                const quads = parser.parse(data);
                const store = new Store(quads);

                const datasets: DcatDataset[] = await getDcatDatasets(store);

                const expectedDatasets: DcatDataset[] = [];
                expect(datasets).toEqual(expectedDatasets);
            });
            test('NoMediaType', async () => {
                const parser = new Parser();
                const data = `
                @prefix ex: <http://example.org/opendata/czech/births/> . 
                @prefix ex-metadata: <http://example.org/opendata/czech/births/metadata/> .
                @prefix dcat: <http://www.w3.org/ns/dcat#> .
                @prefix dcterms: <http://purl.org/dc/terms/> .

                ex:anotherTriple a ex:Another .

                ex:czech-birth-regions a dcat:Dataset ;
                    dcterms:title "Live births values for regions in the Czech Republic."@en ;
                    dcterms:description "Live births values for regions in the Czech Republic."@en ;
                    dcat:theme <http://publications.europa.eu/resource/authority/data-theme/SOCI> ;
                    dcterms:spatial <http://publications.europa.eu/resource/authority/country/CZE> ;
                    dcterms:language <http://publications.europa.eu/resource/authority/language/CES> ;
                    dcterms:accrualPeriodicity <http://publications.europa.eu/resource/authority/frequency/ANNUAL> ;
                    dcterms:publisher <https://www.czso.cz/> ;
                    dcat:distribution ex-metadata:ttl-distribution ;
                    dcat:landingPage <https://www.czso.cz/csu/czso/pohyb-obyvatel-za-cr-kraje-okresy-so-orp-a-obce> .

                ex-metadata:ttl-distribution a dcat:Distribution ;
                    dcterms:format <http://publications.europa.eu/resource/authority/file-type/RDF_TURTLE> ;
                    dcterms:title "Live births values for regions in the Czech Republic in turtle."@en ;
                    dcat:accessURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> ;
                    dcat:downloadURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> .
                `;
                const quads = parser.parse(data);
                const store = new Store(quads);

                const datasets: DcatDataset[] = await getDcatDatasets(store);

                const expectedDatasets: DcatDataset[] = [];
                expect(datasets).toEqual(expectedDatasets);
            });
            test('NoDatasetType', async () => {
                const parser = new Parser();
                const data = `
                @prefix ex: <http://example.org/opendata/czech/births/> . 
                @prefix ex-metadata: <http://example.org/opendata/czech/births/metadata/> .
                @prefix dcat: <http://www.w3.org/ns/dcat#> .
                @prefix dcterms: <http://purl.org/dc/terms/> .

                ex:anotherTriple a ex:Another .

                ex:czech-birth-regions
                    dcat:distribution ex-metadata:csv-distribution, ex-metadata:ttl-distribution ;
                    dcat:landingPage <https://www.czso.cz/csu/czso/pohyb-obyvatel-za-cr-kraje-okresy-so-orp-a-obce> .

                ex-metadata:ttl-distribution a dcat:Distribution ;
                    dcterms:format <http://publications.europa.eu/resource/authority/file-type/RDF_TURTLE> ;
                    dcterms:title "Live births values for regions in the Czech Republic in turtle."@en ;
                    dcat:mediaType <https://www.iana.org/assignments/media-types/text/turtle> ;
                    dcat:accessURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> ;
                    dcat:downloadURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> .
                `;
                const quads = parser.parse(data);
                const store = new Store(quads);

                const datasets: DcatDataset[] = await getDcatDatasets(store);

                const expectedDatasets: DcatDataset[] = [];
                expect(datasets).toEqual(expectedDatasets);
            });
            test('DatasetBlankNode', async () => {
                const parser = new Parser();
                const data = `
                @prefix ex: <http://example.org/opendata/czech/births/> . 
                @prefix ex-metadata: <http://example.org/opendata/czech/births/metadata/> .
                @prefix dcat: <http://www.w3.org/ns/dcat#> .
                @prefix dcterms: <http://purl.org/dc/terms/> .

                ex:anotherTriple a ex:Another .

                _:dataset a dcat:Dataset ;
                    dcterms:title "Live births values for regions in the Czech Republic."@en ;
                    dcterms:description "Live births values for regions in the Czech Republic."@en ;
                    dcat:theme <http://publications.europa.eu/resource/authority/data-theme/SOCI> ;
                    dcterms:spatial <http://publications.europa.eu/resource/authority/country/CZE> ;
                    dcterms:language <http://publications.europa.eu/resource/authority/language/CES> ;
                    dcterms:accrualPeriodicity <http://publications.europa.eu/resource/authority/frequency/ANNUAL> ;
                    dcterms:publisher <https://www.czso.cz/> ;
                    dcat:distribution ex-metadata:csv-distribution, ex-metadata:ttl-distribution ;
                    dcat:landingPage <https://www.czso.cz/csu/czso/pohyb-obyvatel-za-cr-kraje-okresy-so-orp-a-obce> .

                ex-metadata:csv-distribution a dcat:Distribution ;
                    dcterms:title "Live births values for regions in the Czech Republic in csv."@en ;
                    dcterms:format <http://publications.europa.eu/resource/authority/file-type/CSV> ;
                    dcat:mediaType <http://www.iana.org/assignments/media-types/text/csv> ;
                    dcat:accessURL <https://www.czso.cz/documents/10180/184344914/130141-22data2021.csv/a835923a-9dcc-4b23-a609-cad06188e4b4?version=1.1> ;
                    dcat:downloadURL <https://www.czso.cz/documents/10180/184344914/130141-22data2021.csv/a835923a-9dcc-4b23-a609-cad06188e4b4?version=1.1> .

                ex-metadata:ttl-distribution a dcat:Distribution ;
                    dcterms:format <http://publications.europa.eu/resource/authority/file-type/RDF_TURTLE> ;
                    dcat:mediaType <https://www.iana.org/assignments/media-types/text/turtle> ;
                    dcterms:title "Live births values for regions in the Czech Republic in turtle."@en ;
                    dcat:accessURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> ;
                    dcat:downloadURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> .
                `;
                const quads = parser.parse(data);
                const store = new Store(quads);

                const datasets: DcatDataset[] = await getDcatDatasets(store);

                const expectedDatasets: DcatDataset[] = [];
                expect(datasets).toEqual(expectedDatasets);
            });
            test('DistributionBlankNode', async () => {
                const parser = new Parser();
                const data = `
                @prefix ex: <http://example.org/opendata/czech/births/> . 
                @prefix ex-metadata: <http://example.org/opendata/czech/births/metadata/> .
                @prefix dcat: <http://www.w3.org/ns/dcat#> .
                @prefix dcterms: <http://purl.org/dc/terms/> .

                ex:anotherTriple a ex:Another .

                ex:czech-birth-regions a dcat:Dataset ;
                    dcterms:accrualPeriodicity <http://publications.europa.eu/resource/authority/frequency/ANNUAL> ;
                    dcterms:publisher <https://www.czso.cz/> ;
                    dcat:distribution _:ttl-distribution ;
                    dcat:landingPage <https://www.czso.cz/csu/czso/pohyb-obyvatel-za-cr-kraje-okresy-so-orp-a-obce> .
        
                _:ttl-distribution a dcat:Distribution ;
                    dcterms:format <http://publications.europa.eu/resource/authority/file-type/RDF_TURTLE> ;
                    dcat:mediaType <https://www.iana.org/assignments/media-types/text/turtle> ;
                    dcterms:title "Live births values for regions in the Czech Republic in turtle."@en ;
                    dcat:accessURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> ;
                    dcat:downloadURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> .
                `;
                const quads = parser.parse(data);
                const store = new Store(quads);

                const datasets: DcatDataset[] = await getDcatDatasets(store);

                const expectedDatasets: DcatDataset[] = [];
                expect(datasets).toEqual(expectedDatasets);
            });
            test('DownloadUrlIsLiteral', async () => {
                const parser = new Parser();
                const data = `
                @prefix ex: <http://example.org/opendata/czech/births/> . 
                @prefix ex-metadata: <http://example.org/opendata/czech/births/metadata/> .
                @prefix dcat: <http://www.w3.org/ns/dcat#> .
                @prefix dcterms: <http://purl.org/dc/terms/> .

                ex:anotherTriple a ex:Another .

                ex:czech-birth-regions a dcat:Dataset ;
                    dcterms:title "Live births values for regions in the Czech Republic."@en ;
                    dcterms:description "Live births values for regions in the Czech Republic."@en ;
                    dcat:distribution ex-metadata:ttl-distribution ;
                    dcat:landingPage <https://www.czso.cz/csu/czso/pohyb-obyvatel-za-cr-kraje-okresy-so-orp-a-obce> .

                ex-metadata:ttl-distribution a dcat:Distribution ;
                    dcterms:format <http://publications.europa.eu/resource/authority/file-type/RDF_TURTLE> ;
                    dcat:mediaType <https://www.iana.org/assignments/media-types/text/turtle> ;
                    dcterms:title "Live births values for regions in the Czech Republic in turtle."@en ;
                    dcat:accessURL <https://raw.githubusercontent.com/georgeus19/NSWI144/main/triplification/czech-region-births-dataset/output/czech-region-births-agg.ttl> ;
                    dcat:downloadURL "niceLiteral" .
                `;
                const quads = parser.parse(data);
                const store = new Store(quads);

                const datasets: DcatDataset[] = await getDcatDatasets(store);

                const expectedDatasets: DcatDataset[] = [];
                expect(datasets).toEqual(expectedDatasets);
            });
        });
    });
});
