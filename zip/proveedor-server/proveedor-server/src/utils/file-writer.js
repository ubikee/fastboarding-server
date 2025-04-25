const fs = require('fs');

function writeChunk(filename, buffer) {
  fs.writeFile(`./data/${filename}`, buffer, (err) => {
    if (err) console.error('Error writing file:', err);
    else console.log('Archivo guardado:', filename);
  });
}

module.exports = { writeChunk };