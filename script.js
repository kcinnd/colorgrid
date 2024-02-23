const gameContainer = document.getElementById('gameContainer');

// Color transformation rules
const colorRules = {
    brightBlue: ['selfBlack', 'surroundingYellow'],
    tonedRed: ['surroundingBlue'],
    deepYellow: ['aboveBelowGreen'],
    ecoGreen: ['selfSurroundingBlack']
};

// Color change map for easy reference to what color to change to
const colorChangeMap = {
    selfBlack: 'black',
    surroundingYellow: 'deepYellow',
    surroundingBlue: 'brightBlue',
    aboveBelowGreen: 'ecoGreen',
    selfSurroundingBlack: 'black'
};

// Initialize the game board with specific counts of each color
function createBoard() {
    let squares = Array(50).fill('black')
        .concat(Array(5).fill('ecoGreen'))
        .concat(Array(15).fill('deepYellow'))
        .concat(Array(15).fill('tonedRed'))
        .concat(Array(15).fill('brightBlue'));
    squares = shuffleArray(squares);

    squares.forEach(color => {
        const square = document.createElement('div');
        square.classList.add('square', color);
        square.style.width = '30px'; // Set the size of squares
        square.style.height = '30px';
        square.style.float = 'left'; // Align squares in a grid format
        square.style.border = '1px solid #000'; // Optional: add borders to squares
        square.addEventListener('click', handleSquareClick);
        gameContainer.appendChild(square);
    });
}

// Shuffle function for the array of squares
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Handle click events on squares and apply the game rules
function handleSquareClick(event) {
    const square = event.target;
    const color = square.classList[1];
    const index = Array.from(gameContainer.children).indexOf(square);

    Object.entries(colorRules[color]).forEach(([key, value]) => {
        if (value.includes('selfBlack') || value.includes('selfSurroundingBlack')) {
            changeColor(index, colorChangeMap.selfBlack); // Change the clicked square to black
        }
        if (value.includes('surroundingYellow')) {
            changeSurroundingColors(index, colorChangeMap.surroundingYellow);
        }
        if (value.includes('surroundingBlue')) {
            changeSurroundingColors(index, colorChangeMap.surroundingBlue);
        }
        if (value.includes('aboveBelowGreen')) {
            changeAboveBelow(index, colorChangeMap.aboveBelowGreen);
        }
        if (value.includes('selfSurroundingBlack')) {
            changeSurroundingColors(index, colorChangeMap.selfSurroundingBlack);
        }
    });

    checkWinCondition();
}

// Change the color of a specific square
function changeColor(index, newColor) {
    if (index >= 0 && index < 100) {
        gameContainer.children[index].className = 'square ' + newColor;
    }
}

// Change the colors of the surrounding squares, accounting for edge cases
function changeSurroundingColors(index, newColor) {
    const row = Math.floor(index / 10);
    const col = index % 10;
    const offsets = [
        -11, -10, -9, -1, 1, 9, 10, 11
    ].filter(offset => {
        const newRow = row + Math.floor(offset / 10);
        const newCol = col + offset % 10;
        return newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10;
    });

    offsets.forEach(offset => {
        changeColor(index + offset, newColor);
    });
}

// Change the colors of the squares above and below the clicked square
function changeAboveBelow(index, newColor) {
    [-10, 10].forEach(offset => {
        if (index + offset >= 0 && index + offset < 100) {
            changeColor(index + offset, newColor);
        }
    });
}

// Check if all squares are black to determine the win condition
function checkWinCondition() {
    const allBlack = Array.from(gameContainer.children).every(square => square.classList.contains('black'));
    if (allBlack) {
        alert('Congratulations! You won!');
    }
}

createBoard(); // Call to initialize the game board
