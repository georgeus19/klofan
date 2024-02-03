# Pozadavky

-   Doporucuj na zaklade editorovych dat, jak ty data upravit
-   Jsou potreba data, na zaklade kterych se bude doporucovat - LOD Cloud, slovniky, ...
    -   Moznost nahrat RDF data/ ukazat na data, dle kterych se muze nejak doporucovat
    -   Ukazat, co ty data obsahuji (co lze pouzit k doporucovani)

# Typy recommenderu

## Jen editorova data

Recommender dostance pouze editorova data a na zaklade nich doporuci zmeny.

-   Recommender pro cesky datum, ktery doporuci xsd:dateTime kompatibilni stringove literaly na klasicky cesky DD.MM.YYYY
-   Data Cube csv recommender, ktery na zaklade detekce malo schema entit a pritomnisti floatu doporuci pouzit Data Cube vocab

## Editorova data a zaroven knowledge base raw data

Recommender dostane data z editor a zaroven ma pristup k datum, ktere si dopredu nejak predzpracoval. Tato data muhou ale nemuseji pochazet z katalogu.

-   LOD Semantic Search Machine ktera si zpracuje LOD do Apache Lucene, na ktere pak dela fulltext search

## Editorova data a zaroven rdf data a nejaka jejich metadata

Recommender dostane data z editoru a zaroven pristup ke katalogovym datum, ktera ale jsou uz nejak zanalyzovana do metadat.

-   Ciselnikovy recommender, ktery doporuci z hodnoty ciselniku, na zaklade hodnot ciselniku (co je ciselnik je v poskytnutych metadatech)
-   Vocab recommender, ktery ze ulozenych slovniku najde podobnost a prislusny slovnikovy pojem doporuci

# Hraci

## Katalog

Umoznuje ukladat data a zaroven poskytovat info o jejich ulozeni.

## Analyzer

Analyzuje data vlozena do "Katalogu" a produkuje nejaka matadata, ktera ty data nejak popisuje.

Tady se uvazuje, ze by melo byt mozne jednoduse pridavat nove analyzatory, ktere zahrnuji know-how nejakeho experta.

## Recommender

Doporucuje "Editoru", jak menit uzivatelska data. Muze k tomu vyuzivat data "Katalogu" (+"Analyzeru") dle toho, jaky je to typ recommenderu.

## Editor

Umoznuje uzivateli editovat vlozena data tak, aby je premenil do vhodne reprezentovanych RDF dat. Pouziva k tomu castecne doporuceni od "Recommenderu".

# Typy architektur

## Katalogovy monolith

Katalog runtime obsahuje analyzery, ktere data ukladaji do spolecneho RDF uloziste, ktere slouzi pro recommendery jako podklad pro doporucovani. Tzn. Katalog, Analyzer, Recommender jsou soucasti jedne runtime componenty a sdileji data ze spolecne databaze. UI pro zobrazeni katalogizovanych dat do db primo saha.

## Recommender microservice

Katalog jen posila recommenderum data co nacetl a recommenderi si je analyzuji a uchovaji si metadata. Katalog jen uklada FS soubory a zakladni zaznamy o vlozeni dat. Otazka je, jak (a jestli) ukazovat, co se z dat analyzovalo, uzivateli. Zda si katalog bude sosat info od recommenderu a poskytovat ho uzivateli?

## Analyzer hub

Katalog preposila data analyzer hubu, ktery data pomoci analyzeru zprocesuje a ulozi si metadata do db. Katalog se pak analyzeru pta, co v datech nasel, aby to mohl ukazat uzivateli. Recommendery se analyzeru dotazuji na metadata - maji pristup k jeho public API nebo je soucasti toho API databaze, do ktere to uklada, aby si recommendery mohli dotazovat zcela flexibilne a neomezene na to, co potrebuji?
