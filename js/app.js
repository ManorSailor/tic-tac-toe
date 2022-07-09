// Constants
const board = [...document.getElementById('board').children];
const scores = [...document.getElementById('scores').children];
const currentScores = document.getElementsByClassName('score');
const players = ['X', 'O'];

let currentPlayer = players[0];
let filledBoxes = new Set();

let gridEmpty = true;
let gameRunning = true;

function isEmpty(element) {
    let content = element.innerText;

    if (content === '') {
        return true;
    }
    return false;
}

function insert(element, item) {
    if (isEmpty(element)) {
        element.innerText = item;
        return item;
    }
    return undefined;
}

function switchPlayer(element) {
    if (element === undefined) {
        return currentPlayer;
    } else if (element === 'X') {
        toggleOpacity();
        return players[1];
    } else {
        toggleOpacity();
        return players[0];
    }
}

function toggleOpacity() {
    for (let i = 0; i < scores.length; i++) {
        if (scores[i].innerText.includes('Tie')) {
            continue;  
        }
        scores[i].classList.toggle('opaque');
    }
}

function fillGrid(box) {
    filledBoxes.add(box);
    if (filledBoxes.size === 9) {
        gridEmpty = false;
    }
}

function checkWinner() {
    if (filledBoxes.size < 3) {
        return;
    }

    const winningPaths = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    
    let xScore = (isNaN(currentScores[0].innerText)) ? 0 : parseInt(currentScores[0].innerText);
    let ties = (isNaN(currentScores[1].innerText)) ? 0 : parseInt(currentScores[1].innerText);
    let oScore = (isNaN(currentScores[2].innerText)) ? 0 : parseInt(currentScores[2].innerText);

    for (let i = 0; i < winningPaths.length; i++) {
        let path0 = winningPaths[i][0];
        let path1 = winningPaths[i][1];
        let path2 = winningPaths[i][2];
        
        let element0 = board[path0].innerText;
        let element1 = board[path1].innerText;
        let element2 = board[path2].innerText;

        if (element0 !== "" && element0 === element1 && element0 === element2) {
            if (element0 === 'X') {
                xScore += 1;
                toggleOpacity();
                scores[0].classList.add('winner');
                currentScores[0].classList.add('winner');
                currentScores[0].innerText = xScore;
            } else if (element0 === 'O') {
                oScore += 1;
                toggleOpacity();
                scores[2].classList.add('winner');
                currentScores[2].innerText = oScore;
                currentScores[2].classList.add('winner');
            }
            gameRunning = false;
            return;
        }
    }
    if (!gridEmpty) {
        ties += 1;
        currentScores[1].innerText = ties;
        gameRunning = false;
    }
}

function resetGame() {
    for (box of filledBoxes) {
        board[box].innerText = '';
    }
    gridEmpty = true;
    gameRunning = true;
    filledBoxes.clear();
    toggleOpacity();
    currentPlayer = players[0];
    scores[0].classList.remove('winner');
    scores[2].classList.remove('winner');
    currentScores[0].classList.remove('winner');
    currentScores[2].classList.remove('winner');
}

board.forEach((box, boxIndex) => {
    box.addEventListener('click', (e) => {
        if (gridEmpty && gameRunning) {
            let result = insert(e.target, currentPlayer);
            currentPlayer = switchPlayer(result);
            fillGrid(boxIndex);
            checkWinner();
        } else {
            resetGame();
        }
    });
});