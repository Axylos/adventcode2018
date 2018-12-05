const { load } = require('./loader');

const parseId = (id) => {
  const charCounts =  {};
  const chars = id.split("");
  chars.forEach(char => {
    const count = charCounts[char];
    charCounts[char] = count === undefined ? 1 : count + 1;
  });

  return {
    hasDouble: Object.values(charCounts).includes(2),
    hasTriple: Object.values(charCounts).includes(3)
  };
}


const computeChecksum = (ids) => {
  const counts = ids.map(parseId);
  const sums = counts.reduce((accum, el) => {
    if (el.hasDouble) {
      accum.doubles++;
    }

    if (el.hasTriple) {
      accum.triples++;
    }

    return accum;
  }, {doubles: 0, triples: 0});

  return sums.doubles * sums.triples;
}

const findDifference = (a, b) => {
  diffs = 0;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      diffs += 1;
    }
  }

  return diffs;
}

const findOneOffIds = (ids) => {
  let match;
  ids.forEach((id, idx) => {
    ids.slice(idx + 1).forEach(nextId => {
      const diff = findDifference(id, nextId);
      if (diff === 1) {
        match = [id, nextId];
      }
    });
  });

  return match;
}

const removeDiff = ([a, b]) => {
  const chars = [];
  for (let char in a) {
    if (a[char] === b[char]) {
      chars.push(a[char])
    }
  }

  return chars.join("");
}

const findSameIdChars = (ids) => {
  const matchIds = findOneOffIds(ids);
  return removeDiff(matchIds);
}

const run = () => {
  const ids = load();
  const chksum = computeChecksum(ids);
  const almostSameId = findSameIdChars(ids);


  console.log(`The checksum is: ${JSON.stringify(chksum)}`);
  console.log(`The shared id chars are: ${almostSameId}`);
}

run();
