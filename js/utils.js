
var gMilliseconds = 0
var gSeconds = 0
var gMinutes = 0


function renderCell(i, j, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`#cell-${i}-${j}`)
    // elCell.classList.add('shown')
    elCell.innerHTML = value
}

function getRandEmptyCell() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            // var cell = gBoard[i][j]
            var cell = { i, j }
            emptyCells.push(cell)
        }
    }
    var randInt = getRandomInt(0, emptyCells.length - 1)
    // console.log('randInt:', emptyCells)
    return emptyCells[randInt]
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function startTimer() {
    var elTimer = document.querySelector('.timer')
    gMilliseconds += 10
    if (gMilliseconds == 1000) {
        gMilliseconds = 0
        gSeconds++
        if (gSeconds == 60) {
            gSeconds = 0
            gMinutes++
        }
    }
    var m = gMinutes < 10 ? "0" + gMinutes : gMinutes
    var s = gSeconds < 10 ? "0" + gSeconds : gSeconds
    var ms = gMilliseconds < 10 ? "00" + gMilliseconds : gMilliseconds < 100 ? "0" + gMilliseconds : gMilliseconds
    elTimer.innerHTML = `${m}:${s}`
    return gSeconds
}

function stopTimer() {
    // var elTimer = document.querySelector('.timer')
    gMinutes = 0
    gMilliseconds = 0
    gSeconds = 0
    clearInterval(gGameInterval)
}
