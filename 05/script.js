const fs = require('fs');

const load = () => fs.readFileSync('./data.txt', 'utf-8')
  .trim()
  .split("");

const comparePair = (a, b) => {
  return a.toLowerCase() === b.toLowerCase() && 
    a !== b;
};

const destroyPairs = (code) => {
  let matchFound = false;
  let newCode = [];

  for (let i = 0; i < code.length - 1; i += 1) {
    const a = code[i];
    const b = code[i + 1];
    if (comparePair(a, b)) {
      matchFound = true;
      i += 1;
    } else {
      newCode.push(a);
    }
  }

  newCode.push(code[code.length - 1]);
  return matchFound ? destroyPairs(newCode) : newCode.length;
};

const findMinCode = (code) => {
  const charSet = new Set(code.map(char => char.toLowerCase()));
  let minLength = code.length;
  charSet.forEach(char => {
    const re = new RegExp(char, 'gi');
    let curCode = code.join("")
      .replace(re, '')
      .split("");

    const curLength = destroyPairs(curCode);
    minLength = curLength < minLength ? curLength : minLength;
  });

  return minLength;
};

const run = () => {
  const code = load();

  const minCode = findMinCode(code);
  const collapsedLength = destroyPairs(code);
  const minCollapsedLength = findMinCode(code);

  console.log(`The initial collapsed length is ${collapsedLength}`);
  console.log(`The minimum possible collapsed length is: ${minCollapsedLength}`);
};

run();
