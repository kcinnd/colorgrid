const gameContainer = document.getElementById('gameContainer');
const colors = ['brightBlue', 'deepYellow', 'tonedRed', 'black', 'ecoGreen'];
const colorRules = {
    brightBlue: ['selfBlack', 'surroundingYellow'], // New behavior for brightBlue
    tonedRed: ['surrounding'],
    deepYellow: ['above', 'below'],
    ecoGreen: ['selfBlack', 'surrounding']
};

const colorChangeMap = {
    brightBlue: 'deepYellow', // When bright blue is clicked, surrounding squares turn yellow (not tonedRed)
    ecoGreen: 'black', // When eco green is clicked, it and surrounding squares turn black
    tonedRed: 'brightBlue', // Surrounding squares turn blue when toned red is clicked (unchanged)
    deepYellow: 'ecoGreen', // Above and below squares turn green when deep yellow is clicked (unchanged)
    selfBlack: 'black', // Used for turning the clicked square black (for brightBlue and ecoGreen)
    surroundingYellow: 'deepYellow' // This specific mapping might not be necessary if using direct color values
};

// Function to initialize the game board
const gameContainer = document.getElementById('gameContainer');

// Define color rules and mappings
const colorRules = {
    brightBlue: ['selfBlack', 'surroundingYellow'],
    tonedRed: ['surroundingBlue'],
    deepYellow: ['aboveBelowGreen'],
    ecoGreen: ['selfSurroundingBlack']
};

// Initialize the game board with a fixed number of each color
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
        square.addEventListener('click', handleSquareClick);
        gameContainer.appendChild(square);
    });
}

// Shuffle the squares array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Handle square click events
function handleSquareClick(event) {
    const square = event.target;
    const color = square.classList[1];
    const index = [...gameContainer.children].indexOf(square);

    if (color === 'brightBlue') {
        changeColor(index, 'black'); // Blue turns itself black
        changeSurroundingColors(index, 'deepYellow'); // Surrounding squares turn yellow
    } else if (color === 'ecoGreen') {
        changeColor(index, 'black'); // Green turns itself black
        changeSurroundingColors(index, 'black'); // Surrounding squares turn black
    } else if (color === 'tonedRed') {
        changeSurroundingColors(index, 'brightBlue'); // Surrounding squares turn blue
    } else if (color === 'deepYellow') {
        changeAboveBelow(index, 'ecoGreen'); // Above and below squares turn green
    }

    checkWinCondition();
}

// Change the color of a specific square
function changeColor(index, newColor) {
    if (index >= 0 && index < 100) {
        gameContainer.children[index].className = 'square ' + newColor;
    }
}

// Change the colors of the surrounding squares
function changeSurroundingColors(index, newColor) {
    const row = Math.floor(index / 10);
    const col = index % 10;
    const offsets = [
        {rowOffset: -1, colOffset: 0}, // Above
        {rowOffset: 1, colOffset: 0}, // Below
        {rowOffset: 0, colOffset: -1}, // Left
        {rowOffset: 0, colOffset: 1}, // Right
        {rowOffset: -1, colOffset: -1}, // Top Left
        {rowOffset: -1, colOffset: 1}, // Top Right
        {rowOffset: 1, colOffset: -1}, // Bottom Left
        {rowOffset: 1, colOffset: 1} // Bottom Right
    ];

    offsets.forEach(({rowOffset, colOffset}) => {
        const newRow = row + rowOffset;
        const newCol = col + colOffset;
        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
            const targetIndex = newRow * 10 + newCol;
            changeColor(targetIndex, newColor);
        }
    });
}

// Change the colors of the squares above and below the clicked square
function changeAboveBelow(index, newColor) {
    const above = index - 10;
    const below = index + 10;
    if (above >= 0) changeColor(above, newColor);
    if (below < 100) changeColor(below, newColor);
}

// Check if all squares are black (win condition)
function checkWinCondition() {
    const allBlack = [...gameContainer.children].every(square => square.classList.contains('black'));
    if (allBlack) {
        alert('Congratulations! You won!');
    }
}

createBoard(); // Initialize the game board
