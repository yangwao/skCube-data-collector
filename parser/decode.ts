// IN FISH SHELL ><>
// set IFS ''
// node ../build/decode.js (xxd -ps 1498683704_OM3KAA__skCUBE.gsr)

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' data');
  process.exit(1);
}

const rawData = process.argv[2];

const data = cleanUnwantedData(rawData);

const type = findType(data);
console.log(type);

// fromHexToDec(data);

function cleanUnwantedData(rawData: string) {
    const newData = rawData.slice(36);
    // console.log(newData);
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

// function fromHexToDec(data: string) {
//     const hex = new RegExp('^[0-9]|[a-f]');
//     const decArray = [];
//     let hexNum: string = '';
//     let decNum: number;
//     let otherData: boolean = false;
//     let lengthOfUsed: number = 0;
//     let i;

//     for (i = 0; i < data.length; i++) {

//         if (hex.test(data[i])) {
//             hexNum += `${data[i]}`;
//             continue;
//         }

//         if (otherData) {
//             if (data[i] === '\n') {
//                 otherData = false;
//             }
//             continue;
//         }

//         if (data[i] === '.') {
//             otherData = true;
//             continue;
//         }

//         if (hexNum) {
//             if (data[i] === ':') {
//                 hexNum = '';
//             } else {
//                 decNum = parseInt(hexNum, 16);
//                 process.stdout.write(decNum + ' ');
//                 if (decNum > 0) {
//                     lengthOfUsed += 1;
//                 }
//                 decArray.push(decNum);
//             }
//             hexNum = '';
//         }
//     }

//     console.log('\nlength: ', decArray.length);
//     console.log('length used: ', lengthOfUsed - 1);
//     return decArray;
// }
