"use strict";

const gameContainer = document.getElementById('game-container');
const maze = document.getElementById('maze');
const startTextContainer = document.getElementById('start-text-container');
const nextButton = document.getElementById('next-button');
const startButton = document.getElementById('start-button');
const nextlv= document.getElementById('next-level-button');

const sentences = [
  'これは不思議な迷宮で',
  'この迷宮で必要なのは…',
  'ゴールまでの経路を見つけるためにブロックを回転させる',
  '準備はいいでしょうか?'
];
const messageContainer = document.getElementById('message-container');
let currentIndex = 0;
let startText = null;

function showNextSentence() {
  if (startText) {
    startText.classList.add('fadeOut');
  }

  setTimeout(() => {
    startTextContainer.innerHTML = '';

    startText = document.createElement('div');
    startText.classList.add('start-text');
    startText.textContent = sentences[currentIndex];

    startTextContainer.appendChild(startText);

    setTimeout(() => {
      startText.style.opacity = '1';
    }, 100);

    currentIndex++;

    if (currentIndex < sentences.length) {
      nextButton.style.display = 'block';
    } else {
      nextButton.style.display = 'none';
      startButton.style.display = 'block';
    }
  }, 500);
}
showNextSentence();
function startGame() {
  // Shuffle the cells
  shuffle();
  startButton.style.display = 'none';
  startTextContainer.style.display = 'none';
  messageContainer.style.display = 'none';
  gameContainer.style.display = 'block';
  maze.style.display = 'grid';

  // 开始进行游戏的其他相关操作
  // Register event handlers
  registerEventRotate(currentCellIndex);

  // Add css to the passable cells and register the event handler to move to the neighborhood cells. 
  addCssToPassableCells();
}

/* <<<<<<< Added contents begins (23/07/17) */

function shiftRightByOne(obj) {
  const temp = obj.left;
  obj.left = obj.bottom;
  obj.bottom = obj.right;
  obj.right = obj.top;
  obj.top = temp;
  if (obj.rotationCount === 3) {
      obj.rotationCount = 0;
  } else {
      obj.rotationCount++;
  }
  // console.log("shiftRightByOne:", JSON.stringify(obj));
}

function setRandomRotation(obj, direction) {
  const randomValue = Math.floor(Math.random() * 2) + 1;
  let count = 0;

  while (count < randomValue) {
    shiftRightByOne(obj);
      if (obj[direction] === 1) {
          count++;
      }
  }
}

// Shuffle the cell
function shuffle() {
  /* <<<<<<< Changed contents begins (23/07/21) */
  // Randomly rotate the blocks, except for the points of start and goal.
  // for (let n = 1; n < pathBackgrounds.length-1; n++) {
  //   const randomNum = Math.floor(Math.random() * 4);
  //   for (let j = 0; j < randomNum; j++) {
  //     shiftRightByOne(cellStates[n]);
  //   }
  //   pathBackgrounds[n].style.transform = `rotate(${90 * cellStates[n].rotationCount}deg)`; // 0 or 90 or 180 or 270 degree
  // }
  /* >>>>>>> Changed contents ends (23/07/21) */

  // Randomly rotate the blocks, but the game can be played.
  for (let i = 1; i < correctPath.length-1; i++) {
    const previousPathIndex = correctPath[i-1];
    const currentPathIndex = correctPath[i];
    const previousRow = Math.floor(previousPathIndex / size);
    const previousColumn = previousPathIndex % size;
    const currentRow = Math.floor(currentPathIndex / size);
    const currentColumn = currentPathIndex % size;
    let currentEntrance;

    if (currentRow === previousRow) {
        if (currentColumn < previousColumn) { currentEntrance = "right"; } else { currentEntrance = "left"; }
    } else {
        if (currentRow > previousRow) { currentEntrance = "top"; } else { currentEntrance = "bottom"; }
    }

    // console.log("path-", correctPath[i]);
    setRandomRotation(cellStates[currentPathIndex], currentEntrance);
    // console.log(cellStates[correctPath[i]]);
    pathBackgrounds[currentPathIndex].style.transform = `rotate(${90 * cellStates[currentPathIndex].rotationCount}deg)`; // 0 or 90 or 180 or 270 degrees
  }
  // // To repair start point
  // let startCell = cellStates[cellStates.length-1];
  // startCell.top = 1;
  // startCell.right = 0;
  // startCell.bottom = 0;
  // startCell.left = 0;
  // startCell.rotationCount = 1;
  // pathBackgrounds[cellStates.length-1].style.transform = `rotate(${90 * startCell.rotationCount}deg)`;
}

// Note: The direction must be "Up", "Right", "Left" or "Down". 
// 4 directions only and uppercase for the first letter. 
function setAnimationOfExplorer(direction) {
  const imgExplorer = document.getElementById("explorer");
  imgExplorer.classList.add(`explorerMove${direction}`);
}

function createImgOfExplorer(cellNumber) {
  const cellClass = document.getElementsByClassName("cell");
  const imgExplorer = document.createElement("img");
  imgExplorer.setAttribute("src", "images/player.png");
  imgExplorer.setAttribute("alt", "player");
  imgExplorer.setAttribute("id", "explorer");
  cellClass[cellNumber].appendChild(imgExplorer); // Add an img element as a child element of "cell" class (to avoid rotating the img element.)
}

function createImgOfFlag(cellNumber) {
  const cellClass = document.getElementsByClassName("cell");
  const imgFlag = document.createElement("img");
  imgFlag.setAttribute("src", "images/flag.png");
  imgFlag.setAttribute("alt", "goal");
  imgFlag.setAttribute("id", "flag");
  cellClass[cellNumber].appendChild(imgFlag); // Add an img element as a child element of "cell" class (to avoid rotating the img element.)
}

function deleteImgOfExplorer() {
  const imgExplorer = document.getElementById("explorer");
  imgExplorer.remove();
}

/* <<<<<<< Changed contents begins (23/07/21) */
/* <<<<<<< Changed contents begins (23/07/22) */

function addRotateAnimation(event) {
  // When rotate animation begins, disable the event("click", moveToCell)
  for (const neighborhoodCellIndex of neighborhoodCellsIndexGlobal) {
    pathBackgrounds[neighborhoodCellIndex].classList.add("event-disabled");
  }

  const currentCell = event.currentTarget;
  const cellIndex = Number(currentCell.id.slice(5));
  let rotationCount = cellStates[cellIndex].rotationCount;
  // Rotate the cell 90 degrees. 
  currentCell.classList.add(`rotateFrom${90*rotationCount}To${90*(rotationCount+1)}Deg`);
}
/* >>>>>>> Changed contents ends (23/07/22) */

function rotateCell(event) {
  // Reflect the cell states to HTML 
  // for (let i = 0; i < cellStates.length; i++) {
  //   pathBackgrounds[i].classList.add(cellStates[i].cellType);
  //   pathBackgrounds[i].style.transform = `rotate(${90*(cellStates[i].rotationCount)}deg)`; // 0 or 90 or 180 or 270 degree
  // }

  for (const neighborhoodCellIndex of neighborhoodCellsIndexGlobal) {
    pathBackgrounds[neighborhoodCellIndex].classList.remove("event-disabled");
  }
  
  // Remove event handler
  for (const passableCellIndex of passableCellIndexGlobal) {
    pathBackgrounds[passableCellIndex].removeEventListener("click", moveToCell);
    console.log("@rotateCell remove event moveToCell:", passableCellIndex);
  }

  const currentCell = event.currentTarget;
  const cellIndex = Number(currentCell.id.slice(5));
  // currentCellIndex = cellIndex;
  let rotationCount = cellStates[cellIndex].rotationCount;
  // Set the rotation of the cell to the angle of animation ends. 
  currentCell.style.transform = `rotate(${90*(rotationCount+1)}deg)`; // 0 or 90 or 180 or 270 degree
  console.log("Transform rotate is changed at index-", currentCellIndex);
  currentCell.classList.remove(`rotateFrom${90*rotationCount}To${90*(rotationCount+1)}Deg`);
  shiftRightByOne(cellStates[cellIndex]);

  // Add css to the passable cells and register the event handler to move to the neighborhood cells. 
  addCssToPassableCells();
}

function addCssToPassableCells() {
  // Check passable
  const [passableCellsIndex, neighborhoodCellsIndex] = checkPassable(currentCellIndex);
  passableCellIndexGlobal = passableCellsIndex;
  neighborhoodCellsIndexGlobal = neighborhoodCellsIndex;
  // Remove css (.border-color) from neighborhood cells
  for (const neighborhoodCellIndex of neighborhoodCellsIndexGlobal) {
    pathBackgrounds[neighborhoodCellIndex].classList.remove("border-color");
  }
  // Add css (.border-color) to passable cells
  if (passableCellIndexGlobal.length > 0) {
    for (const passableCellIndex of passableCellIndexGlobal) {
      pathBackgrounds[passableCellIndex].classList.add("border-color");
      pathBackgrounds[passableCellIndex].addEventListener("click", moveToCell);
      console.log("@addCssToPassableCells register event moveToCell:", passableCellIndex);
    }
  }
}

function checkCorrectPathMade() {
  let isFound = false;
  for (let i = 0; i < correctPath.length-1; i++) {
    const [passableCellsIndex, neighborhoodCellsIndex] = checkPassable(correctPath[i]);
    isFound = passableCellsIndex.includes(correctPath[i+1]);
    console.log(correctPath[i+1], isFound);
    const currentCellType = cellStates[correctPath[i]].cellType;
    // console.log(`${currentCellType}-completed`);
    // Add css for completed path
    pathBackgrounds[correctPath[i]].classList.add(`${currentCellType}-completed`);
    if (!isFound) {
      break;
    }
  }
  if (isFound) {
    // Add css for completed path (at goal point)
    pathBackgrounds[correctPath[correctPath.length-1]].classList.add("cell-goal-completed");
  }
  return isFound;
}

function registerEventRotate(currentCellIndex) {
  // Register event handlers
  pathBackgrounds[currentCellIndex].addEventListener("click", addRotateAnimation);
  pathBackgrounds[currentCellIndex].addEventListener("animationend", rotateCell);
}

function removeEventRotate(currentCellIndex) {
  // Register event handlers
  pathBackgrounds[currentCellIndex].removeEventListener("click", addRotateAnimation);
  pathBackgrounds[currentCellIndex].removeEventListener("animationend", rotateCell);
}

function celebrateAnimation() {
  var count = 200;
  var defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

function moveToCell(event) {
  const cell = event.currentTarget;
  const cellIndex = Number(cell.id.slice(5));

  // Display the player image on the current cell
  deleteImgOfExplorer();
  createImgOfExplorer(cellIndex);

  // Remove event handlers
  removeEventRotate(currentCellIndex);

  // Change current cell index
  currentCellIndex = cellIndex;

  // Remove events
  pathBackgrounds[currentCellIndex].classList.remove("border-color");
  for (const passableCellIndex of passableCellIndexGlobal) {
    pathBackgrounds[passableCellIndex].classList.remove("border-color");
    pathBackgrounds[passableCellIndex].removeEventListener("click", moveToCell);
    console.log("@moveToCell remove event moveToCell:", passableCellIndex);
  }
  
  // If reached th goal and is made correct path, the game has completed.
  if (currentCellIndex == 0) {
    if (checkCorrectPathMade()) {
      console.log("You have reached the goal! ");
      // ゴールに到達した場合の処理
      messageContainer.textContent = "到達しました！";
      messageContainer.style.display = 'block';
      nextlv.style.display = 'block';
      over.style.display = 'block'
      // celebrateAnimation();
      // initGame(size=7);
      // startGame();
      // return; // ゴールに到達した場合は関数を終了する
    } else {
      // Remove css for completed path
      for (let i = 0; i < correctPath.length; i++) {
        const currentCellType = cellStates[correctPath[i]].cellType;
        pathBackgrounds[correctPath[i]].classList.remove(`${currentCellType}-completed`);
      }

      // Add css to the passable cells and register the event handler to move to the neighborhood cells. 
      addCssToPassableCells();
    }
  } else {
    // Register event handlers
    registerEventRotate(currentCellIndex);

    // Add css to the passable cells and register the event handler to move to the neighborhood cells. 
    addCssToPassableCells();
  }
}
/* >>>>>>> Changed contents ends (23/07/21) */
/* >>>>>>> Added contents ends (23/07/17) */

/* <<<<<<< Changed contents begins (23/07/22) */

function makeEmptyCellStates() {
  /* Global variable -> size */
  let cellStates = []; // Not a global variable
  const totalCells = size * size;
  for (let i = 0; i < totalCells; i++) {
      cellStates.push({cellType: "any", top: 0, right: 0, bottom: 0, left: 0, rotationCount: 0})
  }
  return cellStates;
}

function searchNeighborhoodCellsIndex(currentCellIndex) {
  /* Global variable -> size */
  let x = currentCellIndex % size;
  let y = Math.floor(currentCellIndex / size);
  // console.log(`x = ${x}, y = ${y}`);
  let neighborhoodCellsIndex = [];

  // The cell on the upper side of current cell.
  if (0 <= y-1 && y-1 < size) {
      neighborhoodCellsIndex.push(currentCellIndex - size);
  }

  // The cell on the lower side of current cell.
  if (0 <= y+1 && y+1 < size) {
      neighborhoodCellsIndex.push(currentCellIndex + size);
  }

  // The cell on the left side of current cell.
  if (0 <= x-1 && x-1 < size) {
      neighborhoodCellsIndex.push(currentCellIndex - 1);
  }

  // The cell on the right side of current cell.
  if (0 <= x+1 && x+1 < size) {
      neighborhoodCellsIndex.push(currentCellIndex + 1);
  }

  return neighborhoodCellsIndex;
}

function generateCorrectPath() {
  /* Global variables -> size */
  const startCellIndex = size * size - 1;
  let correctPath = [startCellIndex];
  let currentCellIndex = startCellIndex;
  let isCompleted = false;

  while (!isCompleted) {
      let neighborhoodCellsIndex = searchNeighborhoodCellsIndex(currentCellIndex);

      // Search neighborhood cell indexes not in correct path indexes. 
      // Reference: https://www.esz.co.jp/blog/2789.html
      let neighborhoodCellsIndexExceptCorrectPath = neighborhoodCellsIndex.filter(i => correctPath.indexOf(i) == -1);

      if (neighborhoodCellsIndexExceptCorrectPath.length > 0) {
          if (neighborhoodCellsIndexExceptCorrectPath.includes(0)) {
              correctPath.push(0);
              isCompleted = true;
          } else {
              currentCellIndex = neighborhoodCellsIndexExceptCorrectPath[Math.floor(Math.random() * neighborhoodCellsIndexExceptCorrectPath.length)];
              correctPath.push(currentCellIndex);
          }
      } else {
          // When it didn't reach the goal point 
          correctPath = [startCellIndex];
          currentCellIndex = startCellIndex;
      }
  }
  return correctPath;
}

function setRotationCountAndCellType(cellState) {
  const patterns = [
      // .cell-start
      { cellType: "cell-start", top: 0, right: 0, bottom: 0, left: 1, rotationCount: 0 },
      { cellType: "cell-start", top: 1, right: 0, bottom: 0, left: 0, rotationCount: 1 },

      // .cell-goal
      { cellType: "cell-goal", top: 0, right: 1, bottom: 0, left: 0, rotationCount: 0 },
      { cellType: "cell-goal", top: 0, right: 0, bottom: 1, left: 0, rotationCount: 1 },

      // .cell-0
      { cellType: "cell-0", top: 0, right: 1, bottom: 0, left: 1, rotationCount: 0 },
      { cellType: "cell-0", top: 1, right: 0, bottom: 1, left: 0, rotationCount: 1 },

      // .cell-1
      { cellType: "cell-1", top: 1, right: 1, bottom: 0, left: 0, rotationCount: 0 },
      { cellType: "cell-1", top: 0, right: 1, bottom: 1, left: 0, rotationCount: 1 },
      { cellType: "cell-1", top: 0, right: 0, bottom: 1, left: 1, rotationCount: 2 },
      { cellType: "cell-1", top: 1, right: 0, bottom: 0, left: 1, rotationCount: 3 }
  ];
  let isMatch = false;
  for (let i = 0; i < patterns.length; i++) {
      if (cellState.top === patterns[i].top && cellState.right === patterns[i].right && cellState.bottom === patterns[i].bottom && cellState.left === patterns[i].left) {
        cellState.cellType = patterns[i].cellType; // Set "cellType" property.
        // Reference: https://developer.mozilla.org/ja/docs/Glossary/Deep_copy
        cellState.rotationCount = JSON.parse(JSON.stringify(patterns[i].rotationCount)); // Set "rotationCount" property.
        isMatch = true;
        break;
      }
  }
  if (!isMatch) {
      console.log(`Error@setRotationCountAndCellType\nAny patterns doesn't matched. cellState -> ${JSON.stringify(cellState)}`);
  }
}

function setCellStatesFromCorrectPath() {
  /* Global variable -> correctPath, size, cellStates */
  for (let i = 1; i < correctPath.length; i++) {
      const previousPathIndex = correctPath[i-1];
      const currentPathIndex = correctPath[i];
      const previousRow = Math.floor(previousPathIndex / size);
      const previousColumn = previousPathIndex % size;
      const currentRow = Math.floor(currentPathIndex / size);
      const currentColumn = currentPathIndex % size;
  
      if (currentRow === previousRow) {
          if (currentColumn < previousColumn) {
              cellStates[previousPathIndex].left = 1;
              cellStates[currentPathIndex].right = 1;
          } else {
              cellStates[previousPathIndex].right = 1;
              cellStates[currentPathIndex].left = 1;
          }
      } else {
          if (currentRow > previousRow) {
              cellStates[previousPathIndex].bottom = 1;
              cellStates[currentPathIndex].top = 1;
          } else {
              cellStates[previousPathIndex].top = 1;
              cellStates[currentPathIndex].bottom = 1;
          }
      }
      // Add rotation count and cell type to previous cell
      setRotationCountAndCellType(cellStates[previousPathIndex]);
  }
  // Add rotation count and cell type to goal cell
  setRotationCountAndCellType(cellStates[0]);
}

// Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/from
// Sequence generator function
// const range = (start, stop, step) => Array.from({ length: (stop - 1 - start) / step + 1}, (_, i) => start + (i * step));
const range = (start, stop) => Array.from({ length: stop - start}, (_, i) => start + i);

// Note: Except the cells of correct path
function setCellStatesRandomly() {
  /* Global variable -> correctPath, size, cellStates */
  let pathIndexAll = range(0, size*size);
  let pathIndexExceptCorrectPath = pathIndexAll.filter(i => correctPath.indexOf(i) == -1);

  const patterns = [
      // .cell-0
      { cellType: "cell-0", top: 0, right: 1, bottom: 0, left: 1, rotationCount: 0 },
      { cellType: "cell-0", top: 1, right: 0, bottom: 1, left: 0, rotationCount: 1 },
      // { cellType: "cell-0", top: 0, right: 1, bottom: 0, left: 1, rotationCount: 2 },
      // { cellType: "cell-0", top: 1, right: 0, bottom: 1, left: 0, rotationCount: 3 },

      // .cell-1
      { cellType: "cell-1", top: 1, right: 1, bottom: 0, left: 0, rotationCount: 0 },
      { cellType: "cell-1", top: 0, right: 1, bottom: 1, left: 0, rotationCount: 1 },
      { cellType: "cell-1", top: 0, right: 0, bottom: 1, left: 1, rotationCount: 2 },
      { cellType: "cell-1", top: 1, right: 0, bottom: 0, left: 1, rotationCount: 3 }
  ];

  for (const pathIndex of pathIndexExceptCorrectPath) {
    // Reference: https://developer.mozilla.org/ja/docs/Glossary/Deep_copy
      cellStates[pathIndex] = JSON.parse(JSON.stringify(patterns[Math.floor(Math.random() * patterns.length)]));
  }
}

function checkPassable(currentCellIndex) {
  let x = currentCellIndex % size;
  let y = Math.floor(currentCellIndex / size);
  console.log(`x = ${x}, y = ${y}`);
  let passableCellsIndex = [];
  let neighborhoodCellsIndex = [];

  // The cell on the upper side of current cell.
  if (0 <= y-1 && y-1 < size) {
      const upperCellIndex = currentCellIndex - size;
      neighborhoodCellsIndex.push(upperCellIndex);
      // Check passable
      if (cellStates[currentCellIndex].top * cellStates[upperCellIndex].bottom === 1) {
        passableCellsIndex.push(upperCellIndex);
      }
  }

  // The cell on the lower side of current cell.
  if (0 <= y+1 && y+1 < size) {
      const lowerCellIndex = currentCellIndex + size;
      neighborhoodCellsIndex.push(lowerCellIndex);
      // Check passable
      if (cellStates[currentCellIndex].bottom * cellStates[lowerCellIndex].top === 1) {
        passableCellsIndex.push(lowerCellIndex);
      }
  }
  
  // The cell on the left side of current cell.
  if (0 <= x-1 && x-1 < size) {
      const leftCellIndex = currentCellIndex - 1;
      neighborhoodCellsIndex.push(leftCellIndex);
      // Check passable
      if (cellStates[currentCellIndex].left * cellStates[leftCellIndex].right === 1) {
        passableCellsIndex.push(leftCellIndex);
      }
  }

  // The cell on the right side of current cell.
  if (0 <= x+1 && x+1 < size) {
      const rightCellIndex = currentCellIndex + 1;
      neighborhoodCellsIndex.push(rightCellIndex);
      // Check passable
      if (cellStates[currentCellIndex].right * cellStates[rightCellIndex].left === 1) {
        passableCellsIndex.push(rightCellIndex);
      }
  }

  return [passableCellsIndex, neighborhoodCellsIndex];
}


let neighborhoodCellsIndexGlobal = [];
let passableCellIndexGlobal = [];
let size = 3;
let cellStates;
let correctPath;
let pathBackgrounds;
let currentCellIndex;

function initGame(size) {
  while (maze.firstChild) {
    maze.removeChild(maze.firstChild);
  }

  // Make the cell states
  cellStates = makeEmptyCellStates();
  console.log("size =", cellStates.length);
  correctPath = generateCorrectPath();
  console.log("correctPath:", correctPath); 
  setCellStatesFromCorrectPath();
  setCellStatesRandomly();

  // Make the cells on HTML
  for (let i = 0; i < cellStates.length; i++) {
    const divCell = document.createElement("div");
    divCell.classList.add("cell");
    maze.appendChild(divCell);
    const divPathBackground = document.createElement("div");
    divPathBackground.setAttribute("id", `cell-${i}`);
    divPathBackground.classList.add("path-background");
    divCell.appendChild(divPathBackground);
  }

  // Change css
  maze.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  maze.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  pathBackgrounds = document.getElementsByClassName("path-background");

  // Reflect the cell states to HTML 
  for (let i = 0; i < cellStates.length; i++) {
    pathBackgrounds[i].classList.add(cellStates[i].cellType);
    pathBackgrounds[i].style.transform = `rotate(${90*(cellStates[i].rotationCount)}deg)`; // 0 or 90 or 180 or 270 degree
  }

  // Start point
  createImgOfExplorer(pathBackgrounds.length-1);

  // Goal point
  createImgOfFlag(0);

  currentCellIndex = pathBackgrounds.length - 1;
}

/* <<<<<<< Added contents ends (23/07/22) */

// Add event handler to start button
startButton.addEventListener("click", () => {
  initGame(size);
  startGame();
})

nextlv.addEventListener("click", () => {
  size += 1; // 「次へ」ボタンが押されたときにsizeを増やす
  initGame(size);
  startGame();
  nextlv.style.display = 'none';
})
over.addEventListener("click", () => {
  console.log(overgame.join(' '));
  document.body.style.display = 'none';
  size += 1;
  setTimeout(function() {
    document.body.style.display = 'block';
  }, 1000); 
});

// For test
// initGame(size=3);
// startGame();
