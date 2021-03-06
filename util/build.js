const fs = require('fs-extra');
const childProcess = require('child_process');

try {
  // Remove current build
  fs.removeSync('./dist/');
  // Copy front-end files
  fs.copySync('./src/public', './dist/public');
  fs.copySync('./src/front/dist/front', './dist/front/dist/front');
  // Transpile the typescript files
  // const proc = childProcess.exec('tsc --build tsconfig.prod.json', (error) => {
  //   if (error) console.log('my log : ' + error);
  // });
  // proc.on('close', (code) => {
  //   if (code !== 0) {
  //     console.log(code);
  //     //throw Error("Build failed");
  //   }
  // });
} catch (err) {
  console.log(err);
}
