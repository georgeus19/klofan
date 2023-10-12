# Prototype for parsing, changing and exporting data.

## JSON example

Run the following to load json data, move property `countries` from `product` to `nutriments` and export schema and its instances to turtle - generates `instances.ttl`, `schema.ttl` in the `$(pwd)/data/json`

```
npm run start $(pwd)/data/json/input.json $(pwd)/data/json
```

## CSV

Run the following to load csv data and just export them. Also generates `instances.ttl` and `schema.ttl` in `$(pwd)/data/csv`.

```
npm run start $(pwd)/data/csv/input.csv $(pwd)/data/csv csv
```
