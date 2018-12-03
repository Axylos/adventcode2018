const { load } = require('./loader');

const parseAndAddCmd = (op, val, sum) => {
  switch(op) {
    case '+':
      return sum + val;
    case '-':
      return sum - val;
    default:
      throw Error('invalid op code');
  }
}

function* cmdStream(cmds) {
  let ctr = 0;
  let idx = 0;
  let sum = 0;
  while (true) {
    const { op, val } = cmds[idx];
    sum = parseAndAddCmd(op, val, sum);
    idx++;
    ctr++;
    idx = idx === cmds.length ? 0 : idx;
    yield sum;
  }

  return ctr;
}

const computeSum = (cmds) => {
  const it = cmdStream(cmds);
  let sum = 0;
  for (let i = 0; i < cmds.length; i++) {
    sum = it.next().value
  }

  return sum
}

const findDupSum = (cmds) => {
  let seen = new Set();
  let sum = 0;
  const it = cmdStream(cmds);
  while (!seen.has(sum)) {
    seen.add(sum);
    sum = it.next().value;
  }

  return sum;
}

const run = () => {
  const cmds = load();
  const sum = computeSum(cmds);
  const firstDupSum = findDupSum(cmds);

  console.log(`The sum is: ${sum}`);
  console.log(`The first duplicate sum is: ${firstDupSum}`);
}

run();
