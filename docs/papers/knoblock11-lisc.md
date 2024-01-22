# Clanek **Interactively Mapping Data Sources into the Semantic Web**

Link na [clanek](https://scholar.google.com/citations?view_op=view_citation&hl=en&user=onXXy6MAAAAJ&cstart=100&pagesize=100&sortby=pubdate&citation_for_view=onXXy6MAAAAJ:nrtMV_XWKgEC).

Clanek se zabyva mapovanim dat z relacnich databazi do RDF dat do jedne dane ontologie. Nejdrive postavi ontology graph, pak zacne mapovat sloupce na nody grafu. Po identifikaci nodu se snazi najit vhodny podgraf pro reprezentaci vystupu (Steiner algorithm). Dale generuje logicke mapovani vstupu a z toho vysledne RDF data.

V ramci clanku je vyvinut Karma system.

## Ontology graf

Jsou tam 2 typy nodu: tridy v ontologiich a datove vlastnosti (literaly). Pro datovou vlastnost se vzdy tvori vlastni nody pro vsechny podtridy, na ktere se vlastnost aplikuje (tedy nereusuje se label node pro vsechny tridy napriklad). Pro object vlastnosti je hrana mezi tridami z domeny do jeji range. Navic z kazde podtridy vedet hrana do rodice.

## Mapovani sloupcu do grafu

Snazi se to poznat ze syntaxe hodnot v sloupcich. To delaji prevodem do grafu hodnot a [natrenuji CRF model](https://scholar.google.com/citations?view_op=view_citation&hl=en&user=onXXy6MAAAAJ&cstart=100&pagesize=100&sortby=pubdate&citation_for_view=onXXy6MAAAAJ:JQOojiI6XY0C).

## Vyber vztahu mezi namapovanymi sloupci v grafu

Snazi se vybrat vhodny graf ktery spujuje vsechny sloupcove vrcholy. Pro vyber minimalniho grafu pouzivaji Steineruv algoritmus. Tohle je iterativni proces, kde uzivatel jednak kontroluje spravnost mapovani sloupcu a druhak vybrane vztahy mezi tridami (a datovymi polozkami).

## Related Work
