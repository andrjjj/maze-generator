let cols, rows;
let w = 25; // Width of each cell
let grid = [];
let current;
let stack = [];
let osc;
let splashScreenDisplayed = true;
let audioStarted = false;


function setup() {
  createCanvas(windowWidth, windowHeight);
  getAudioContext().suspend();
  cols = floor(width / w);
  rows = floor(height / w);
  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(2000); // Initial frequency
  osc.amp(0); // Initial amplitude
  osc.start();

  // Creating grid
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  current = grid[0];
}

function draw() {
  if (splashScreenDisplayed) {
    displaySplashScreen();
  } else {
    background(51);
    for (let i = 0; i < grid.length; i++) {
      grid[i].show();
    }
    current.visited = true;
    current.highlight();
    let next = current.checkNeighbors();
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
      // Play tone
      osc.freq(map(current.i + current.j, 0, cols + rows, 100, 1000));
      osc.amp(0.5, 0.1); // Set amplitude
    } else if (stack.length > 0) {
      current = stack.pop();
    }
  }
}

function displaySplashScreen() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Random Maze Generator", width / 2, height / 2 - 50);
  textSize(10);
  text("By Andrea Simon. Press spacebar to generate a maze", width / 2, height / 2 + 50);
  textSize(12);
  text("Click here to see original code", width / 2, height / 2 + 100);
}

function keyPressed() {
   if (!audioStarted) {
        userStartAudio();
        audioStarted = true;
    }
  if (splashScreenDisplayed && keyCode === 32) {
    splashScreenDisplayed = false;
  } else if (!splashScreenDisplayed && keyCode === 32) {
    resetMaze();
  }
}

function mouseClicked() {
  if (splashScreenDisplayed && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 85 && mouseY < height / 2 + 115) {
    window.open("https://editor.p5js.org/andrjjjjjj/sketches/_nULWZ7IW", "_blank");
  }}

function resetMaze() {
  stack = [];
  grid = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  current = grid[0];
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
  }

  show() {
    let x = this.i * w;
    let y = this.j * w;
    stroke(255);
    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }

    if (this.visited) {
      noStroke();
      fill(0, 0, 0, 100);
      rect(x, y, w, w);
    }
  }

  highlight() {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();
    fill(1000, 1000, 1000, 100);
    rect(x, y, w, w);
  }

  checkNeighbors() {
    let neighbors = [];
    let top = grid[index(this.i, this.j - 1)];
    let right = grid[index(this.i + 1, this.j)];
    let bottom = grid[index(this.i, this.j + 1)];
    let left = grid[index(this.i - 1, this.j)];
    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }
    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
