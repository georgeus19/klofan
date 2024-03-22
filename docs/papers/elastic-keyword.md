# Keyword Search over RDF Using Document-Centric Information Retrieval Systems
link: https://link.springer.com/chapter/10.1007/978-3-030-49461-2_8#Fn8

Paper je keyword based hledani v rdf datech za pouziti Elasticsearch. Jde hlavne o to vyzkouset,
zda obecny IR system je mozne pouzit k hledanim v rdf datech a jak ho pripadne vyladit.

Nejdrive resi problemy, co vracet - unit retreival. Tady se resi mezi entitou (URI), rdf trojici 
a podgrafem. Vyberou si rdf trojici jako stred pro flexibilitu a mnozstvi informaci. Zaroven pak 
na zaklade rankingu trojic dokazou vratic zrankovane entity pro ukazani rankovanych entit.

Dale se resi, co se bude v elasticsearch indexovat. Uri entity lze rozdelit na domain a lokalni 
jmeno, kde lokalni jmeno (text za poslednim # nebo /). Pro trojici lze indexovat literaly 
standardne, blank nody ignorovat a uri entit/propert normalne indexovat. Pripadne je jeste mozne 
indexovat dalsi data o subjektu/objektu - rdfs:label, rdfs:comment nebo vsechny ostatni.

Pak uvazuji vahovani kazdeho index fieldu. Napr. dat vice vahy na objekty oproti subjektu a 
predikatu.

Resi se tam ruzne lokalni parametry Query language, kde pouzivaji query-context na partial match.
Pak se tam diskutuje single a multi match, ale neni jasne, co bylo pouzito??

# Indexovani
V baseline berou jen subjekt, predicate a objekt a berou jejich hodnotu. Pokud je to URI, tak se 
tokenizuje do keywordu. Zejmena se vezme string po poslednim # nebo /.

Extended index jeste bere do uvahy indexovani dalsich veci, pokud je resource URI. Tri moznosti: 
+rdfs:label, +rdfs:comment, +vsechny outgoing property.

# Retrieval
Jako query zkouseji grupovat S/P/O do sebe do 1 fieldu ci samostatne.

Zkouseji ruzne vahy pro S, O, nebo SO.

Take zkouseji ruzne similarity modely v elastic searchi.

# Evaluation
Vyslo jim, ze objekt je dulezity. Jako nejlepsi s baseline jim vyslo brat (spo), potom (s)(p)(o).

Po pridani vah vyslo nejlepsi (s)(p)(o)^2.

Extended index pro rdfs:label nechal stejne vysledky, rdfs:comment zlepsil a vsechny properties 
zhorsily vysledky - asi kvuli noisu.

Pak zkusili ruzne similarity modely, kde vysel nejlepe LM Jelinek-Mercer

Na vsech datech ale vysel nejlip BM25 s extended comment indexem. Skoro stejne dobre jako 
dbpedia focused metody.