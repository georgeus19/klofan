# Klofan

##  Docker Run

There is a `compose.yaml` file which is responsible for building and running all databases and 
services. Just run it. Any stored data are persisted in docker partitions.

```
# Copy env variable file - must be in the root dir and named '.docker-env'
cp ./data/example/docker-env ./.docker-env

# Build images - needs to download a lot of packages.
# It can happen that network is slow and npm install seems to never end - run the command again.
sudo docker compose build --no-cache

sudo docker compose up
```

## Dev Run

```
# Copy configuration for development - shoud be in root as '.env'
cp ./data/example/dev-env ./.env

# Run databases in docker.
sudo docker compose -f db-compose.yaml up

# Wait until databases are running.
# Install dependencies and run services in dev mode.
npm ci # or npm install
npm run dev
```

## Example
Upload `data/example/catalog.ttl` to catalog service. It should be to
`http://localhost:7000/rdf-graph-store?default` if no changes were made. The endpoint supports 
the sparql endpoint protocol and serves as proxy for Virtuoso. 

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


## Configuration
Analyzers can be disabled/enabled by commenting/uncommenting env variables with prefices
ANALYZERS or RECOMMENDERS.

TODO