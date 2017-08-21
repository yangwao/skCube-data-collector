> Parser for GSR packets, supports CDHS, PWR, ADCS and COM packet types.

There is one method, `parseGsrData` that __accepts string__ with hex data and __returns an object__ with parsed data

## Example usage 

``` js
const gsrDecoder = require('gsr-parser').parseGsrData;
// or
// import { parseGsrData as gsrDecoder } from 'gsr-parser';
const decodedPacketData = gsrDecoder(dataInHex);
```
