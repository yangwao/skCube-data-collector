// IN FISH SHELL ><>
// set IFS ''
// node ../parser/build/decode.js (xxd -ps 1498683704_OM3KAA__skCUBE.gsr)

const COMstructure = [8, 4, 4, 2, 2, 4, ...Array(5).fill(4), 2, 2, ...Array(6).fill(4), ...Array(4).fill(2)];

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
console.log(type);
const newData = removeNewLines(newDataWithoutType);

const resultObj = parseByType(newData, COMstructure)

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

function parseByType(data: string, structure: number[]) {
    console.log(data)
    const resultArray: any = [];

    let result: number = null;
    structure.reduce((i, s) => {
        const hexNum = data.slice(i, i+s);
        console.log(hexNum, '\n')

        // ~~~switch endianness~~~
        const hexNumLittleEndian = hexNum.match(/../g).reverse().join('');
        resultArray.push(parseInt(hexNumLittleEndian, 16));

        result = i+s;
        return i+s;
    }, 0);

    console.log(resultArray)

    const endsWithEndingSign = result && data.slice(result, result + 2) === 'c0';

    if (endsWithEndingSign) {
        const obj = {
            Timestamp: '',
            FW_version: '',
            Active_COM: '',
            Digipeater_mode: '',
            Number_of_reboots: '',
            Output_reflected_power: '',
            Output_forward_power: '',
            Output_reflected_power_CW: '',
            Output_forward_power_CW: '',
            RSSI: '',
            RSSI_noise: '',
            MCU_Temperature: '',
            PA_Temperature: '',
            CW_beacon_sent: '',
            Packets_sent: '',
            Correct_packets_received: '',
            Broken_packet_received: '',
            COM_protocol_error: '',
            GS_protocol_error: '',
            TX_disable_status: '',
            Orbit_time: '',
            timeslot_start: '',
            timeslot_end: '',
        }

        return obj;
    }
    throw new Error('Data are missing the closing sign');
}
