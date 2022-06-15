function initBoard() {
  const board = document.querySelector('.board');
  const cell = document.createElement('div');
  cell.classList.add('cell');
  let shift = 0;
  for (let i = 0; i < 64; i += 1) {
    const copy = cell.cloneNode();
    shift += i % 8 === 0;
    copy.classList.add((i + shift) % 2 !== 0 ? 'white' : 'black');
    board.appendChild(copy);
  }
}
function asciiToUnicode(char) {
  const charPosition = ['K', 'Q', 'R', 'B', 'N', 'P', 'k', 'q', 'r', 'b', 'n', 'p'];
  const symbol = [];
  for (let i = 12; i < 24; i += 1) {
    symbol.push(`&#98${i};`);
  }
  const pos = charPosition.indexOf(char);
  if (pos === -1) {
    return char;
  }
  return symbol[pos];
}
function unicodeToAscii(char) {
  const charPosition = ['K', 'Q', 'R', 'B', 'N', 'P', 'k', 'q', 'r', 'b', 'n', 'p'];
  const symbol = [];
  for (let i = 12; i < 24; i += 1) {
    symbol.push(9800 + i);
  }
  const pos = symbol.indexOf(char.charCodeAt());
  if (pos === -1) {
    return char;
  }
  return charPosition[pos];
}
function snapshotBoard() {
  const board = document.querySelector('.board');
  const cells = board.children;
  const data = [];
  for (let i = 0; i < 8; i += 1) {
    data.push([]);
    for (let j = 0; j < 8; j += 1) {
      const cell = cells[i * 8 + j];
      let figure = '';
      if (cell.contains(cell.querySelector('.figure'))) {
        figure = unicodeToAscii(cell.querySelector('.figure').textContent);
      }
      data[i].push(figure);
    }
  }
  return data;
}

function readFigure(rawdata) {
  const board = document.querySelector('.board');
  const cells = board.children;
  const old = snapshotBoard();
  const array = JSON.parse(rawdata);
  if (JSON.stringify(old) === rawdata) {
    return;
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      const cell = cells[i * 8 + j];
      if (array[i][j] !== '') {
        const figure = document.createElement('div');
        figure.classList.add('figure');
        figure.innerHTML = asciiToUnicode(array[i][j]);
        cell.innerHTML = '';
        cell.appendChild(figure);
      } else {
        cell.innerHTML = '';
      }
    }
  }
}
function makeStep() {
  const data = snapshotBoard();
  const status = document.querySelector('.status');
  fetch(`chess.php?action=step&step=${JSON.stringify(data)}`).then((res) => res.text()).then((res) => {
    status.innerText = res;
  });
}
function createSession() {
  const status = document.querySelector('.status');

  const feh = 'rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR';
  const data = [];
  for (let i = 0; i < 8; i += 1) {
    data.push([]);
    for (let j = 0; j < 8; j += 1) {
      data[i][j] = feh[i * 8 + j];
    }
  }
  fetch(`./chess.php?action=step&step=${JSON.stringify(data)}`).then((res) => res.text()).then((res) => {
    if (res !== '') {
      status.innerText = res;
    }
  });
}
function getCellFromPosition(top, left) {
  const board = document.querySelector('.board');
  const cells = board.children;
  for (let i = 0; i < cells.length; i += 1) {
    const item = cells[i];
    const width = item.offsetWidth;
    const height = item.offsetHeight;
    const pLeft = item.offsetLeft;
    const pTop = item.offsetTop;
    if (pTop <= top && pTop + height >= top && pLeft <= left && pLeft + width >= left) {
      return item;
    }
  }
  return null;
}
function userInput() {
  const board = document.querySelector('.board');
  const status = document.querySelector('.status');
  const figures = document.getElementsByClassName('figure');
  Array.from(figures).forEach((item) => {
    item.addEventListener('mousedown', () => {
      item.classList.add('drag');
    });
    item.addEventListener('mouseup', () => {
      const top = item.offsetTop;
      const left = item.offsetLeft;
      const width = item.offsetWidth;
      const height = item.offsetHeight;
      const cell = getCellFromPosition(top + height / 2, left + width / 2);
      if (cell === null) {
        status.innerHTML = 'Not valid cell';
      } else {
        cell.innerHTML = '';
        cell.appendChild(item);
      }
      item.classList.remove('drag');
      makeStep();
    });
  });
  board.addEventListener('mousemove', (ev) => {
    if (document.body.contains(document.querySelector('.drag'))) {
      const item = document.querySelector('.drag');
      const width = item.offsetWidth;
      const height = item.offsetHeight;
      item.style.left = `${ev.pageX - width / 2}px`;
      item.style.top = `${ev.pageY - height / 2}px`;
    }
  });
}
function updateBoard() {
  fetch('chess.php?action=get').then((res) => res.text()).then((res) => {
    readFigure(res);
    userInput();
  });
}
function main() {
  document.querySelector('.reset').onclick = createSession;
  initBoard();
  setInterval(updateBoard, 500);
}

window.onload = main;
