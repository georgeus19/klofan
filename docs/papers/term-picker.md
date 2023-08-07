# Term Picker

link: https://link.springer.com/chapter/10.1007/978-3-319-34129-3_7

Paper je o doporucovani slovnikovych pojmu, aby se minimalizovala heterogenita dat v LOD cloudu. Tedy doporucovat tak, aby se co nejvice reusovaly termy. Zaroven se snazi inferovat schema a pomoci nej zlepsit doporucovani. Idealne aby byla doporuceni pro lokalni modelovane schema. 

Dulezite je, ze k nejakemu doporuceni uz je potreba mit neco malo spravne namodelovano. Nelze zacit s praznym vstupem a jen tak predhodit literaly a porad si. Myslenka je, ze uzivatel uz tomu da cast namodelovaneho schema a ono to doporuci vhodne dalsi moznosti rozsireni podle data v LOD cloudu (reusuje nejake pouziti).

K tomu pouzivaji Schema Level Paterns (SLP), coz je trojice mnozin - {subjekty, vlastnosti, objekty}. Pro danou mnozinu datasetu se pak vytvori tyto SLP pomoci dvou hashovacich tabulek tak, aby kdyz je nejaky subjekt s typy A,B spojen vlastnosti V s objektem typu C, tak se vytvori {{A, B}, {D}, {C}}, pokud uz neexistuje. SLP take mohou mit na mistech prazdne mnoziny.

Term picker funguje nasledovne: Vytvori se SLP_q {{subjekty}, {vlastnosti}, {objekty}} (klidne ty mnoziny mohou byt prazdne), ktere reprezentuje vstup (uz namodelovana cast e.g. {{mo:MusicArtist}, {}, {}}) a TM hleda nejlepsi kandidaty, ktere by se hodilo pridat (napr. foaf:made). Chapu to tak, ze vsechny termy z LOD cloudu jsou mozni kandidati. Pro kazdeho kandidata se pocita 5 ruznych ficur:
- V kolika je datasetech
- V kolika datasetech je jeho knihovna
- Pocet vyskytu v LOD cloudu
- Zda knihovna kandidata je v SLP_q (zamereni na reuse te same knihovny)
- SLP score - Pocet SLP v LOD cloudu, ktere obsahuji kandidata x a SLP_q ->> #{SLP_i | SLP_q + x <= SLP_i} (<= je inclusion v kazde mnozine v trojici SLP)

TM vezme vsechny kandidaty s temito ficurami a seradi je podle vah, ktere jednotlive ficure dava. Ty vahy se trenuji pomoci ML - Learning To Rank misto toho aby se nastavovaly rucne. 

Trenovani a testovani (evaluace) se dela simulovanim hledani termu, ktere lze reusovat. Pro trenovani vah se bere trenovaci set, testovaci set a LOD cloud (zbytek dat - pocitaji se na tom ficury) - vse reprezentovano jako mnozina SLP. Evaluaci delaji pomoci 10-fold leave-one-out. Trenovaci a testovaci mnozina jsou disjunktni mnoziny disjunktnich SLP. Jedna se o supervised trenovani, tedy pro kazdeho kandidata je potreba jednak znat tech 5 featur a druhak zda je kandidat relevantni (pozitivni odpoved, spravny kandidat).

Pro kazdou SLP (z trainovaci/testovaci mnoziny) se nahodne vybere 1 ci vice termu a vyhodi se ze SLP - tzv. "vybrane" termy. Jedine relevantni termy - kandidati jsou ty "vybrane". Zbytek kandidatu je irelevantni - nevim, zda tady je kandidat jen z trenovaci/ testovaci mnoziny ci celeho LOD cloudu. Pro trenovani asi chceme mit zhruba podobne pozitivnich a negativnich vstupnich dat, aby trenovani bylo vyvazene??? (Alespon u normalni klasifikace tomu tak je...). 

Je dulezite si dobre vybrat trenovaci a testovaci mnozinu - s hodne ruznymi termy a s hodne reusovanymi pojmy. Kdyz si ty mnoziny definujou vlastni termy, tak pak ve zbytku nemusi byt zadny pripad pouziti tech termu a jejich hodnota SLP je 0, coz negativne ovlivnuje trenovani.

Co se tyce vysledku, tak pocitaji Mean Average Precision a Mean Reciprocal Rank pro seznamy doporuceni. Motivace pro tyhle metriky je takova, ze uzivatele zajima top k (5, 10) pocet relevatnich doporuceni a zbytek je vicemene jedno a nebude si to scrollovat. Porovnani SLP (1-5) se dela oproti ficuram 1-3, 1-4 a take se porovnavaji ruzne trenovaci metody L2R. Prekvapive to vychazi, ze jsou autori uplne genialni a uzasni a vsechno jim vyslo krasne...

V zaveru je upozorneni na nevaliditu vysledku. Provadeji automaticke nastaveni relevatnich pojmu na ty, ktere se ze SLP odeberou. Ale spousta dalsich termu je take relevantni a L2R je bere jako irelevatnni (presto ze maji SLP score > 0) - vede ke spatne natrenovanemu modelu. Pokud v trenovacich datech jsou spatne pouzite termy, tak jejich SLP score budu k 0 (v LOD cloudu spatne pouzite nejsou nebo jen v male mire), coz vede L2R k potlaceni SLP score, protoze dany term je relevatni. Pro vyreseni tohohle by bylo potreba delat anotaci rucne a ne automaticky, coz neni feasible :-).








