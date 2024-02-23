const gameContainer = document.getElementById('gameContainer');
const colors = ['brightBlue', 'deepYellow', 'tonedRed', 'black', 'ecoGreen'];
const colorRules = {
    brightBlue: ['left', 'right'],
    tonedRed: ['surrounding'],
    deepYellow: ['above', 'below'],
    ecoGreen: ['surrounding']
};
const colorChangeMap = {
    brightBlue: 'tonedRed',
    tonedRed: 'brightBlue',
    deepYellow: 'ecoGreen',
    ecoGreen: 'black'
};

// Function to initialize the game board
function createBoard() {
    for (let i = 0; i < 100; i++) {
        const square = document.createElement('div');
        square.classList.add('square', getRandomColor());
        square.addEventListener('click', handleSquareClick);
        gameContainer.appendChild(square);
    }
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
