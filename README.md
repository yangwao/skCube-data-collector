# skCube-data-collector
data from 🛰 🌌 space

![img](https://travis-ci.org/yangwao/skCube-data-collector.svg?branch=master)
[Travis-ci](https://travis-ci.org/yangwao/skCube-data-collector)
[Appveyor](https://ci.appveyor.com/project/yangwao/skcube-data-collector)

## Built app images
[Downloads for Linux, Mac OSX and Windows](https://github.com/yangwao/skCube-data-collector/releases) could be found in releases

# api
[Writing your own client? Here is api documentation](server/README.md)

Quick desc

`.gsr` files are in hex.
They need to be converted to the decimal.

Some hints from radio amateurs:
```
tam su normalne udaje v hex ktore treba previest do dekadickej sustavy a podla tejto datovej struktury sa da urcit co je presne co;

Su vo formate KISS tak ako ich posiela radiovy modem.
Toto formatovanie je verejne dostupne napriklad tu: https://en.wikipedia.org/wiki/KISS_(TNC)
po rozkodovani formatu KISS su data dalej zabalene vo formate AX.25 UI frame info napriklad tu: https://en.wikipedia.org/wiki/AX.25
Hlavicka AX.25 obsahuje volaci znak satelitu a volaci znak adresata

Prvy bajt dat sa nachadza na ofsete 0x0010
```

There are 4 types of radio packets, then there is 30 sec pause, then again 4 types of radio packets.

`ADCS, CDHS, PWR a COM`

In first days, there wasn't PWR packets.

[Link to data structure](https://goo.gl/f6Tv99)

How to read `.gsr` files
* `vim 1498683704_OM3KAA__skCUBE.gsr`
* `:% ! xxd`

### ROADMAP
- [x] send .gsr from client (wao)
- [x] store .gsr on server w/ callsign, timestamp, tag (wao)
- [x] parse .gsr (hex->dec) at server (ewe)
- store parsed .gsr to the db
- data explorer for parsed data fetched from db (~ [OpenMCT](https://nasa.github.io/openmct/))

### skCube
* [skCube homepage](http://www.skcube.sk/)
* [More about skCube](https://sk.wikipedia.org/wiki/SkCUBE)
* [Technologies on board SK](http://www.skcube.sk/skcube/technologie/)
* [Technologies on board EN](http://www.skcube.sk/skcube/first-slovak-satellite-skcube/)
* [For radioamateurs SK](http://www.skcube.sk/vystupy/pre-radioamaterov/)

### Other skcube.sk apps
* [3d.skcube.sk](https://3d.skcube.sk/)
* [data.skcube.sk](https://data.skcube.sk/)

### Other LEO/Cubesat projects
* [SatNogs](https://satnogs.org/)

## skCube teardown
![img](skCube-teardown.jpg)
