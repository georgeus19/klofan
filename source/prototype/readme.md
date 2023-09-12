# Prototype

Zkusil jsem implementovat myslenku prace se schematem a daty dle (https://github.com/georgeus19/MastersThesis/blob/main/docs/schema-design.md)[meho navrhu z minula]. Zamerne jsem se pokousel implementovat to tak, jak jsem si to predtim predstavoval. Pri implementaci jsem nasel ruzne problemy a alternativy, tak mam v planu pokracovat a cele to trochu upravit.

## Implementace

Dulezite kriterium bylo pro me zjistit, zda a jak lze zajistit uchovani stavu a prochazeni tam a zpet v historii, tak aby nemuselo byt kopirovane cele schema a vsechna data pri kazde operaci. Protoze navic data mohou byt velka, rozhodl jsem se oddelit implementaci ulozeni schema a dat.

Pristup ke schematu reprezentuje `interface ISchemaModel` a k instancim `interface IInstanceModel` (viz nize). Oba modely poskytuji pristup k entitam, propertam a literalum ve schematu ci instancich, coz jsou vsechno immutable objekty poskytujici info o sobe. `IInstanceModel` je jeste schopen poskytnout instance entit, propert ci literalu pro entity, property ci literaly ze schematu.

Zmeny ve schema nebo instancich se delaji jen pomoci trid implementujici `interface Command`. Ten zatim s jedinou metodou `execute` vrati nove instance jak `ISchemaModel` tak `IInstanceModel`, ktere reflektuji data po zmene, kterou `Command` reprezentuje. Vsechny objekty pro reprezentaci entit, propert a literalu jsou navrzeny jako immutable a zmenit je je mozne jen pomoci zkopirovani a definovanych operacich na nich (vice pozdeji). `Command` typicky vytvori updatovane kopie vsechno co chce zmenit a nasazi tyto kopie to novych `ISchemaModel` a `IInstanceModel`. `Command` do implementaci techto rozhrani preda doted nejaktualnejsi instance modelu, ktere pozkytuji vsechny informace o starsi verzi dat. Pri zavolani noveho modelu novy model zkontroluje, zda se klient pta na jim zmenene objekty a pokud ne, tak volani forwarduje do starsiho modelu.

Pri zmenach se tedy vytvori retez verzi modelu a klient si muze vybrat, kam kouka. Tady si predstavuji, ze bude existovat nejaky objekt, ktery bude drzet pole poslednich modelu nebo pripadne commandu s trochu pozmenenych interfacem.

Pri hodne zmenach retez bude dlouhy a ziskani od zacatku nezmenenych dat pomale, proto si jeste predstavuju funkcionalitu, ktera dokaze mergovat modely do sebe.

Implementace jsou spolu s dalsimi tridami pro schema, resp. instance, v (./schema.ts)[`schema.ts`], resp. (./instance.ts)[`instance.ts`]. Commandy v (./command.ts)[`command.ts`].

```ts
/**
 * Interace for commands (actions) which modify the current schema or instances (=data).
 */
export interface Command {
    execute(): [ISchemaModel, IInstanceModel];
}
export class MovePropertyCommand implements Command {}

/**
 * Interface for accessing schema. When a change is done to schema, new schema model is created representing
 * the schema after the change. This new schema model remembers old schema model before the change was done as base model.
 */
export interface ISchemaModel {
    entities(): IEntity[];
    properties(): IProperty[];
    literals(): ILiteral[];
    entity(id: string): IEntity | null;
    property(id: string): IProperty | null;
    literal(id: string): ILiteral | null;
    getBaseSchemaModel(): ISchemaModel | null;
}

/**
 * Interface for a model which provides access for instances (=data) in one time between change commands.
 * When a change to instances is done, new instance model is created reflecting the new state and
 * pointing to this instance as base instance model.
 */
export interface IInstanceModel {
    // Get instances of given entity.
    getEntities(entity: IEntity): IEntityInstance[];
    // Get property instance for given entity instance and proeprty from schema.
    getProperty(entity: IEntityInstance, property: IProperty): IPropertyInstance;
    entities(): IEntityInstance[];
    properties(): IPropertyInstance[];
    literals(): ILiteralInstance[];
    entity(id: string): IEntityInstance;
    property(id: string): IPropertyInstance;
    literal(id: string): ILiteralInstance;
    safeEntity(id: string): IEntityInstance | null;
    safeProperty(id: string): IPropertyInstance | null;
    safeLiteral(id: string): ILiteralInstance | null;
    // This base model has contains all data before the current instance changes were applied.
    getBaseInstanceModel(): IInstanceModel | null;
}
```

### Entity, Property, Literaly

Nize jsou videt interfacy a implementace entit, propert a literalu pro schema. Interface jednak specifikuje operace pro ziskani informaci o danem objektu a dale poskytuje modifikujici operace, ktere vraceji "shallow copy" s danou modifikaci. Nove kopie se pak mohou davat do instanci novych modelu. Dulezite je, ze se pri kopirovani nemeni ID - kazda verze ma vzdy stejne ID a dle techto ID si modely ukladaji, jake objekty ze zmenili oproti predchozimu modelu (base model) v rezezci predchozich modelu. Co se tyce implementace, tak si kazda instance drzi referenci na model, do ktereho patri. Ten vyuziva k ziskani objektu propert v pripade entit a nebo hodnot v pripade propert. Sami si objekty pamatuji jen idicka, ne reference na objekty samotne. To by pak bylo nutne kopirovat iterativne cele schema pri zmene - napr. zmena property vyzaduje modifikaci entity, ve ktere je. Pokud chceme entitu immutable, tak se musi vytvorit dalsi. Tedy by bylo nutne zmenit property, ktere odkazovali na tu entitu, tak, aby odkazovaly na entitu novou, atd...

Co se tyce pojmenovani, tak mam rad vytvareni interfacu, i kdyz bude mit interface hlavni implementaci, z duvodu lehci testovatelnosti, mockovatelnosti a z toho duvodu, ze se ty interfacy treba jeste rozpadnou na mensi a neni potreba vse na vsech mistech menit, etc...

```ts
export interface IEntity {
    getId(): string;
    addProperty(schemaModel: ISchemaModel, property: IProperty): IEntity;
    removeProperty(schemaModel: ISchemaModel, property: IProperty): IEntity;
    getProperties(): IProperty[];
}

export class Entity implements IEntity {
    constructor(
        private schemaModel: ISchemaModel,
        private id: string,
        private propertyIds: string[]
    ) {}

    getId(): string {
        return this.id;
    }

    addProperty(schemaModel: ISchemaModel, property: IProperty): IEntity {
        const clone = this.clone(schemaModel);
        clone.propertyIds.push(property.getId());
        return clone;
    }

    removeProperty(schemaModel: ISchemaModel, property: IProperty): IEntity {
        const clone = this.clone(schemaModel);
        clone.propertyIds = clone.propertyIds.filter((propertyId) => propertyId !== property.getId());
        return clone;
    }

    getProperties(): IProperty[] {
        return this.propertyIds.map((propertyId) => this.schemaModel.property(propertyId)).filter((property) => property != null) as IProperty[];
    }

    private clone(schemaModel: ISchemaModel): Entity {
        return new Entity(schemaModel, this.id, [...this.propertyIds]);
    }
}

export interface IProperty {
    getId(): string;
    getUri(): string | undefined;
    getName(): string;
    getValue(): IEntity | ILiteral;
    changeValue(schemaModel: ISchemaModel, value: IEntity | ILiteral): IProperty;
}

export class Property implements IProperty {
    constructor(
        private schemaModel: ISchemaModel,
        private id: string,
        private name: string,
        private valudId: string,
        private uri?: string
    ) {}

    getId(): string {
        return this.id;
    }

    getUri(): string | undefined {
        return this.uri;
    }

    getName(): string {
        return this.name;
    }

    getValue(): IEntity | ILiteral {
        throw new Error('Method not implemented.');
    }

    changeValue(schemaModel: ISchemaModel, value: IEntity | ILiteral): IProperty {
        const clone = this.clone(schemaModel);
        clone.valudId = value.getId();
        throw new Error('Method not implemented.');
    }

    private clone(schemaModel: ISchemaModel): Property {
        return new Property(schemaModel, this.id, this.name, this.valudId);
    }
}

export interface ILiteral {
    getId(): string;
}

export class Literal implements ILiteral {
    constructor(private id: string) {}
    getId(): string {
        return this.id;
    }
}
```

Rozhrani a implementace instanci entit, propert a literalu jsou dost podobne jako u schema - podobne zmeny je pri stejne operaci (command), ktera zasahuje i do instanci, delat i tady. Uvazuji nad nejakym spojenim, ale pro jednoduchost je vse zatim oddelene.

```ts
export interface IEntityInstance {
    getId(): string;
    getUri(): string | undefined;
    addProperty(instanceModel: IInstanceModel, property: IPropertyInstance): IEntityInstance;
    removeProperty(instanceModel: IInstanceModel, property: IPropertyInstance): IEntityInstance;
    getProperties(): IPropertyInstance[];
}

export class EntityInstance implements IEntityInstance {
    constructor(
        private instanceModel: IInstanceModel,
        private id: string,
        private propertyIds: string[],
        private uri?: string
    ) {}

    getId(): string {
        return this.id;
    }

    getUri(): string | undefined {
        return this.uri;
    }

    addProperty(instanceModel: IInstanceModel, property: IPropertyInstance): IEntityInstance {
        const clone = this.clone(instanceModel);
        clone.propertyIds.push(property.getId());
        return clone;
    }

    removeProperty(instanceModel: IInstanceModel, property: IPropertyInstance): IEntityInstance {
        const clone = this.clone(instanceModel);
        clone.propertyIds = clone.propertyIds.filter((propertyId) => propertyId !== property.getId());
        return clone;
    }

    getProperties(): IPropertyInstance[] {
        return this.propertyIds.map((propertyId) => this.instanceModel.property(propertyId));
    }

    private clone(instanceModel: IInstanceModel): EntityInstance {
        return new EntityInstance(instanceModel, this.id, [...this.propertyIds]);
    }
}

export interface IPropertyInstance {
    getId(): string;
    getValue(): IEntityInstance | ILiteralInstance;
}

export class PropertyInstance implements IPropertyInstance {
    constructor(
        private instanceModel: IInstanceModel,
        private id: string,
        private valueId: string
    ) {}

    getId(): string {
        return this.id;
    }

    getValue(): IEntityInstance | ILiteralInstance {
        throw new Error('Method not implemented.');
    }
}

export interface ILiteralInstance {
    getId(): string;
    getValue(): string;
    getType(): string | undefined;
}

export class LiteralInstance implements ILiteralInstance {
    constructor(
        private id: string,
        private value: string,
        private type?: string
    ) {}

    getId(): string {
        return this.id;
    }

    getValue(): string {
        return this.value;
    }

    getType(): string | undefined {
        return this.type;
    }
}
```

### Priklad pouziti commandu nad schematem:

Dole je priklad aplikovani zmeny property ve schematu i datech. Bohuzel neni jak moc pekne graficky zobrazovat vysledky... Tenhle priklad se spusti s `npm run start` a je ulozen v [./main.ts](`main.ts`).

```ts
/**
 * {
 *      name: 'noodles',
 *      calcium_100g: '20',
 *      nutrients: {
 *          magnesium_100g: '30'
 *      }
 * }
 * TO
 * {
 *      name: 'noodles',
 *      nutrients: {
 *          calcium_100g: '20',
 *          magnesium_100g: '30'
 *      }
 * }
 */

const schema = new SchemaModel(null);
const nameLiteral = new Literal('10');
const nameProperty = new Property(schema, '100', 'name', nameLiteral.getId());
const calciumLiteral = new Literal('11');
const calciumProperty = new Property(schema, '101', 'calcium_100g', calciumLiteral.getId());
const magnesiumLiteral = new Literal('12');
const magnesiumProperty = new Property(schema, '102', 'magnesium_100g', magnesiumLiteral.getId());

const nutrientsEntity = new Entity(schema, '1', [magnesiumProperty.getId()]);
const nutrientsProperty = new Property(schema, '103', 'nutrients', nutrientsEntity.getId());
const productEntity = new Entity(schema, '2', [nameProperty.getId(), calciumProperty.getId(), nutrientsProperty.getId()]);

schema.addLiteral(nameLiteral);
schema.addLiteral(calciumLiteral);
schema.addLiteral(magnesiumLiteral);

schema.addProperty(nameProperty);
schema.addProperty(calciumProperty);
schema.addProperty(magnesiumProperty);
schema.addProperty(nutrientsProperty);

schema.addEntity(nutrientsEntity);
schema.addEntity(productEntity);

const instanceSchema = new InMemoryInstanceModel(null);
const noodlesInstanceLiteral = new LiteralInstance('10', 'noodles');
const noodlesInstanceProperty = new PropertyInstance(instanceSchema, '100', noodlesInstanceLiteral.getId());
const calciumInstanceLiteral = new LiteralInstance('11', '20');
const calciumInstanceProperty = new PropertyInstance(instanceSchema, '101', calciumInstanceLiteral.getId());
const magnesiumInstanceLiteral = new LiteralInstance('12', '30');
const magnesiumInstanceProperty = new PropertyInstance(instanceSchema, '102', magnesiumInstanceLiteral.getId());

const nutrientsInstanceEntity = new EntityInstance(instanceSchema, '1', [magnesiumInstanceProperty.getId()]);
const nutrientsInstanceProperty = new PropertyInstance(instanceSchema, '103', nutrientsInstanceEntity.getId());
const productInstanceEntity = new EntityInstance(instanceSchema, '2', [
    noodlesInstanceProperty.getId(),
    calciumInstanceProperty.getId(),
    nutrientsInstanceProperty.getId(),
]);

instanceSchema.addLiteral(noodlesInstanceLiteral);
instanceSchema.addLiteral(calciumInstanceLiteral);
instanceSchema.addLiteral(magnesiumInstanceLiteral);

instanceSchema.addProperty(nameProperty, noodlesInstanceProperty);
instanceSchema.addProperty(calciumProperty, calciumInstanceProperty);
instanceSchema.addProperty(magnesiumProperty, magnesiumInstanceProperty);
instanceSchema.addProperty(nutrientsProperty, nutrientsInstanceProperty);

instanceSchema.addEntity(nutrientsEntity, nutrientsInstanceEntity);
instanceSchema.addEntity(productEntity, productInstanceEntity);

const moveCommand = new MovePropertyCommand(schema, instanceSchema, calciumProperty, productEntity, nutrientsEntity);
const [newSchema, newInstanceModel] = moveCommand.execute();
console.log(newSchema.entity(nutrientsEntity.getId()));
console.log(newSchema.entity(nutrientsEntity.getId())?.getProperties());
console.log(newInstanceModel.entity(nutrientsInstanceEntity.getId()));
console.log(newInstanceModel.entity(nutrientsInstanceEntity.getId()).getProperties());
```

## Problemy

### Pole

Pole objektu v datech davaji vznikout entite ve schematu, ktera odkazuje na hodne instanci. Pri parsovani je nutne projit vsechny podstromy v poli a zmergovat je. Vyskyt hodne poli a hodne v nich ruznych objektu davaji vzniknout hodne ruznorodym datum. Zaroven je nutne nalinkovat data do nove zmergovane struktury (=schematu). Parser pro parsovani kombinaci objektu, poli a literalu je v [./schema-parser.ts](`schema-parser.ts`). Bohuzel jsem parser udelal nejdriv a pak jsem musel menit rozhrani pro schema, tedy je zakomentovane. Zaroven si nejsem jisty, jak presne ve schema reprezentovat, kdyz je na vstupu pole poli?

Pole zaroven vytvareji i pozdeji problemy pri praci se schematem a instancemi - napriklad pri presunu property z jedne entity na druhou.

-   entity nejsou v polich - situace je jednoducha a je jasne, jak prevest propertu mezi instancema.
-   zdrojova a cilova entita jsou v jednom poli - mapovani instanci lze udelat 1 ku 1, ale je potreba na to myslet, ze se to muze stat - stejne poradi instanci entit, nebo jine reseni.
-   cilova entita reprezentuje pole, zdrojova ne - kopirovani instanci propert do vsech cilovych instanci entit?
-   zdrojova pole (nebo pole mezi) a cilove ne - ulozeni vsech propert do jedne instance entity
-   cilova i zdrojova jsou v ruznych podstromech v ruznych polich - v tomto pripadi mi neni jasne, jak instance poli namapovat na sebe spravne, aby presun byl korektni. Mozna ale je treba, aby klient specifikovat nejake mapujici pravilo.

Entity reprezentujici pole mohou byt vsude a muze jich byt hodne, tudiz se to cele jeste zeslozituje na implementaci.

### Podobnost rozhrani schema a instanci

-   rozhrani pro schema i instance je dost podobne - jak sdilet implementaci?

### Oddeleni schema a dat

Oddeleni schema a dat vytvari docela slozitost. Struktury pro ukladani obojiho jsou dost podobne a instance by se daly pripojit ke schematu. Otazka je, zda se uplne neopousti moznost prace nad velkymi daty? Nebo je to premature optimization?

### Entita a literal

Entita i literal oboji jsou stejne z urcitych podledu(e.g. z hlediska property). Ma cenu s nima zachazet stejne a zrusit ruzne rozhrani pro entitu a literal a treba je spojit a poskytovat flag a metodu pro rozliseni?

### Kde ukladat dalsi data

Nekde je treba ukladat informace, ktere se daji ziskat od neceho, co obohacuje schema - Analyzer, Detector, ... Napriklad, detekce urciteho typu, podmoziny literalovych hodnot, atd... Jsou k dispozici UI a doporucenim.

Uri, typy a podobne informace pro generovani vystupu je potreba nekde ukladat. Asi dava smysl je mit rovnou jako optional ve schematu a instancich?

Moznosti:

-   Je mozne vse ulozit do objektu entit (atd...) primo, jenze pak je nutne se o informace starat pri updatovani - entity nebo commandy by musely vedet, co presne maji zavolat pro update. Nebo by se hodnoty neupdatovaly. Take by navrh rozhrani musel uz obsahovat vsechny tyto obohacovace a bez zvysovani komplexity fungoval vzdy na vsem. Neni mozne si v urcitych zpusobech konfigurovat napr. pro urcite doporuceni, jake obohacovace potrebuje, resp. by to hrozne zvysovalo slozitost rozhrani - asi? Nebo by rozhrani obohacovace neobsahovalo, ale kazda entita by dynamicky obsahovala informace od obohacovacu? Vyhoda je automaticke verzovani, ale na druhou stranu by se verzovalo spoustu informaci, ktere nikdy potreba nebudou??
-   Mit normalne service, ktery pro danou entitu (atd...) poskytne obohaceni, ktere nabizi. Nevyhoda je, ze to neni primo na entite a je treba vedet, koho se zeptat. Zase je tady k dispozici uplna volnost, co do velikosti informaci pro entitu a konfigurovatelnost. Je ale treba nejak vyresit to, aby service vzdy poskytoval informace dle spravne verze - verzovani tady neni zadarmo. Asi se info muze pocitat vzdy znova? Neni asi jak, poznat kdy lze reusovat - leda nejak idckovat verze schematu a instanci.
-   Mit service a nahackovat ho do modelu a v entitach (atd...) jen service volat. Nezeslozituje to zbytecne schema?
