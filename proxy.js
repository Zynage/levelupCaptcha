const fs = require('fs');

const inputFile = 'proxys.txt';
const outputFile = 'proxys.json';

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  const proxies = data
    .trim()
    .split('\n')
    .map((line) => {
      const [ip, port] = line.trim().split(':');
      return `{ "${ip}", ${port} }`;
    })
    .join(',\n');

  const jsonData = `{\n${proxies}\n}`;

  fs.writeFile(outputFile, jsonData, (err) => {
    if (err) {
      console.error('Error al escribir el archivo JSON:', err);
      return;
    }

    console.log('Archivo JSON creado correctamente:', outputFile);
  });
});
