# Klofan [![klofan.linkedpipes.com](https://img.shields.io/badge/-klofan.linkedpipes.com-informational)](https://klofan.linkedpipes.com/) 
A system for interactive transformation of structured data to RDF

# Table of Contents

-   [What is Klofan](#what-is-klofan) - description of the system
-   [Structure](#structure) - repository structure
-   [Build & Run](#build--run) - guide for running the system using docker or npm (for
    development).

## What is Klofan?

Klofan allows users to upload structured data (e.g. JSON) and semiautomatically transform them to RDF based on the schema of the data. The workflow can be manual resembling in nature CAD programs. The system also provides recommended transformations based on the uploaded data. Such recommendations can change the structure of the data, add URIs (classes, predicates), etc...

It was developed initially for master thesis. See the [thesis PDF text](https://dspace.cuni.cz/bitstream/handle/20.500.11956/190684/120477016.pdf?sequence=1&isAllowed=y) for more information about background, design, implementation or use cases in more detail.

## Structure

The entire system is written in TypeScript and is managed as a monorepo using Turborepo. The system is mainly contained in the following three directories.

-   [apps](./apps) - web and command line apps
-   [databases](./databases) - scripts for running databases
-   [packages](./packages) - internal libraries used by apps

Check out the individual projects' READMEs for more information.

## Build & Run

### Docker

There is a `compose.yaml` file which is responsible for building and running all databases and
services. Just run it. Any stored data are persisted in docker partitions.

```
# Copy env variable file - must be in the root dir and named '.docker-env'
cp ./data/example/docker-env ./.docker-env

# Build images - needs to download a lot of packages.
# It can happen that network is slow and npm install seems to never end - run the command again.
 sudo docker compose --env-file .docker-env build --no-cache

sudo docker compose --env-file .docker-env  up
```

### Development

```
# Copy configuration for development - shoud be in root as '.env'
cp ./data/example/dev-env ./.env

# Run databases in docker.
sudo docker compose -f db-compose.yaml --env-file .env up

# Wait until databases are running.
# Install dependencies and run services in dev mode.
npm ci # or npm install
npm run dev
```

## Example

Upload `data/example/catalog.ttl` to catalog service. It should be to
`http://localhost:7000/rdf-graph-store?default` if no changes were made. The endpoint supports
the sparql endpoint protocol and serves as proxy for Virtuoso.

```bash
curl --verbose --url "http://localhost:7000/rdf-graph-store?default" -X POST -T data/example/catalog.ttl
```

Any datasets are analysed by all enabled analyzers and analyses saved using analysis-store.

When all analyzers are done, open localhost/index.html and import `data/example/food.json`. It
contains food data for which there are recommendations to try the app on.

```json
[
    {
        "product": {
            "_id": "0737628064502",
            "product_name": "Thai peanut noodle kit",
            "countries": ["United States"],
            "nutriments": {
                "carbohydrates_100g": 71.15,
                "carbohydrates_unit": "g",
                "energy-kcal_100g": 385,
                "energy-kcal_unit": "kcal"
            }
        }
    }
]
```

It can be transformed to the following:

```turtle
@prefix gr: <http://purl.org/goodrelations/v1#> .
@prefix food: <http://purl.org/foodontology#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix schema: <http://schema.org/> .

@prefix ex: <http://example.org/> .

ex:noodles a food:Food ;
    schema:productID "0737628064502"^^xsd:string ;
    gr:name "Thai peanut noodle kit"@en ;
    ex:soldInCountries <http://publications.europa.eu/resource/authority/country/USA> ;
    food:carbohydratesPer100g [
        a gr:QuantitativeValueFloat;
        gr:hasUnitOfMeasurement "GRM"^^xsd:string;
        gr:hasValueFloat 71.15
    ] ;
    food:energyPer100g [
        a gr:QuantitativeValueFloat;
        gr:hasUnitOfMeasurement "K51"^^xsd:string;
        gr:hasValueFloat 385.0
    ] .
```
