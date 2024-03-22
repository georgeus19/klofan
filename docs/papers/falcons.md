# Falcons
link: https://www.researchgate.net/profile/Yuzhong-Qu/publication/220123904_Searching_Linked_Objects_with_Falcons_Approach_Implementation_and_Evaluation/links/5483bba20cf25dbd59eb0ff3/Searching-Linked-Objects-with-Falcons-Approach-Implementation-and-Evaluation.pdf

Vyhledavani objektu (=entita s uri) na zaklade keyword query. Pro kazdy objekt se vytvori 
virtualni dokument, ktery ho popisuje. Do uvahu je vzato nazev z uri, hodnoty literalu, propert 
i hodnoty jinych objektu z jeho trojic, coz je jine oproti predeslym, kde se uvazovaly jen nazvy 
z uri a literaly.

Virtualni dokument je zaindexovan invertovane: tzn. VD termy do objektu pomoci apache lucene. Ta 
je pak schopna rici, jaky objekt query obsahuje. Ale nepise se moc, zda to jsou full termy nebo 
treba n-gram.

Druhej index slouzi z class do objektu, tak abych kdyz uzivatel refine query results dle classy, 
tak je mozny rychle zpresnit dane vysledky. Tady je potreba delat i class inferring pro kazdy 
objekt, protoze explicitnich class (a rdfs:Class) je malo - nejsou u objektu nad/podtridy. Tedy 
se dela implicitni reasoning. To znamena, ze se najdou napr. nadtridy, ale do uvahu se bere jen 
dokument, ve kterem classa je, aby nekdo nemohl system sabotovat spatnym subclassingem. Takhle se 
rekurzivne udela mapovani objektu do class a na tom se udela invertovany index.

Pro matchujici virtualni dokumenty se jeste dela ranking, kde se bere do uvahu kosinova 
podobnost VD(matchujici objekt)( + popularity boost pomoci IDF) a VD(query). -> JAK? Zaroven jeste 
dle popularity, coz znamena v kolika dokumentech je objekt pritomen. To se pak znasobi do skore. Je 
mozne to nejak udelat v apache lucene.

Pro najite objekty se generuje snippet pro uzivatele, kde snippet je PD (property description) 
thread, coz je od objektu link do literalu/entity s uri, kde v ceste muze byt libovolne blank 
nodu, ale ne entita. Ty se pak nejak rankujou dle matchovani query termu a vrati se 3 nejlepsi.

Paper delal studii, kde uzivatele zkouseli ruzne vyhledavaci semanticke a webove (google) 
systemy a porovnavali je. Webove z toho vysli lepe, ale jako jediny falcon daval dobre vysledky 
s velkou presnosti (precision).