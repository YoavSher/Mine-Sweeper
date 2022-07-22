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
var gCurrLevel

const gLevel = [
    {
        SIZE: 4,
        MINES: 2
    },
    {
        SIZE: 8,
        MINES: 12
    },
    {
        SIZE: 12,
        MINES: 30
    },
]

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: startTimer()
}

function init(level) {
    gCurrLevel = level
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.isOn = true
    gElTimer.innerText = '00:00'
    stopTimer()
    gElBtn.innerText = '😃'
    gIsClicked = false
    gBoard = buildBoard(gCurrLevel)
    randMines(gBoard, gCurrLevel)
    setMinesNegsCount(gBoard)
    renderBoard()
}

function buildBoard(level) {
    var board = [];
    for (var i = 0; i < gLevel[level].SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel[level].SIZE; j++) {
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
    // console.table(board)
    return board;
}
function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            const tdId = `cell-${i}-${j}`
            const neigCount = `neig-count-${cell.minesAroundCount}`
            var className = (cell.isShown) ? 'shown' : ''
            strHTML += `\t<td class="cell ${className} ${neigCount}" 
            id="${tdId}" 
            oncontextmenu="cellMarked(this,${i},${j});return false;" onclick="cellClicked(this,${i},${j})" >
                       </td>\n`
                    }
                    strHTML += `</tr>\n`
                }
                // console.log(strHTML)
                const elCells = document.querySelector('.game-board')
                elCells.innerHTML = strHTML
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
    // console.log('board:', board)
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
    console.log('secsPassed:',gGame.secsPassed)
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
        revelMines()
        checkGameOver()
    }


    if (gGame.shownCount === (gBoard.length ** 2 - gLevel[gCurrLevel].MINES) &&
        gGame.markedCount === gLevel[gCurrLevel].MINES) {
        gElBtn.innerText = '😎'
        checkGameOver()
    }
    // console.log('shownCount:', gGame.shownCount)
    console.log('gGame.shownCount:', gGame.shownCount)
    console.log('gBoard.length ** 2 - gLevel[gCurrLevel].MINES:', gBoard.length ** 2 - gLevel[gCurrLevel].MINES)
}

function cellMarked(elCell, cellI, cellJ) {
    if (!gGame.isOn) return
    elCell.addEventListener('contextmenu', function (ev) {
        ev.preventDefault()
        return false
    }, false)

    startGame()
    const cell = gBoard[cellI][cellJ]
    if (cell.isShown) return
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
        gGame.markedCount === gLevel[gCurrLevel].MINES) {
        gElBtn.innerText = '😎'
        checkGameOver()
    }
    console.log('gGame.markedCount:', gGame.markedCount)
    console.log('gLevel[gCurrLevel].MINES:', gLevel[gCurrLevel].MINES)
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
            elCell.classList.add('shown')
            elCell.innerText = currCell.minesAroundCount === 0 ? EMPTY : currCell.minesAroundCount
            if (currCell.minesAroundCount === 0) expandShown(board, i, j)
            // console.log('elCell:', elCell)
        }
    }

}

function randMines(board, level) {
    const minesPos = []
    const size = gLevel[level].SIZE
    const mineCount = gLevel[level].MINES

    for (var i = 0; i < mineCount; i++) {
        const iPos = getRandomInt(0, size - 1)
        const jPos = getRandomInt(0, size - 1)
        const cell = board[iPos][jPos]
        if (!cell.isMine) {
            cell.isMine = true
            minesPos.push(cell)
            // console.log('cell:', `${iPos},${jPos}`)
            console.log('mineCount:', mineCount)
        }
    }
    return minesPos
}

function revelMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j]
            const elMine = document.querySelector(`#cell-${i}-${j}`)
            if (cell.isMine) {
                elMine.classList.add('shown')
                elMine.innerText = MINE
            }
        }
    }
}