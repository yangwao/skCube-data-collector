
const CWD = process.cwd()
const fs = require('fs')
// const adcs = require(CWD + '/lab/1498683512_OM3KAA__skCUBE.gsr')
const adcs = './lab/1498683512_OM3KAA__skCUBE.gsr'

fs.readFile(adcs, function (err, data) {
  if (err) {
    return console.error(err);
  }
  console.log("Async read: " + data);
  let dec = parseInt(data, 16)
  // let dec = data.toString(16)
  console.log(dec)
});
