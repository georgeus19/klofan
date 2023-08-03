# Statistical Data Use Case
In this use case, a user wants to convert their statistical csv data about czech regions to rdf so that entities and properties are from known vocabularies and ideally done correctly.

This is a follow up to the food use case so there will be a lot of steps skipped and the focus will be on a vocabulary specific type recommendation rather than on general purspose recommendation which was showcased in the food use case.

The look the following way:
```csv
Kód území,Region soudržnosti,Pocet celkem,Pocet muži,Pocet ženy,Prumerny vek celkem,Prumerny vek muži,Prumerny vek ženy,typ
CZ0,Česko,10494836,5170902,5323934,42.7,41.3,44.2,zeme
CZ010,Hlavní město Praha,1259413,613316,646097,42.4,40.8,43.8,kraj
CZ020,Středočeský kraj,1372588,678250,694338,41.5,40.2,42.7,kraj
CZ031,Jihočeský kraj,636422,314988,321434,43.1,41.8,44.3,kraj
CZ032,Plzeňský kraj,576358,285530,290828,43.1,41.8,44.3,kraj
```

## Use Case 
![Initial Schema Of Loaded Data](./img/stat-initial-schema.png)
![Region Recommendation](./img/region-recommendation.png)
![Schema After Retion Recommendation](./img/after-region.png)
![Recommendation - Select Dimensions](./img/select-dims.png)
![Final Schema](./img/final-stat-schema.png)