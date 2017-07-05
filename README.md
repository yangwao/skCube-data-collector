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

There are 4 types of radio packets

`ADCS, CDHS, PWR a COM`

In first days, there wasn't PWR packets.

[Link to data structure](https://goo.gl/f6Tv99)
