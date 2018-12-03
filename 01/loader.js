const fs = require('fs');

const load = () => {
  const data = fs.readFileSync('./data.txt', 'utf-8')
    .trim();
  const lines = data.split("\n");
  return lines.map(line => ({
    op: line[0],
    val: parseInt(line.slice(1))
  }));
}

module.exports = {
  load
};
