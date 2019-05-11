const net = require('net');
const fs = require('fs');

const ftpServerFileListJSONFile = 'fileList.json';

let readerStream, writeStream;
let ftpServerFileRootPath = '/home/z/ftp/node_ftp/s/ftpFile';


const server = net.createServer({ allowHalfOpen: true }, (socket) => {
  const clinetAddress = socket.address();
  console.log('Established a connection from (', clinetAddress.address, clinetAddress.port, clinetAddress.family, ')');

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
    console.log('connection end (', clinetAddress.address, clinetAddress.port, clinetAddress.family, ')');
  });
  socket.on('close', () => {
    console.log('connection close (', clinetAddress.address, clinetAddress.port, clinetAddress.family, ')');
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