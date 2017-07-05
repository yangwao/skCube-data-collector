# skCube_data_collector
data from 🛰 space

Quick desc

`.gsr` files are in hex.
They need to be converted to the decimal.

Some hints from radio amateurs:
```
Su vo formate KISS tak ako ich posiela radiovy modem.
Toto formatovanie je verejne dostupne napriklad tu: https://en.wikipedia.org/wiki/KISS_(TNC)
po rozkodovani formatu KISS su data dalej zabalene vo formate AX.25 UI frame info napriklad tu: https://en.wikipedia.org/wiki/AX.25
Hlavicka AX.25 obsahuje volaci znak satelitu a volaci znak adresata

Prvy bajt dat sa nachadza na ofsete 0x0010
```

There are 4 types of radio packets, then there is 30s pause.

`ADCS, CDHS, PWR a COM`

In first days, there wasn't PWR packets.

[Link to data structure](https://goo.gl/f6Tv99)

How to read `.gsr` files
* `vim 1498683704_OM3KAA__skCUBE.gsr`
* `:% ! xxd`

### TODO
* send .gsr from client
* store .gsr on server w/ callsign, timestamp, tag
* parse .gsr (hex->dec) at server
* store parsed .gsr to the db (mongodb)
* data explorer for parsed data fetched from db

Other skcube.sk apps
* https://3d.skcube.sk/
* https://data.skcube.sk/
