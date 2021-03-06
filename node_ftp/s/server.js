const net = require('net');
const fs = require('fs');

const ftpServerFileListJSONFile = 'fileList.json';

let readerStream, writeStream;
let ftpServerFileRootPath = '/home/z/ftp/node_ftp/s/ftpFile';

const trafficStatistics = { bytesRead: 0, bytesWritten: 0 };

const server = net.createServer({ allowHalfOpen: true }, (socket) => {
  const { address, port, family } = socket.address();
  console.log('Established a connection from (', address, port, family, ')');

  socket.on('data', (data) => {
    if (data.toString().slice(0, 2) === 'ls') {
      const ftpServerFileTree = {};
      requestFtpServerFileList(ftpServerFileRootPath, ftpServerFileTree);
      readerStream = fs.createReadStream(ftpServerFileListJSONFile);
      readerStream.pipe(socket);
    }
    else if (data.toString().slice(0, 3) === 'get') {
      console.log('get');
      readerStream = fs.createReadStream(data.toString().slice(4));
      readerStream.pipe(socket);
    } else if (data.toString().slice(0, 3) === 'put') {
      console.log('put', data.toString().slice(4));
      writeStream = fs.createWriteStream(data.toString().slice(4))
      var stream = socket.pipe(writeStream);
      stream.on('finish', function () { socket.end(); });
    }
  })

  socket.on('end', () => {
    console.log('connection end (', address, port, family, ')');

    trafficStatistics.bytesRead += socket.bytesRead;
    console.log('接收的字节数量', trafficStatistics.bytesRead);
    trafficStatistics.bytesWritten += socket.bytesWritten;
    console.log('发送的字节数量', trafficStatistics.bytesWritten);
    if (trafficStatistics[address]) {
      trafficStatistics[address].bytesRead += socket.bytesRead;
      trafficStatistics[address].bytesWritten += socket.bytesWritten;
    } else {
      trafficStatistics[address] = {
        bytesRead: socket.bytesRead,
        bytesWritten: socket.bytesWritten
      };
    }
  });
  socket.on('close', () => {
    console.log('connection close (', address, port, family, ')');
  });
});

server.listen(8124, () => {
  console.log('ftp server start');
});
server.on('close', function () {
  console.log('ftp server close');
});

server.on('error', function (error) {
  console.log('ftp server is abnormally closed :' + error.message);
});
function requestFtpServerFileList(ftpServerFileRootPath, ftpServerFileTree) {
  readDirSync(ftpServerFileRootPath, ftpServerFileTree)
  function readDirSync(path, object) {
    var pa = fs.readdirSync(path);
    pa.forEach(function (fileName) {
      object[fileName] = {};
      var info = fs.statSync(path + '/' + fileName)
      if (info.isDirectory()) {
        // object[fileName].type = 'isDirectory';
        object[fileName].htmlType = 'ul';
        object[fileName].children = {};
        readDirSync(path + '/' + fileName, object[fileName].children);
      } else {
        // object[fileName].type = 'isFile';
        object[fileName].htmlType = 'li';
      }
    })
  }
  // 目录列表不会是很大的文件, 所以采用同步的方式写
  fs.writeFileSync(ftpServerFileListJSONFile, JSON.stringify(ftpServerFileTree, null, 2));
}