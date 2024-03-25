"use strict";
console.log("We in")

// ********** MODEL ************* //
function mazeModel(rows, cols) {
    const maze = [];
    for (let i = 0; i < rows; i++) {
        maze.push([]);
        for (let j = 0; j < cols; j++) {
            maze[i].push({
                row: i,
                col: j,
                north: true,
                east: true,
                south: true,
                west: true,
                visited: false
            });
        }
    }
    return maze;
}

function generateMaze(rows, cols) {
    const maze = mazeModel(rows, cols); // Initializes the maze with walls

    // Start with all cells unvisited except a random starting point
    let startRow = Math.floor(Math.random() * rows);
    let startCol = Math.floor(Math.random() * cols);
    maze[startRow][startCol].visited = true;
    let unvisitedCount = rows * cols - 1;

    while (unvisitedCount > 0) {
        // Select a random unvisited cell
        let currentRow = Math.floor(Math.random() * rows);
        let currentCol = Math.floor(Math.random() * cols);
        while (maze[currentRow][currentCol].visited) {
            currentRow = Math.floor(Math.random() * rows);
            currentCol = Math.floor(Math.random() * cols);
        }

        let path = [{row: currentRow, col: currentCol}];
        let visiting = {}; // Keeps track of cells in the current path

        // Perform a random walk until we hit a visited cell
        while (!maze[currentRow][currentCol].visited) {
            let directions = ['north', 'east', 'south', 'west'];
            let dir = directions[Math.floor(Math.random() * directions.length)];
            let nextRow = currentRow, nextCol = currentCol;

            switch (dir) {
                case 'north': if (currentRow > 0) nextRow--; break;
                case 'east':  if (currentCol < cols - 1) nextCol++; break;
                case 'south': if (currentRow < rows - 1) nextRow++; break;
                case 'west':  if (currentCol > 0) nextCol--; break;
            }

            // Loop detection and erasure
            let key = `${nextRow},${nextCol}`;
            if (visiting[key]) { // Loop detected
                let loopStartIndex = path.findIndex(p => p.row === nextRow && p.col === nextCol);
                path = path.slice(0, loopStartIndex + 1); // Erase loop
            } else {
                path.push({row: nextRow, col: nextCol});
                visiting[key] = true; // Mark as visiting
            }

            currentRow = nextRow;
            currentCol = nextCol;
        }

        // Carve the path
        for (let i = 0; i < path.length - 1; i++) {
            let cell = path[i];
            let nextCell = path[i + 1];
            maze[cell.row][cell.col].visited = true; // Mark as visited
            unvisitedCount--;

            // Determine direction and remove walls between current cell and next cell
            if (nextCell.row < cell.row && cell.row > 0) {
                // Moving north
                maze[cell.row][cell.col].north = false;
                maze[nextCell.row][nextCell.col].south = false;
            } else if (nextCell.row > cell.row && cell.row < rows - 1) {
                // Moving south
                maze[cell.row][cell.col].south = false;
                maze[nextCell.row][nextCell.col].north = false;
            } else if (nextCell.col < cell.col && cell.col > 0) {
                // Moving west
                maze[cell.row][cell.col].west = false;
                maze[nextCell.row][nextCell.col].east = false;
            } else if (nextCell.col > cell.col && cell.col < cols - 1) {
                // Moving east
                maze[cell.row][cell.col].east = false;
                maze[nextCell.row][nextCell.col].west = false;
            }
        }
        // After finishing the path, ensure the last cell is marked as visited
        // This is critical because the while loop exits once it hits an already visited cell,
        // but doesn't mark the last cell in the path as visited.
        let lastCell = path[path.length - 1];
        if (!maze[lastCell.row][lastCell.col].visited) {
            maze[lastCell.row][lastCell.col].visited = true;
            unvisitedCount--;
        }
    }

// After generating the maze, choose start and goal locations
    startRow = Math.floor(Math.random() * rows);
    startCol = Math.floor(Math.random() * cols);
    let goalRow, goalCol;
    do {
        goalRow = Math.floor(Math.random() * rows);
        goalCol = Math.floor(Math.random() * cols);
    } while (goalRow === startRow && goalCol === startCol); // Ensure goal is different from start

    const startCell = { row: startRow, col: startCol };
    const goalCell = { row: goalRow, col: goalCol };

// Return the maze data structured similarly to the initial `mazeData`
    return { rows, cols, startCell, goalCell, maze };
}



// ********** CONTROLLER ******** //

// Generate maze similar to mazeData
const generatedMaze =  generateMaze(20, 20)
console.log(generatedMaze);
drawMaze(generatedMaze);



document.addEventListener("keypress", keyPress);
document.addEventListener("keyup", keyRelease);

const controls = {
    left: false,
    right: false,
    up: false,
    down: false,
};

function keyPress(event) {
    switch (event.key) {
        case "a":
        case "ArrowLeft": controls.left = true; break;
        case "d":
        case "ArrowRight": controls.right = true; break;
        case "w":
        case "ArrowUp": controls.up = true; break;
        case "s":
        case "ArrowDown": controls.down = true; break;
    }
    updatePosition(generatedMaze);
}

function keyRelease(event) {
    switch (event.key) {
        case "a":
        case "ArrowLeft": controls.left = false; break;
        case "d":
        case "ArrowRight": controls.right = false; break;
        case "w":
        case "ArrowUp": controls.up = false; break;
        case "s":
        case "ArrowDown": controls.down = false; break;
    }
}

function updatePosition(mazeData) {
    const currentRow = mazeData.startCell.row;
    const currentCol = mazeData.startCell.col;
    const mazeRows = mazeData.rows;
    const mazeCols = mazeData.cols;

    // Moving left
    if (controls.left && currentCol > 0) {
        if (!mazeData.maze[currentRow][currentCol].west && !mazeData.maze[currentRow][currentCol - 1].east) {
            mazeData.startCell.col--;
        }
    }
    // Moving right
    if (controls.right && currentCol < mazeCols - 1) {
        if (!mazeData.maze[currentRow][currentCol].east && !mazeData.maze[currentRow][currentCol + 1].west) {
            mazeData.startCell.col++;
        }
    }
    // Moving up
    if (controls.up && currentRow > 0) {
        if (!mazeData.maze[currentRow][currentCol].north && !mazeData.maze[currentRow - 1][currentCol].south) {
            mazeData.startCell.row--;
        }
    }
    // Moving down
    if (controls.down && currentRow < mazeRows - 1) {
        if (!mazeData.maze[currentRow][currentCol].south && !mazeData.maze[currentRow + 1][currentCol].north) {
            mazeData.startCell.row++;
        }
    }
    // Optionally, call a function to redraw or update the maze display here
    drawMaze(mazeData)
    winCheck(mazeData)

}

function winCheck(mazeObj){
    const start = mazeObj.startCell
    const goal = mazeObj.goalCell

    if (start.row === goal.row && start.col === goal.col) {
        showWin()
    }
}

// ********** VIEW ************* //

// Draw maze using the provided model
function drawMaze(mazeData) {
    const mazeElement = document.getElementById('maze');

    mazeElement.innerHTML = ''; // Clear previous maze

    const rows = mazeData.rows;
    const cols = mazeData.cols;
    const maze = mazeData.maze;
    const goalCell = mazeData.goalCell;
    const startCell = mazeData.startCell;


    // Set grid-template-columns property dynamically
    mazeElement.style.gridTemplateColumns = `repeat(${cols}, auto)`;
    mazeElement.style.gridTemplateRows = `repeat(${rows}, auto`;

    maze.forEach((row) => {
        row.forEach((cell) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            if (cell.north) cellElement.classList.add('north');
            if (cell.east) cellElement.classList.add('east');
            if (cell.south) cellElement.classList.add('south');
            if (cell.west) cellElement.classList.add('west');
            if (cell.row === startCell.row && cell.col === startCell.col) {
                cellElement.textContent = "🤠";
            } else if (cell.row === goalCell.row && cell.col === goalCell.col) {
                cellElement.textContent = "🏁";
            }


            mazeElement.appendChild(cellElement);
        });
    });
}

function changeCellColor(row, col, color) {
    const mazeElement = document.getElementById('maze');
    const cells = mazeElement.querySelectorAll('.cell');
    const index = row * mazeData.cols + col;

    if (index >= 0 && index < cells.length) {
        cells[index].style.backgroundColor = color;
    } else {
        console.error('Invalid row or column provided.');
    }
}

function showWin() {
    const confettiPieces = document.querySelectorAll('.confetti-piece');
    const winningText = document.querySelector('.winning-text')
    winningText.style.visibility = 'visible';
    confettiPieces.forEach(piece => {
        piece.style.visibility = 'visible';
    });
}




