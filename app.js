const NUM_ROWS = 6
const NUM_TILES = 5

const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

let wordle

const getWordle = () => {
  fetch('http://localhost:8000/word')
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      wordle = json.toUpperCase()
    })
    .catch((err) => console.log(err))
}
getWordle()

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
  if (!isGameOver) {
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
    fetch(`http://localhost:8000/check/?word=${guess}`)
      .then((response) => response.json())
      .then((json) => {
        if (json === 'Entry word not found') {
          showMessage('word not in list')
        } else {
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
        }
      })
      .catch((err) => console.log(err))
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
  let checkWordle = wordle
  const guess = []

  rowTiles.forEach((tile) => {
    guess.push({
      letter: tile.getAttribute('data'),
      color: 'grey-overlay',
    })
  })

  guess.forEach((guess, index) => {
    if (guess.letter === wordle[index]) {
      guess.color = 'green-overlay'
      checkWordle = checkWordle.replace(guess.letter, '')
    }
  })

  guess.forEach((guess, index) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = 'yellow-overlay'
      checkWordle = checkWordle.replace(guess.letter, '')
    }
  })

  rowTiles.forEach((tile, index) => {
    const dataLetter = tile.getAttribute('data')
    setTimeout(() => {
      tile.classList.add('flip')
      tile.classList.add(guess[index].color)
      addColorToKey(guess[index].letter, guess[index].color)
    }, 500 * index)
  })
}
