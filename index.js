const fs = require('fs');
const path = require('path');

const fileExists = (filePath) => {
  let exists = false;
  try {
    exists = fs.statSync(filePath).isFile();
  } catch (e) {
    exists = false;
  }
  return exists;
}

const listKeys = (fileName = 'decTitleKeys.bin') => {
  const resolvedPath = path.join(__dirname, fileName);
  if (!fileExists(resolvedPath)) {
    console.log('File ' + fileName + ' not found.');
    process.exit(-1);
  }

  const buffer = fs.readFileSync(resolvedPath);
  const length = buffer.readUInt32LE(0);
  console.log(`length is ${length}`);

  const headerSize = 16;
  const commonKeyIndexSize = 8;
  const titleSize = 8;
  const keySize = 16;
  const tupleSize = 32;
  const initialOffset = headerSize + commonKeyIndexSize;

  for (let i = 0; i < length; i++){
    let title = '', key = '';
    for (
      let pos = initialOffset + i * tupleSize, max = titleSize + pos;
      pos < max;
      pos ++
    ) {
      let chars = buffer.readUInt8(pos).toString(16);
      title += chars.length === 1 ? '0' + chars : chars;
    }

    for (
      let pos = initialOffset + i * tupleSize + titleSize, max = keySize + pos;
      pos < max;
      pos ++
    ) {
      let chars = buffer.readUInt8(pos).toString(16);
      key += chars.length === 1 ? '0' + chars : chars;
    }
    console.log(`title ID: ${title}  =>  key: ${key}`);
  };
}

listKeys(process.argv[2]);
