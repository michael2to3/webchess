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
function readFigure(pos) {
  const board = document.querySelector('.board');
  const cells = board.children;
  let shift = 0;
  Array.from(pos).forEach((char, i) => {
    if (char === '/') {
      shift -= 1;
    } else if (char === '8') {
      shift += 7;
    } else {
      const figure = document.createElement('div');
      figure.classList.add('figure');
      figure.innerHTML = asciiToUnicode(char);
      cells[i + shift].appendChild(figure);
    }
  });
}
function createSession() {
  const status = document.querySelector('.status');
  fetch('./chess.php?action=create').then((res) => res.text()).then((res) => {
    if (res !== 'successful') {
      status.innerHTML = 'Create session failed!';
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
        status.innerHTML = "Not valid cell";
      } else {
        cell.appendChild(item);
      }
      item.classList.remove('drag');
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

function main() {
  initBoard();
  readFigure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  createSession();
  userInput();
}

window.onload = main;
