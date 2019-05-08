const net = require('net');
const fs = require('fs');
const readline = require('readline');


//创建readline接口实例
const readlineImplement = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ftpServerFileListJSONFile = 'fileList.json';

let totalLength = 0;
let writeStream;
let socket;

readlineImplement.on('line', function (line) {
  line = line.trim();
  switch (line.slice(0, 3)) {
    case 'ls':
      socket = net.createConnection({ port: 8124 }, () => {
        console.log('connected to server!');
      });
      socket.on('data', (chunk) => {
        // totalLength += chunk.length;
        // console.log('recevied data size: ' + totalLength + 'KB');
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
      writeStream = fs.createWriteStream(ftpServerFileListJSONFile)
      socket.pipe(writeStream);
      socket.write(line, function () {
        console.log(socket.destroyed);
      })
      break;
    case 'get':
      totalLength = 0;
      socket = net.createConnection({ port: 8124 }, () => {
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
      writeStream = fs.createWriteStream(line.slice(4))
      socket.pipe(writeStream);
      socket.write(line, function () {
        console.log(socket.destroyed);
      })
      break;
    case 'put':
      socket = net.createConnection({ port: 8124 }, () => {
        console.log('connected to server!');

      }).setNoDelay(false);
      socket.write(line, function () {
        readStream = fs.createReadStream(line.slice(4));
        stream = readStream.pipe(socket);
        stream.on('finish', function () {
          socket.end();
        })
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
      break;
    default:
      console.log('没有找到命令！');
      break;
  }
});


readlineImplement.on('close', function () {
  console.log('getline close');
  process.exit(0);
});