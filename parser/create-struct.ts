type Type = [
    number,
    string
];

(function() {
    const data = `uint32
        uint16
        uint8
        uint8
        uint16
        uint16
        uint16
        uint16
        uint16
        uint16
        uint16
        uint16
        uint16
        uint16
        uint16
        uint16
        uint16
        uint16
        uint16
        uint8
        uint8
        uint8
        uint8`;

    const dataArray = data.replace(/^\s+/gm, '').trim().split('\n');
    const structArray: Type[] = [];
    console.log(dataArray)

    dataArray.map(type => {
        switch (type) {
            case 'uint8':
                structArray.push([2, 'unsigned']);
                break;
            case 'uint16':
                structArray.push([4, 'unsigned']);
                break;
            case 'uint32':
                structArray.push([8, 'unsigned']);
                break;
            case 'int8':
                structArray.push([2, 'signed']);
                break;
            case 'int16':
                structArray.push([4, 'signed']);
                break;
            case 'int32':
                structArray.push([8, 'signed']);
                break;
            default:
                console.log('error')
                break;
        }
    });

    console.log(structArray)
}());

