const fs = require('fs');

const parseCoords = data => {
  const [ x, y ] = data.split(",");
  return {
    x: Number(x),
    y: Number(y)
  }
};

const load = () => fs.readFileSync('./practice.txt', 'utf-8')
  .trim()
  .split("\n")
  .map(parseCoords);

const findCorners = coords => {
  const [ first ] = coords;
  let w = first;
  let n = first;
  let e = first;
  let s = first;


  coords.slice(1).forEach(pt => {
    if (pt.x < w.x) {
      w = pt;
    }

    if (pt.y < n.y) {
      n = pt;
    }

    if (pt.x > e.x) {
      e = pt;
    }

    if (pt.y > s.y) {
      s = pt;
    }
  })

  return { w, n, e, s };
};

const buildGrid = (width, height) => {
  const board = [];
  for (let x = 0; x <= height; x += 1) {
    const row = [];
    for (let y = 0; y <= width; y += 1) {
      row.push({
        x,
        y,
        state: null
      });
    }

    board.push(row);
  }

  return board;
};

const placeCoords = (grid, coords, corners) => {

  coords.forEach(pt => {
    const x = pt.x - corners.w.x;
    const y = pt.y - corners.n.y;

    grid[x][y].state = 'pt';
  });
};

const computeDistances = (coords) => {
  corners = findCorners(coords);
  const width = corners.e.x - corners.w.x + 1;
  const height = corners.s.y - corners.n.y + 1;

  const grid = buildGrid(width, height);
  placeCoords(grid, coords, corners);
  console.log(grid);
}

const run = () => {
  const coords = load();
  const ret = computeDistances(coords);
};

run();
