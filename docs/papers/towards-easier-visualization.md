# Towards Easier Visualization Paper

Link na (paper)[https://dl.acm.org/doi/abs/10.1145/3102254.3102261].

## Myslenka

Resi jak vizualizovat 5-star dataset pro lay usera pekne. V uvodu rika, ze neexistuji tooly pro praci s 5-star daty, ktere by nevyzadovali po uzivateli byt LOD expert (e.g. umet se SPARQLem). Pouziva nastroj LP-VIZ pro nalezeni vhodnych vizualizaci datasetu. Middle man pak muze nakonfigurovat danou vizualizaci pro jeji zjednoduseni. Reprezentace middle man prace je na grafu, kde vrcholy jsou stavy vizualizace (nejake dane hodnoty parametru) a hrany jsou akce, ktere middle man muze udelat, aby se dostal do jineho stavu. Graf ma tedy hranu mezi dvema vrcholy, pokud ma vizualizace cudliky, aby se uzivatel pomoci nich dostal do jineho stavu. Parameter je treba zoom level, nastaveni barev, ...

Graf je moc velky, tedy ho middle man muze nejak prorezat (teoreticky lze vyzahovat rucne hrany a vrcholy, mergovat, ale pochopitelnejsi jsou logicke operace): Nastavit inicialni stav, Limitovat hodnoty daneho parametru (vyhodi se vrcholy, ktere ted uz nepripustne hodnoty obsahuji a jejich hrany), Vyhodit parametr (vrcholy, ktere se lisi v tom parametru, se zmerguji a hrany se upravi odpovidajicim zpusobem).

## Implementace

todo po precteni LP-VIZ. Vlastne vyhodi vizualizery a nahradi je asistentem, ktery umoznuje nakonfigurovat middle manovi view.
