const fs = require('fs');

const load = () => {
  const data = fs.readFileSync('./data.txt', 'utf-8')
    .trim();
  const lines = data.split("\n");
  return lines.map(line => parseInt(line));
};

module.exports = {
  load
};
