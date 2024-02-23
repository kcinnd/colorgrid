document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('gameContainer');
    const resetButton = document.getElementById('resetButton');

    const colorRules = {
        brightBlue: ['selfBlack', 'surroundingYellow'],
        tonedRed: ['surroundingBlue'],
        deepYellow: ['aboveBelowGreen'],
        ecoGreen: ['selfSurroundingBlack']
    };

    const colorChangeMap = {
        selfBlack: 'black',
        surroundingYellow: 'deepYellow',
        surroundingBlue: 'brightBlue',
        aboveBelowGreen: 'ecoGreen',
        selfSurroundingBlack: 'black'
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        gameContainer.innerHTML = '';
        let squares = Array(50).fill('black')
            .concat(Array(5).fill('ecoGreen'))
            .concat(Array(15).fill('deepYellow'))
            .concat(Array(15).fill('tonedRed'))
            .concat(Array(15).fill('brightBlue'));
        squares = shuffleArray(squares);

        squares.forEach(color => {
            const square = document.createElement('div');
            square.classList.add('square', color);
            square.style.width = '30px';
            square.style.height = '30px';
            square.style.float = 'left';
            square.style.border = '1px solid #000';
            square.addEventListener('click', handleSquareClick);
            gameContainer.appendChild(square);
        });
    }

    function handleSquareClick(event) {
        const square = event.target;
        const colorClasses = ['brightBlue', 'deepYellow', 'tonedRed', 'ecoGreen']; // List of possible color classes
        const color = colorClasses.find(cl => square.classList.contains(cl)); // Find the color class the square contains
    
        // Apply rules based on the color
        if (colorRules[color]) {
            colorRules[color].forEach(rule => {
                // Apply self-black rule
                if (rule === 'selfBlack') {
                    changeColor(Array.from(gameContainer.children).indexOf(square), 'black');
                }
    
                // Apply surrounding color change rules
                if (rule === 'surroundingYellow') {
                    changeSurroundingColors(Array.from(gameContainer.children).indexOf(square), 'deepYellow');
                } else if (rule === 'surroundingBlue') {
                    changeSurroundingColors(Array.from(gameContainer.children).indexOf(square), 'brightBlue');
                } else if (rule === 'aboveBelowGreen') {
                    changeAboveBelow(Array.from(gameContainer.children).indexOf(square), 'ecoGreen');
                } else if (rule === 'selfSurroundingBlack') {
                    changeColor(Array.from(gameContainer.children).indexOf(square), 'black'); // Self to black
                    changeSurroundingColors(Array.from(gameContainer.children).indexOf(square), 'black'); // Surrounding to black
                }
            });
        }
    
        checkWinCondition();
    }

    function changeColor(index, newColor) {
        if (index >= 0 && index < 100) {
            gameContainer.children[index].className = 'square ' + newColor;
        }
    }

    function changeSurroundingColors(index, newColor) {
        const row = Math.floor(index / 10);
        const col = index % 10;
        const offsets = [-11, -10, -9, -1, 1, 9, 10, 11].filter(offset => {
            const newRow = row + Math.floor(offset / 10);
            const newCol = col + offset % 10;
            return newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10;
        });

        offsets.forEach(offset => {
            changeColor(index + offset, newColor);
        });
    }

    function changeAboveBelow(index, newColor) {
        [-10, 10].forEach(offset => {
            if (index + offset >= 0 && index + offset < 100) {
                changeColor(index + offset, newColor);
            }
        });
    }

    function checkWinCondition() {
        const allBlack = Array.from(gameContainer.children).every(square => square.classList.contains('black'));
        if (allBlack) {
            alert('Congratulations! You won!');
        }
    }

    function resetGame() {
        createBoard();  // Call createBoard to reset the game
    }

    resetButton.addEventListener('click', resetGame);

    createBoard();  // Initialize the game board when the DOM is fully loaded
});
