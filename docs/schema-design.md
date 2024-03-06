# Zadani

Jednim z cilu me diplomky je vytvorit program, kam uzivatel nacte data s vidinou transformace dat to rdf tak, aby byla data reprezentovana pomoci vhodnych pojmu z uz existujicich slovniku. Program vhodne slovnikove pojmy spolu s moznou transformaci struktury dat uzivateli doporucuje. Obrazkovy use case je zde: https://github.com/georgeus19/MastersThesis/blob/main/docs/use-cases/food-use-case.md

Ukolem je rucne simulovat praci dp programu na malych datech dole. Jde o to navrhnout model/schema pro reprezentaci dat (vstupni data, uz trochu premodelovana data) a v ramci simulace se zamyslet nad nasledujicimi otazkami. Jak se bude s modelem pracovat - api pro pristup k datum, transformaci dat, pamatovani stavu, ...? V datech se mohou detektovat optional property, syntakticke vlastnosti (e.g. typy), semanticke vlastnosti. Kdy se detekuji a jak se vyuziji? Jak vypada api pro doporucovaci metodu, ktera nabizi uzivateli transformacni operaci nad modelem (doporuceni slovnikoveho pojmu, doporuceni zmeny struktury, ...) a kterou je mozno dodat jako plugin?

Jedna se o data o produktech prodavanych v supermarketu.

```json
[
    {
        "product": {
            "product_name": "Thai peanut noodle kit includes stir-fry rice noodles & thai peanut seasoning",
            "countries": "United States",
            "ingredients": [
                {
                    "id": "en:noodle",
                    "has_sub_ingredients": "yes",
                    "percent_estimate": 53.8461538461538,
                    "text": "Noodle"
                },
                {
                    "id": "en:water",
                    "percent_estimate": 23.0769230769231,
                    "text": "water",
                    "vegan": "yes",
                    "vegetarian": "yes"
                }
            ],
            "nutriments": {
                "calcium_100g": 0.038,
                "calcium_unit": "mg",
                "carbohydrates_100g": 71.15,
                "carbohydrates_unit": "g",
                "energy-kcal_100g": 385,
                "energy-kcal_unit": "kcal"
            }
        }
    }
]
```

# Reseni

Schema dat je tvoreno jednak popisem struktury (EntitySet, PropertySet, LiteralSet), tak daty takovymi (\*Instance). Struktura je popsana co nejjednodusse. Modifikace nad modelem se musi provadet pres preddefinovane operace, ktere zachazi s modelem tak, aby slo prochazet stavy modelu do minulosti a zpet. Tyhle operace tedy pouziva uzivatel a i doporuceni. Doporuceni jsou rozdeleny na Recommender, ktery na zaklade modelu generuje doporuceni - Recommendation, ktere uz obsahuje operace k modifikaci schema.

```ts
interface EntitySet {
    id: string;
    properties: PropertySet[];

    getInstances(): EntityInstance[];
}
interface PropertySet {
    id: string;
    name: string;
    uri: string;
    value: EntitySet | LiteralSet;

    getInstances(): (EntityInstance, EntityInstance)[] | (EntityInstance, LiteralInstance)[];
    getInstances(entity): EntityInstance[] | LiteralInstance[];
}
interface LiteralSet {
    id: string;
    getInstances(): LiteralInstance[];
}

interface EntityInstance {
    id: string;
    uri: string;
}
interface Property {
    id: string;
    uri: string;
}
interface LiteralInstance {
    id: string;
    uri: string;
}

interface InstanceStore {
    // Store for data in the form of EntityInstance, Property, LiteralInstance.
}

interface BaseModel {
    entities: EntitySet[];
    properties: PropertySet[];

    // Send info to all analyzers when base model changes about what changed.
    analyzers: Analyzer[];
}

// Represents operation which can performed on the schema - user by both recommendations and users.
interface Operation {
    // Updates operation
    private model: BaseModel;
    // Links to old parts of the schema that were replaced by this operation.
    previous: [Any];
    // Get parts of the schema that were somehow changed in this operation.
    getChangedSchemaParts(): (EntitySet | PropertySet | LiteralSet)[];
    // Make requested change to the schema by cloning all related parts of the schema
    // and changing them.
    execute(): void;
}
class AggregateOperation implements Operation {}
class MovePropertyOperation implements Operation {}
class AddPropertyOperation implements Operation {}
class AddEntityOperation implements Operation {}
class RelinkPropertyOperation implements Operation {}

// Analyzer here just represents an entity built on top of the base model
// which add more information about hte model and the model sends any schema
// changes to the analyzer so that it can keep its values up to date.
interface Analyzer {
    getSchemaChanges(changes): void;
}
interface TypeDetector extends Analyzer {
    getType(property): Type;
}
interface OptionalPropertiesDetector extends Analyzer {
    isOptional(property): boolean;
}
interface MultipleObjectValuesDetector extends Analyzer {
    isSingleValue(property): boolean;
    isSetValue(property): boolean;
}
interface SubsetDetector extends Analyzer {
    getPotentialSubsets(entity): Subset[];
    getPotentialSubsets(property): Subset[];
}

interface Recommender {
    model: BaseModel;
    analyzer: Analyzer;

    recommend(): Recommendation[];
}

interface Recommendation {
    operations: Operation[];
    detectionInfo: Any;
}
```

```ts
// Initial schema example;
productEntity1 = {
    properties: [productNameProperty1, countriesProperty1, ingredientsProperty1, nutrimentsProperty1],
    getInstances() { return [ { id: "TN1" } as EntityInstance]}
} as EntitySet;

nutrimentsEntity1 = {
    properties: [calcium100gProperty1, calciumUnitProperty1]
} as EntitySet;

productNameProperty1 = { value: productNameLiteral, name: "product_name" } as PropertySet;
countriesProperty1 = { value: countriesLiteral1, name: "countries" } as PropertySet;
calcium100gProperty1 = { value: calcium100gLiteral1, name: "calcium_100g" } as PropertySet;
calciumUnitProperty1 = { value: calciumUnitLiteral1, name: "calcium_unit" } as PropertySet;

productNameLiteral = {} as LiteralSet;
countriesLiteral1 = {} as LiteralSet;
calcium100gLiteral1 = {} as LiteralSet;
calciumUnitLiteral1 = {} as LiteralSet;

// Map country literal to publications europa country uri.
// Add entity, relink property operations.

productEntity2 = {
    properties: [productNameProperty1, countriesProperty2, ingredientsProperty1, nutrimentsProperty1],
    getInstances() { return [ { id: "TN2" } as EntityInstance]}
} as EntitySet;

countriesEntity1 = {
    getInstances() { return [ { id: "CE1" as EntityInstance, uri: "http://publications.europa.eu/resource/authority/country/USA" } as EntityInstance ]}
} as EntitySet;

countriesProperty2 = {
    value: countriesEntity1,
    name: "countries",
    getInstances() { return [({ id: "TN2" } as EntityInstance, { id: "CE1", uri: "http://publications.europa.eu/resource/authority/country/USA" } as EntityInstance)]}
} as PropertySet;

// Add property to nutriments `rdf:type http://aims.fao.org/aos/agrovoc/c_10961`.
// Add property operations.

nutrimentsEntity2 = {
    properties: [calcium100gProperty1, calciumUnitProperty1, agrovocTypeProperty1]
} as EntitySet;

agrovocEntity1 = {
    getInstances() { return [{ id: "A1", uri: "http://aims.fao.org/aos/agrovoc/c_10961"}]}
} as EntitySet;

agrovocTypeProperty1 = {
    value: agrovocEntity1,
    getInstances() { return [({ id: "N1" }, { id: "A1", uri: "http://aims.fao.org/aos/agrovoc/c_10961"})]}
}

// Represents operation which can performed on the schema - user by both recommendations and users.
addPropertyOperation = {
    // Updates operation
    private model: BaseModel;
    // Links to old parts of the schema that were replaced by this operation.
    previous = [ nutrimentsEntity1 ];
    // Get parts of the schema that were somehow changed in this operation.
    getChangedSchemaParts() { return previous; }
    // Make requested change to the schema by cloning all related parts of the schema
    // and changing them.
    execute(): void;
} as Operation;

```
