const gameContainer = document.getElementById('gameContainer');
const colors = ['brightBlue', 'deepYellow', 'tonedRed', 'black', 'ecoGreen'];
const colorRules = {
    brightBlue: ['selfBlack', 'surroundingYellow'], // New behavior for brightBlue
    tonedRed: ['surrounding'],
    deepYellow: ['above', 'below'],
    ecoGreen: ['selfBlack', 'surrounding']
};

const colorChangeMap = {
    brightBlue: 'tonedRed',
    tonedRed: 'brightBlue',
    deepYellow: 'ecoGreen',
    ecoGreen: 'black',
    selfBlack: 'black', // Used for turning the clicked square black
    surroundingYellow: 'deepYellow', // Used for turning surrounding squares yellow
    surroundingBlack: 'black'
};

// Function to initialize the game board
function createBoard() {
    // Create an array with a fixed number of each color
    let squares = Array(50).fill('black')
        .concat(Array(5).fill('ecoGreen'))
        .concat(Array(15).fill('deepYellow'))
        .concat(Array(15).fill('tonedRed'))
        .concat(Array(15).fill('brightBlue'));

    // Shuffle the array to randomize the squares' positions
    squares = shuffleArray(squares);

    // Create each square and append it to the game container
    squares.forEach(color => {
        const square = document.createElement('div');
        square.classList.add('square', color);
        square.addEventListener('click', handleSquareClick);
        gameContainer.appendChild(square);
    });
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Function to get a random color
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to handle square click
function handleSquareClick(event) {
    const square = event.target;
    const color = square.classList[1];
    const index = [...gameContainer.children].indexOf(square);
    const rules = colorRules[color] || [];

    rules.forEach(rule => {
        if (rule === 'selfBlack') {
            changeColor(index, 'black'); // Turns the clicked square itself black
        } else if (rule === 'surroundingYellow') {
            changeSurroundingColors(index, 'deepYellow', row, col); // Turns surrounding squares yellow
        } else if (rule === 'surroundingBlack') {
            changeSurroundingColors(index, 'black', row, col); // Turns surrounding squares black
        } else {
            // Apply other rules as needed, e.g., for 'tonedRed' or 'deepYellow'
            if (color === 'tonedRed') {
                // For tonedRed, you might want to change all surrounding squares to a specific color
                changeSurroundingColors(index, 'brightBlue', row, col);
            } else if (color === 'deepYellow') {
                // For deepYellow, change above and below squares
                if (row > 0) changeColor(index - 10, 'ecoGreen'); // Above
                if (row < 9) changeColor(index + 10, 'ecoGreen'); // Below
            }
        }
    });

    checkWinCondition();
}

const directionOffsets = {
    'left': -1,
    'right': 1,
    'above': -10,
    'below': 10
};

// Function to change the color of a square
function changeColor(index, newColor) {
    if (index >= 0 && index < 100) {
        gameContainer.children[index].className = 'square ' + newColor;
    }
}

// Function to change the colors of the surrounding squares
function changeSurroundingColors(index, newColor, row, col) {
    const offsets = [
        { rowOffset: -1, colOffset: 0 }, // Above
        { rowOffset: 1, colOffset: 0 }, // Below
        { rowOffset: 0, colOffset: -1 }, // Left
        { rowOffset: 0, colOffset: 1 }, // Right
        { rowOffset: -1, colOffset: -1 }, // Top Left
        { rowOffset: -1, colOffset: 1 }, // Top Right
        { rowOffset: 1, colOffset: -1 }, // Bottom Left
        { rowOffset: 1, colOffset: 1 } // Bottom Right
    ];

    offsets.forEach(({ rowOffset, colOffset }) => {
        const newRow = row + rowOffset;
        const newCol = col + colOffset;
        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
            const targetIndex = newRow * 10 + newCol;
            changeColor(targetIndex, newColor);
        }
    });
}

// Function to check the win condition
function checkWinCondition() {
    const allBlack = [...gameContainer.children].every(square => square.classList.contains('black'));
    if (allBlack) {
        alert('Congratulations! You won!');
    }
}

createBoard(); // Initialize the game board
