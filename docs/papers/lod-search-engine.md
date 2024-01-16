# LOD search engine: A semantic search over linked data

link: https://link.springer.com/article/10.1007/s10844-021-00687-0?fbclid=IwAR3GGTUupQUVd57IdUqM6h1lGbbBj5I0pTVkHaCz7AiRhuyCe_wnWVJZ3EU

Paper je o hledani v rdf datech - zejmena v celem LOD cloudu.

1. Lematizuji query pomoci Brillova taggeru a priradi kazdemu slovu POS(Part of Speech). Pomoci POS se to otaguje a POS informace se pouzije k identifikaci slov a frazi - keywordy. Pro fraze se pocitaji jen podstatna jmena, pridavna jmena a slovesa (kdyz jsou 2+ za sebou, tak se jedna o frazi).

2. Pouzivaji stazeny LOD dump o 4GB z roku 2018. Rozdeli to na unikatni uri do cca 1000 souboru. Ty pak zaindexuji pomoci Apache Lucene tak, aby pro hledane slovo vedeli v jakem je souboru. Tedy kdyz prijde pozadavek s hledanym slovem, vedi do jakych souboru se podivat.

3. Vyhledani trojic se dela bud pomoci Forward nebo Backward hledani. Forward znamena hledat keyword v subjektech trojic a Backward v objektech trojic. Vraci se vsechny namatchovane trojice.

4. Optimilizace (serazeni) vysledku se dela pomoci Domain Ranking nebo Triple Ranking. Domain ranking radi domeny dle toho, kolik trojic domena ma. Cim vice, tim versi ranking. Tady mi neni jasne, zda se jedna o celkovy pocet trojic nebo celkovy pocet NAJITYCH trojic. Triple ranking radi trojice v domene dle poctu subjektu a objektu. Pro Forward search se pro kazdy subjekt pocita pocet objektu (U Backward obracene) v result setu.

Dle experimentalnich vysledku Precision, Recall a F1 score jsou vyrazne lepsi nez falcon a swoogle. Nicmene porad jde o fulltext approach, kde keywordy musi byt namatchovany cely a vsechny v ramci trojice, aby se brala v uvahu.
