'use strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''
const gElBtn = document.querySelector('button')
const gElTimer = document.querySelector('.timer')

var gTime
var gBoard
var gGameInterval
var gIsClicked

const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: gSeconds
}

function init() {
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.isOn = true
    gElTimer.innerText = '00:00'
    stopTimer()
    gElBtn.innerText = '😃'
    gIsClicked = false
    gBoard = buildBoard()
    // randMines(gBoard)
    renderBoard()
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell

        }
    }
    board[0][1].isMine = true
    board[1][3].isMine = true
    checkMinesNeigh(board, 3, 1)
    setMinesNegsCount(board)
    console.table(board)
    return board;
}
function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            var tdId = `cell-${i}-${j}`
            var className = (cell.isShown) ? 'shown' : ''

            strHTML += `\t<td class="cell ${className}" 
            id="${tdId}" 
            oncontextmenu="cellMarked(this,${i},${j});return false;" onclick="cellClicked(this,${i},${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)
    const elCells = document.querySelector('.game-board')
    elCells.innerHTML = strHTML
    // var elCell = document.querySelector(`#cell-0-1`).innerText = MINE
    // var elCell1 = document.querySelector(`#cell-1-3`).innerText = MINE
}

function startGame() {
    if (!gIsClicked) {
        gGameInterval = setInterval(startTimer, 10)
        gIsClicked = true

    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            const mineCell = checkMinesNeigh(board, i, j)
            if (mineCell.mineCount) {
                currCell.minesAroundCount = mineCell.mineCount;
            }
        }
    }
    console.log('board:', board)
}

function checkMinesNeigh(board, cellI, cellJ) {
    const mineCellsCoords = []
    var mineCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            const mineCell = board[i][j]
            if (mineCell.isMine) {
                mineCellsCoords.push({ i, j })
                mineCount++
            }
        }
    }
    return { mineCellsCoords, mineCount }
}



function cellClicked(elCell, cellI, cellJ) {
    const cell = gBoard[cellI][cellJ]
    if (cell.isMarked || cell.isShown) return
    if (!gGame.isOn) return
    startGame()
    if (!cell.isMine) {
        cell.isShown = true
        if (cell.minesAroundCount === 0) expandShown(gBoard, elCell, cellI, cellJ)
        elCell.innerText = cell.minesAroundCount === 0 ? EMPTY : cell.minesAroundCount
        elCell.style.backgroundColor = '#bab5b5'
        renderCell(cellI, cellJ, elCell.innerText)
    } else {

        renderCell(cellI, cellJ, MINE)
    }
    // console.log('elCell:', elCell)
    // console.log('cell:', cell)
    // expandShown(board, elCell, cellI, cellJ)
    // renderBoard()
    // if (cell.isMine) {
    //     for (var i = 0; i < gBoard.length; i++) {
    //         for (var j = 0; j < gBoard[i].length; j++) {
    //             if (gBoard[i][j].isMine) renderCell(i, j, MINE)
    //             // elCell.style.backgroundColor = 'red'
    // }
    // renderBoard()
    //     }
    //     gElBtn.innerText = '😵'
    //     // checkGameOver()
    // } else { renderBoard() }
    // if (gGame.shownCount === (gBoard.length ** 2 - gLevel.MINES) &&
    //     gGame.markedCount === gLevel.MINES) {
    //     gElBtn.innerText = '😎'
    //     checkGameOver()
    // }
    // console.log('elCell:', elCell)
    // console.log('cell:', cell)
    // renderBoard()
}

function cellMarked(elCell, cellI, cellJ) {
    if (!gGame.isOn) return
    elCell.addEventListener('contextmenu', function (ev) {
        ev.preventDefault()
        return false
    }, false)

    startGame()
    if (cell.isMine) return
    const cell = gBoard[cellI][cellJ]
    if (!cell.isMarked) {
        elCell.innerText = FLAG
        cell.isMarked = true
        gGame.markedCount++
    } else {
        cell.isMarked = false
        elCell.innerText = ''
        gGame.markedCount--
    }
    if (gGame.shownCount === (gBoard.length ** 2 - gLevel.MINES) &&
        gGame.markedCount === gLevel.MINES) {
        gElBtn.innerText = '😎'
        checkGameOver()
    }
}

function checkGameOver() {
    gGame.isOn = false
    stopTimer()
}
function expandShown(board, elCell, row, col) {
    const cell = board[row][col]
    
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (i === row && j === col) continue;
            if (j < 0 || j >= board[i].length) continue;
            const currCell = board[i][j]
            if (currCell.isMarked || currCell.isShown || currCell.isMine) continue
            currCell.isShown = true
            elCell.innerText = cell.minesAroundCount === 0 ? EMPTY : cell.minesAroundCount
        }
    }

}

function randMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        const mineCell = getRandEmptyCell()
        var row = mineCell.i
        var col = mineCell.j
        board[row][col].isMine = true
    }
}

