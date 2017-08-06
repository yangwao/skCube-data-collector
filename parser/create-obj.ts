(function() {
    const data = `adcs mode
    bdK
    Max PWM coil X
    Max PWM coil Y
    Max PWM coil Z
    sunX+x
    sunX+y
    sunX+Irradiation
    sunX-x
    sunX-y
    sunX-Irradiation
    sunY+x
    sunY+y
    sunY+Irradiation
    sunY-x
    sunY-y
    sunY-Irradiation
    sunZ+x
    sunZ+y
    sunZ+Irradiation
    sunZ-x
    sunZ-y
    sunZ-Irradiation
    Gyroscope X
    Gyroscope Y
    Gyroscope Z
    Gyroscope temp
    Magnetometer 1 X
    Magnetometer 1 Y
    Magnetometer 1 Z
    Magnetometer 1 temp
    Magnetometer 2 X
    Magnetometer 2 Y
    Magnetometer 2 Z
    Magnetometer 2 temp
    Accelerometer X
    Accelerometer Y
    Accelerometer Z
    Accel temp
    Earth sensor X+
    Earth sensor X-
    Earth sensor Y+
    Earth sensor Y-`;

    const dataArray = data.split('\n');

    function camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
    }

    const camelDataArray: string[] = [];

    dataArray.map(line => {
        camelDataArray.push(camelize(line));
    })

    console.log(camelDataArray)
}())
