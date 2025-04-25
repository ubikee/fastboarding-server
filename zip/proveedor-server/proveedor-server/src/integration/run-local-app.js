const { spawn } = require('child_process');

function runAppWithFile(filePath) {
  const proc = spawn('C:\\MiApp\\procesar.exe', [filePath]);

  proc.stdout.on('data', (data) => {
    console.log(`[APP] ${data}`);
  });

  proc.stderr.on('data', (err) => {
    console.error(`[APP ERROR] ${err}`);
  });

  proc.on('exit', (code) => {
    console.log(`[APP] Finalizó con código ${code}`);
  });
}

module.exports = { runAppWithFile };