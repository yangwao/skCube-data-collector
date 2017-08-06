// IN FISH SHELL ><>
// set IFS ''
// node ../parser/build/decode.js (xxd -ps 1498683704_OM3KAA__skCUBE.gsr)

import { COMStructure, COMObj, ADCSStructure, ADCSObj } from './data-structure';

// Make sure we got a filename on the command line.
if (process.argv.length !== 3) {
  console.log('Please enter data as 3rd argument');
  process.exit(1);
}

const rawData = process.argv[2];

// add test for head data to filter out wrong data
const data = cleanUnwantedData(rawData);
const type = findType(data);
const newDataWithoutType = removeType(data);
const newData = removeNewLines(newDataWithoutType);

export type Type = [
    number,
    string
];

switch (type) {
    case 'CDHS':

    case 'ADCS':
        console.log(parseByStructure(newData, ADCSStructure, ADCSObj));
        break;
    case 'COM':
        console.log(parseByStructure(newData, COMStructure, COMObj));
        break;
    case 'PWR':

    case 'CAM':
        throw new Error('not supported type');
    case 'EXP':
        throw new Error('not supported type');
}

function cleanUnwantedData(rawData: string) {
    const newData = rawData.slice(36);
    return newData;
}

function findType(data: string) {
    const n = data.slice(0, 2);
    switch (n) {
        case '01':
            return 'CDHS';
        case '02':
            return 'ADCS';
        case '03':
            return 'COM';
        case '04':
            return 'CAM';
        case '05':
            return 'PWR';
        case '06':
            return 'EXP';
        default:
            throw new Error('invalid type');
    }
}

function removeType(data: string) {
    return data.slice(2);
}

function removeNewLines(data: string) {
    let newData = '';
    for (const c of data) {
        if (c !== '\n') {
            newData += c
        }
    }
    return newData;
}

function parseByStructure(data: string, structure: Type[], obj: object) {
    const resultArray: any = [];

    let result: number = null;
    structure.reduce((sum, s) => {
        const hexNum = data.slice(sum, sum+s[0]);
        console.log(hexNum)
        // ~~~switch endianness~~~
        const hexNumLittleEndian = hexNum.match(/../g).reverse().join('');
        resultArray.push(parseInt(hexNumLittleEndian, 16));

        result = sum+s[0];
        return sum+s[0];
    }, 0);

    let i = 0;
    for (let key in obj) {
        obj[key] = resultArray[i++];
    }
    return obj;
}
