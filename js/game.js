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
    SIZE: 6,
    MINES: 5
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
    randMines(gBoard)
    setMinesNegsCount(gBoard)

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
    // board[0][1].isMine = true
    // board[1][3].isMine = true
    // checkMinesNeigh(board, 3, 1)
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
    elCell.classList.add('shown')
    if (!cell.isMine) {
        gGame.shownCount++
        cell.isShown = true
        elCell.innerText = cell.minesAroundCount === 0 ? EMPTY : cell.minesAroundCount
        if (cell.minesAroundCount === 0) expandShown(gBoard, cellI, cellJ)
        renderCell(cellI, cellJ, elCell.innerText)
    } else {
        elCell.classList.add('mine')
        renderCell(cellI, cellJ, MINE)
        gElBtn.innerText = '😵'
        checkGameOver()
    }


    if (gGame.shownCount === (gBoard.length ** 2 - gLevel.MINES) &&
        gGame.markedCount === gLevel.MINES) {
        gElBtn.innerText = '😎'
        checkGameOver()
    }
    console.log('shownCount:', gGame.shownCount)
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
function expandShown(board, row, col) {
    const cell = board[row][col]

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (i === row && j === col) continue;
            if (j < 0 || j >= board[i].length) continue;
            const currCell = board[i][j]
            if (currCell.isMarked || currCell.isShown || currCell.isMine) continue
            currCell.isShown = true
            var elCell = document.querySelector(`#cell-${i}-${j}`)
            gGame.shownCount++
            elCell.innerText = currCell.minesAroundCount === 0 ? EMPTY : currCell.minesAroundCount
            elCell.classList.add('shown')
            // console.log('elCell:', elCell)
        }
    }

}

function randMines(board) {
    const minesPos = []
    const size = gLevel.SIZE
    const mineCount = gLevel.MINES

    for (var i = 0; i < mineCount; i++) {
        const iPos = getRandomInt(0, size - 1)
        const jPos = getRandomInt(0, size - 1)
        const cell = board[iPos][jPos]
        if (!cell.isMine) {
            cell.isMine = true
            minesPos.push(cell)
        }
    }

    return minesPos
}

