const fs = require('fs');

const load = () => (
  fs.readFileSync('./data.txt', 'utf-8')
    .trim()
    .split("\n")
);

const parseClaim = (claim) => {
  const [id, x, y, width, height ] = claim
    .match(/(\d+)/g)
    .map(Number)

  return {
    x,
    y,
    width,
    height,
    id
  };
}

const claimCells = (grid, square, idx) => {
  for (let i = square.y; i < square.height + square.y; i += 1) {
    for (let j = square.x; j < square.width + square.x; j += 1 ) {
      grid[i][j] += 1;
    }
  }

  return grid;
}

const markBoard = (claims, squares) => {
  const grid = new Array();
  for (let i = 0; i < 1000; i += 1) {
    const row = [];
    for (let j = 0; j < 1000; j += 1) {
      row.push(0);
    }

    grid.push(row);
  }

  squares.forEach((square, idx) => claimCells(grid, square, idx));

  return grid;
}

const findOverlappingCells = (grid) => {
  return ret = grid.reduce((accum, row) => {
    let cnt = 0;
    return accum + row.reduce((rowCnt, cell) => {
      return cell > 1 ? rowCnt + 1 : rowCnt
    }, 0)
  }, 0)
}

const findNonOverlappingClaim = (grid, claims) => {

  return claims.find(claim => {
    let isOk = true;
    grid.slice(claim.y, claim.y + claim.height).forEach(row => {
      row.slice(claim.x, claim.x + claim.width).forEach(cell => {
        if (cell > 1) {
          isOk = false;
        }
      });
    });
    return isOk;
  })
    .id;
}

const run = () => {
  const claims = load();

  const squares = claims.map(parseClaim);
  const grid = markBoard(claims, squares);

  const overlappingClaimCount = findOverlappingCells(grid);
  const nonOverlappingClaim = findNonOverlappingClaim(grid, squares);

  console.log(`The number of overlapping claim cells is: ${overlappingClaimCount}`);
  console.log(`The id with a non-overlapping claim is ${nonOverlappingClaim}`);
}

run();

