# Swoogle
link: https://dl.acm.org/doi/10.1145/1031171.1031289

Je to web crawler engine, ktery hleda ontologie (semantic web documents) na webu a zjistuje mezi 
nima vztahy. Nepodporuje hledani termu, jen hledani ontologii. Zaroven rankuje tyhle SWD dle 
ontology ranku (semanticky page rank). IR pro indexovani Ngram a bag of urirefs + Tf/idf model s 
cosine similarity metric.

Takze pri query pomoci IF/IDF (inverted) indexu najdu matchujici SWD a ty vratim pomoci 
rankovaciho algoritmu.

Crawlovani je pomoci googlu servicu, kde ze snazi zajistit co nejvice SWD. Napr. brani jen rdf 
file extensions, ruzne menicich keyword constrains (pro limit 1000 vysledku) + dalsich e.g. 
crawluj jen uri relativni k base uri, Zaroven se analyzuje SWD content a dle jeho uriref se 
hledaji dalsi SWD.

Rankovani dle rational random surfer, je to podle google page rankingu, ale linky mezi SWD maji 
ruzne vahy podle toho, co je to za link.