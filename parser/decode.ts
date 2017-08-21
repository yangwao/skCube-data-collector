// IN FISH SHELL ><>
// set IFS ''
// node ../parser/build/decode.js (xxd -ps 1498683704_OM3KAA__skCUBE.gsr)

import { COMStructure, COMObj, ADCSStructure, ADCSObj, PWRStructure, PWRObj, CDHSStructure, CDHSObj } from './data-structure';

// Make sure we got a filename on the command line.
// if (process.argv.length !== 3) {
//   console.log('Please enter data as 3rd argument');
//   process.exit(1);
// }

// const rawData = process.argv[2];

export type Type = [
    number,
    string
];

export function parseGsrData(rawData: string) {
    // TODO: add test for head data to filter out wrong packets
    const data = cleanUnwantedData(rawData);
    const type = findType(data);
    const newDataWithoutType = removeType(data);
    const newData = removeNewLines(newDataWithoutType);

    switch (type) {
        case 'CDHS':
            return [type, parseByStructure(newData, CDHSStructure, CDHSObj)];
        case 'ADCS':
            return [type, parseByStructure(newData, ADCSStructure, ADCSObj)];
        case 'COM':
            return [type, parseByStructure(newData, COMStructure, COMObj)];
        case 'PWR':
            return [type, parseByStructure(newData, PWRStructure, PWRObj)];
        case 'CAM':
            throw new Error('CAM is not supported type');
        case 'EXP':
            throw new Error('EXP is not supported type');
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
            let hexNum = data.slice(sum, sum+s[0]);

            // ~~~switch endianness~~~
            const hexNumLittleEndian = hexNum.match(/../g).reverse().join('');

            let num = parseInt(hexNumLittleEndian, 16);

            if (s[1] === 'signed') {
                const maxVal = Math.pow(2, hexNum.length / 2 * 8);
                if (num > maxVal / 2 - 1) {
                    num = num - maxVal
                }
            }

            resultArray.push(num);

            result = sum+s[0];
            return sum+s[0];
        }, 0);

        let i = 0;
        for (let key in obj) {
            obj[key] = resultArray[i++];
        }
        return obj;
    }
}
