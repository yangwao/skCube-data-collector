//  ██████╗ ██████╗ ███╗   ███╗
// ██╔════╝██╔═══██╗████╗ ████║
// ██║     ██║   ██║██╔████╔██║
// ██║     ██║   ██║██║╚██╔╝██║
// ╚██████╗╚██████╔╝██║ ╚═╝ ██║
//  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝

export const COMStructure: Type[] = [ [ 8, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 2, 'unsigned' ],
  [ 2, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 2, 'signed' ],
  [ 2, 'signed' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 2, 'unsigned' ],
  [ 2, 'unsigned' ],
  [ 2, 'unsigned' ],
  [ 2, 'unsigned' ] ];

export const COMObj = {
    timestamp: '',
    fwVersion: '',
    activeCOM: '',
    digipeaterMode: '',
    numberOfReboots: '',
    outputReflectedPower: '',
    outputForwardPower: '',
    outputReflectedPowerCW: '',
    outputForwardPowerCW: '',
    rssi: '',
    rssiNoise: '',
    mcuTemperature: '',
    paTemperature: '',
    cwBeaconSent: '',
    packetsSent: '',
    correctPacketsReceived: '',
    brokenPacketReceived: '',
    comProtocolError: '',
    gsProtocolError: '',
    txDisableStatus: '',
    orbitTime: '',
    timeslotStart: '',
    timeslotEnd: '',
}

//  █████╗ ██████╗  ██████╗███████╗
// ██╔══██╗██╔══██╗██╔════╝██╔════╝
// ███████║██║  ██║██║     ███████╗
// ██╔══██║██║  ██║██║     ╚════██║
// ██║  ██║██████╔╝╚██████╗███████║
// ╚═╝  ╚═╝╚═════╝  ╚═════╝╚══════╝

// export const ADCSStructure = [ 2, 2, 4, 4, 2, 4, 4, 2, 4, 4, 2, 4, 4, 2, 4, 4, 2, 4, 4, 2, 4, 4, 2, ...Array(20).fill(4)];
export const ADCSStructure: Type[] = [ [ 2, 'unsigned' ],
  [ 2, 'unsigned' ],
  [ 2, 'unsigned' ],
  [ 2, 'unsigned' ],
  [ 2, 'unsigned' ],
  [ 4, 'signed' ],
  [ 4, 'signed' ],
  [ 2, 'unsigned' ],
  [ 4, 'signed' ],
  [ 4, 'signed' ],
  [ 2, 'unsigned' ],
  [ 4, 'signed' ],
  [ 4, 'signed' ],
  [ 2, 'unsigned' ],
  [ 4, 'signed' ],
  [ 4, 'signed' ],
  [ 2, 'unsigned' ],
  [ 4, 'signed' ],
  [ 4, 'signed' ],
  [ 2, 'unsigned' ],
  [ 4, 'signed' ],
  [ 4, 'signed' ],
  [ 2, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ],
  [ 4, 'unsigned' ] ];

export const ADCSObj = {
    'adcsMode': '',
    'bdK': '',
    'maxPWMCoilX': '',
    'maxPWMCoilY': '',
    'maxPWMCoilZ': '',
    'sunX+x': '',
    'sunX+y': '',
    'sunX+Irradiation': '',
    'sunX-x': '',
    'sunX-y': '',
    'sunX-Irradiation': '',
    'sunY+x': '',
    'sunY+y': '',
    'sunY+Irradiation': '',
    'sunY-x': '',
    'sunY-y': '',
    'sunY-Irradiation': '',
    'sunZ+x': '',
    'sunZ+y': '',
    'sunZ+Irradiation': '',
    'sunZ-x': '',
    'sunZ-y': '',
    'sunZ-Irradiation': '',
    'gyroscopeX': '',
    'gyroscopeY': '',
    'gyroscopeZ': '',
    'gyroscopeTemp': '',
    'magnetometer1X': '',
    'magnetometer1Y': '',
    'magnetometer1Z': '',
    'magnetometer1Temp': '',
    'magnetometer2X': '',
    'magnetometer2Y': '',
    'magnetometer2Z': '',
    'magnetometer2Temp': '',
    'accelerometerX': '',
    'accelerometerY': '',
    'accelerometerZ': '',
    'accelTemp': '',
    'earthSensorX+': '',
    'earthSensorX-': '',
    'earthSensorY+': '',
    'earthSensorY-': '',
}

//  ██████╗██████╗ ██╗  ██╗███████╗
// ██╔════╝██╔══██╗██║  ██║██╔════╝
// ██║     ██║  ██║███████║███████╗
// ██║     ██║  ██║██╔══██║╚════██║
// ╚██████╗██████╔╝██║  ██║███████║
//  ╚═════╝╚═════╝ ╚═╝  ╚═╝╚══════╝

// ██████╗ ██╗    ██╗██████╗
// ██╔══██╗██║    ██║██╔══██╗
// ██████╔╝██║ █╗ ██║██████╔╝
// ██╔═══╝ ██║███╗██║██╔══██╗
// ██║     ╚███╔███╔╝██║  ██║
// ╚═╝      ╚══╝╚══╝ ╚═╝  ╚═╝
