const net = require('net');
const fs = require('fs');
// mode(string): get or put
// fileName(string): get or put fileName
// socketOption(object): {port:number,ip:string}
// instruction(function): send a command to the server
// [cb(function)]: when pipe finish call this function
function createSocketConnection(fileName, mode, socketOption, instruction, cb, cbOptions) {
  let totalLength = 0;
  let writeStream, streamIsFinish, readStream;
  const socket = net.createConnection(socketOption, () => {
    console.log('connected to server!');
  });
  socket.on('data', (chunk) => {
    totalLength += chunk.length;
    console.log('recevied data size: ' + totalLength + 'KB');
  });
  socket.on('error', (er) => {
    console.log(er);
  })
  socket.on('end', function () {
    console.log('Connection end');
  });
  socket.on('close', function (e) {
    console.log('Connection closed', e);
  });
  if (mode === 'get') {
    writeStream = fs.createWriteStream(fileName);
    streamIsFinish = socket.pipe(writeStream);
  } else if (mode === 'put') {
    readStream = fs.createReadStream(fileName);
    streamIsFinish = readStream.pipe(socket);
  }
  if (cb && (typeof cb == 'function')) {
    streamIsFinish.on('finish', function () { cb(cbOptions.dom, cbOptions.file) });
  }
  if (instruction) {
    console.log('instruction', instruction);
    socket.write(instruction);
  } else {
    console.log('error, lack instruction');
  }
}


module.exports = {
  createSocketConnection
}