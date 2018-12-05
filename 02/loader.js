const fs = require('fs');

const load = () => {

  return fs.readFileSync('./data.txt', 'utf-8')
    .split("\n");
}

module.exports = {
  load
};

