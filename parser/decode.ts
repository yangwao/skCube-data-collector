// IN FISH SHELL ><>
// set IFS ''
// node ../build/decode.js (xxd -ps 1498683704_OM3KAA__skCUBE.gsr)

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' data');
  process.exit(1);
}

// Read the file and print its contents.
// const fs = require('fs')
// fs.readFile(filename, 'utf8', function(err, data) {
//   if (err) throw err;
//   console.log('OK: ' + filename);
//   console.log(data)
// });

function fromHexToDec(data: string) {
    const hex = new RegExp('^[0-9]|[a-f]');
    const decArray = [];
    let hexNum: string = '';
    let decNum: number;
    let otherData: boolean = false;
    let lengthOfUsed: number = 0;
    let i;

    for (i = 0; i < data.length; i++) {

        if (hex.test(data[i])) {
            hexNum += `${data[i]}`;   
            continue; 
        }

        if (otherData) {
            if (data[i] === '\n') {
                otherData = false;
            }
            continue;
        }

        if (data[i] === '.') {
            otherData = true;
            continue;
        }

        if (hexNum) {
            if (data[i] === ':') {
                hexNum = '';
            } else {
                decNum = parseInt(hexNum, 16);
                process.stdout.write(decNum + ' ');   
                if (decNum > 0) {
                    lengthOfUsed += 1;
                }
                decArray.push(decNum);          
            }
            hexNum = '';       
        }
    }   

    console.log('\nlength: ', decArray.length);
    console.log('length used: ', lengthOfUsed - 1);    
    return decArray;
}

const data = process.argv[2];
fromHexToDec(data);

// node ../build/decode.js "$(xxd 1498683704_OM3KAA__skCUBE.gsr)"