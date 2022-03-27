const NUM_ROWS = 6
const NUM_TILES = 5

const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

const wordle = 'SUPER'

const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'ENTER',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  '«',
]

const guessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
]

let currentRow = 0
let currentTile = 0
let isGameOver = false

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement('div')
  rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
  guessRow.forEach((_guess, guessIndex) => {
    const tileElement = document.createElement('div')
    tileElement.setAttribute(
      'id',
      'guessRow-' + guessRowIndex + '-tile-' + guessIndex
    )
    tileElement.classList.add('tile')
    rowElement.append(tileElement)
  })
  tileDisplay.append(rowElement)
})

keys.forEach((key) => {
  const buttonElement = document.createElement('button')
  buttonElement.textContent = key
  buttonElement.setAttribute('id', key)
  buttonElement.addEventListener('click', () => handleClick(key))
  keyboard.append(buttonElement)
})

const handleClick = (key) => {
  console.log('clicked', key)
  if (key === '«') {
    deleteLetter()
    return
  }
  if (key === 'ENTER') {
    checkRow()
    return
  }
  addLetter(key)
}

const addLetter = (letter) => {
  if (currentRow < NUM_ROWS && currentTile < NUM_TILES) {
    const tileId = 'guessRow-' + currentRow + '-tile-' + currentTile
    const tile = document.getElementById(tileId)
    tile.textContent = letter
    tile.setAttribute('data', letter)
    guessRows[currentRow][currentTile] = letter
    currentTile++
  }
}

const deleteLetter = () => {
  if (currentRow < NUM_ROWS && currentTile > 0) {
    currentTile--
    const tileId = 'guessRow-' + currentRow + '-tile-' + currentTile
    const tile = document.getElementById(tileId)
    tile.textContent = ''
    tile.setAttribute('data', '')
    guessRows[currentRow][currentTile] = ''
  }
}

const checkRow = () => {
  const guess = guessRows[currentRow].join('')
  if (currentRow < NUM_ROWS && currentTile === NUM_TILES) {
    console.log(guess + ' ' + wordle) // debug
    flipTile()
    if (wordle === guess) {
      showMessage('Magnificent!')
      isGameOver = true
      return
    } else {
      if (currentRow >= NUM_ROWS - 1) {
        isGameOver = true
        showMessage('Game Over')
        return
      } else {
        currentRow++
        currentTile = 0
      }
    }
    // attempt.forEach((letter, letterIndex) => {

    // })
  }
}

const showMessage = (message) => {
  const messageElement = document.createElement('p')
  messageElement.textContent = message
  messageDisplay.append(messageElement)
  setTimeout(() => messageDisplay.removeChild(messageElement), 2000)
}

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter)
  key.classList.add(color)
}

const flipTile = () => {
  const rowId = 'guessRow-' + currentRow
  const rowTiles = document.getElementById(rowId).childNodes
  rowTiles.forEach((tile, index) => {
    const dataLetter = tile.getAttribute('data')
    setTimeout(() => {
      if (dataLetter === wordle[index]) {
        tile.classList.add('green-overlay')
        addColorToKey(dataLetter, 'green-overlay')
      } else if (wordle.includes(dataLetter)) {
        tile.classList.add('yellow-overlay')
        addColorToKey(dataLetter, 'yellow-overlay')
      } else {
        tile.classList.add('grey-overlay')
        addColorToKey(dataLetter, 'grey-overlay')
      }
    }, 500 * index)
  })
}
