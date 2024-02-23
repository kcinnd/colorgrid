const gameContainer = document.getElementById('gameContainer');
const colors = ['brightBlue', 'deepYellow', 'tonedRed', 'black', 'ecoGreen'];
const colorRules = {
    brightBlue: ['left', 'right'],
    tonedRed: ['surrounding'],
    deepYellow: ['above', 'below'],
    ecoGreen: ['self', 'surrounding']
};
const colorChangeMap = {
    brightBlue: 'tonedRed',
    tonedRed: 'brightBlue',
    deepYellow: 'ecoGreen',
    ecoGreen: 'black'
};

// Function to initialize the game board
function createBoard() {
    // Create an array with a fixed number of each color
    let squares = Array(50).fill('black')
        .concat(Array(15).fill('ecoGreen'))
        .concat(Array(10).fill('deepYellow'))
        .concat(Array(10).fill('tonedRed'))
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
        switch(rule) {
            case 'left':
                changeColor(index - 1, colorChangeMap[color]);
                break;
            case 'right':
                changeColor(index + 1, colorChangeMap[color]);
                break;
            case 'above':
                changeColor(index - 10, colorChangeMap[color]);
                break;
            case 'below':
                changeColor(index + 10, colorChangeMap[color]);
                break;
            case 'surrounding':
                changeSurroundingColors(index, colorChangeMap[color]);
                break;
            case 'self':
                changeColor(index, 'black'); // Turns the clicked square black
                break;
        }
    });

    checkWinCondition();
}

// Function to change the color of a square
function changeColor(index, newColor) {
    if (index >= 0 && index < 100) {
        gameContainer.children[index].className = 'square ' + newColor;
    }
}

// Function to change the colors of the surrounding squares
function changeSurroundingColors(index, newColor) {
    [-1, 1, -10, 10, -9, -11, 9, 11].forEach(offset => {
        changeColor(index + offset, newColor);
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
