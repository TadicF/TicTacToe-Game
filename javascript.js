// Gameboard created with Module Pattern IIFE
const Gameboard = (function() {
let gameboard = 
  [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
  ];
let playable = true;
 return { gameboard, playable };
})();

const Players = {
  winner: ''
 };
 
const displayBoard = {
  modal: document.querySelector("#dialog"),
  playButton: document.querySelector('.playBtn'),
  confirmButton: document.querySelector('.confirmBtn'),

  displayFields: function() {
    const fields = document.querySelectorAll('.fields');
    fields.forEach(field => {
      let row = field.getAttribute('data-row');
      let col = field.getAttribute('data-column');
      if(field.textContent !== 'X' || field.textContent !== 'O') {
        field.textContent = Gameboard.gameboard[row][col];
      };
    })
  },
  init: function() {
    this.playButton.addEventListener('click', () => playGame(this.modal));
    this.confirmButton.addEventListener('click', () => confirmGame(event, this.modal));
  },
} 

displayBoard.init();

// Factory Function to create players
function createPlayers(name, mark, score, turn) {
  const playTurn = function(row, col) {
    if(Gameboard.gameboard[row][col] === "") {
      Gameboard.gameboard[row][col] = mark;
      return true;
    } else {
      return false;
    }
  }

  return { name, playTurn, mark, score, turn };
}

// Function to check every winning possibility 
function checkWinner() {
  // check rows
  for(let i = 0; i < 3; i++) {
    if(Gameboard.gameboard[i][0] === Gameboard.gameboard[i][1] && 
      Gameboard.gameboard[i][0] === Gameboard.gameboard[i][2]) {
        return Gameboard.gameboard[i][0]; // return whatever character is within the winner spot
      }
  };

  // check columns
  for(let i = 0; i < 3; i++) {
    if(Gameboard.gameboard[0][i] === Gameboard.gameboard[1][i] &&
      Gameboard.gameboard[0][i] === Gameboard.gameboard[2][i]) {
        return Gameboard.gameboard[0][i];
      }
  };

  // check diagonals
  if(Gameboard.gameboard[0][0] === Gameboard.gameboard[1][1] &&
    Gameboard.gameboard[0][0] === Gameboard.gameboard[2][2]) {
      return Gameboard.gameboard[0][0];
    }
  if(Gameboard.gameboard[0][2] === Gameboard.gameboard[1][1] &&
    Gameboard.gameboard[0][2] === Gameboard.gameboard[2][0]) {
      return Gameboard.gameboard[0][2];
    }
  return '';
};

function playGame(modal) {
  const user1 = document.querySelector('#user1').value = '';
  const user2 = document.querySelector('#user2').value = '';
  modal.showModal();
}

function confirmGame(event, modal) {
  event.preventDefault();
  modal.close();

  userName1 = document.querySelector('#user1').value;
  userName2 = document.querySelector('#user2').value;
  
  if(userName1 === '') {
    Players.user1 = createPlayers('Player One', 'X', 0, true);
  } else {
    Players.user1 = createPlayers(userName1, 'X', 0, true);
  }
  
  if(userName2 === '') {
    Players.user2 = createPlayers('Player Two', 'O', 0, false);
  } else {
    Players.user2 = createPlayers(userName2, 'O', 0, false);
  }

  generateDOM();



  if(!document.querySelector('.resetBtn') && !document.querySelector('.newPlayersBtn')) {
    const playContainer = document.querySelector('.play-container');
    const reset = document.createElement('button');
    playContainer.appendChild(reset);
    reset.classList.add('resetBtn');
    reset.textContent = 'Restart';
    reset.addEventListener('click', () => {
      for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
          Gameboard.gameboard[i][j] = '';
        }
      }
      const playerOneIcon = document.querySelector('.user1-svg');
      const playerTwoIcon = document.querySelector('.user2-svg');
      Players.user1.turn = true;
      Players.user2.turn = false;
      Gameboard.playable = true;
      Players.winner = '';
      playerTwoIcon.classList.remove('playerTurn');
      playerOneIcon.classList.add("playerTurn");
      const message = document.querySelector('.winner-container');
      message.textContent = '';
      displayBoard.displayFields();
    });

    const newPlayersBtn = document.createElement('button');
    newPlayersBtn.classList.add('newPlayersBtn');
    newPlayersBtn.textContent = 'New Players';
    playContainer.appendChild(newPlayersBtn);
    newPlayersBtn.addEventListener('click', () => {
    const rightContainer = document.querySelector('.right-container');
    rightContainer.replaceChildren();
    delete Players.user1;
    delete Players.user2;
    Gameboard.playable = true;
    // Reset the gameboard
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
          Gameboard.gameboard[i][j] = '';
        }
      }
    playGame(modal);
  })
  }

  gameFlow();
};

function generateDOM() {
  const rightContainer = document.querySelector('.right-container');
  // create user scores elements
  const scoreContainer = document.createElement('div');
  scoreContainer.classList.add('score-container');
  rightContainer.appendChild(scoreContainer);

  const playerOneContainer = document.createElement('div');
  playerOneContainer.classList.add('player-one-score')
  scoreContainer.appendChild(playerOneContainer);
  playerOneContainer.innerHTML += `<svg class="user1-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>`;
  const playerOne = document.createElement('p');
  playerOne.textContent = `${Players.user1.name}: `;
  playerOneContainer.appendChild(playerOne);
  const playerOneScore = document.createElement('span');
  playerOneScore.classList.add('playerOneScore');
  playerOneScore.textContent = `${Players.user1.score}` // UPDATE PLAYER SCORES
  playerOne.appendChild(playerOneScore);

  // Move this to checkWinner function or create seperate function
  // to display this
  const winnerContainer = document.createElement('div');
  winnerContainer.classList.add("winner-container");
  scoreContainer.appendChild(winnerContainer);

  const playerTwoContainer = document.createElement('div');
  playerTwoContainer.classList.add("player-two-score");
  scoreContainer.appendChild(playerTwoContainer);
  playerTwoContainer.innerHTML += `<svg class="user2-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>`;
  const playerTwo = document.createElement('p');
  playerTwo.textContent = `${Players.user2.name}: `;
  playerTwoContainer.appendChild(playerTwo);
  const playerTwoScore = document.createElement('span');
  playerTwoScore.classList.add('playerTwoScore');
  playerTwoScore.textContent = `${Players.user2.score}` 
  playerTwo.appendChild(playerTwoScore);

  // create fields 3x3
  const gameContainer = document.createElement('div');
  gameContainer.classList.add('game-container');
  rightContainer.appendChild(gameContainer);

  for(let i = 0; i < 3; i++) {
    for( let j = 0; j < 3; j++) {
      const field = document.createElement('div');
      field.classList.add('fields');
      field.setAttribute('data-row', i);
      field.setAttribute('data-column', j);
      gameContainer.appendChild(field);
    }
  }

  // limit the play button and add play again button
  const playBtn = document.querySelector('.playBtn');
  if(playBtn !== null) {
    playBtn.remove();
  }
};

function gameFlow() {
  const playerOneIcon = document.querySelector('.user1-svg');
  const playerTwoIcon = document.querySelector('.user2-svg');
  const fields = document.querySelectorAll('.fields');
  const message = document.querySelector('.winner-container');
  playerOneIcon.classList.add('playerTurn');
  message.textContent = `${Players.user1.name} turn...`;

  fields.forEach(field => {
  field.addEventListener('click', () => {
    let row = field.getAttribute('data-row');
    let col = field.getAttribute('data-column');
      
    if(Gameboard.playable) {
      if(Players.user1.turn) {
        if(Players.user1.playTurn(row, col)) {
          displayBoard.displayFields();
          Players.user1.turn = false;
          Players.user2.turn = true;
          playerOneIcon.classList.remove('playerTurn');
          playerTwoIcon.classList.add('playerTurn');
          message.textContent = `${Players.user2.name} turn...`;
          Players.winner = checkWinner();
          if(Players.winner != '' || gameOver()) {
            displayWinner();
            console.log('someone won!');
            Gameboard.playable = false;
          }
        } else {
          console.log('occupied');
        }
      };

      if(Players.user2.turn) {
        if(Players.user2.playTurn(row, col)) {
          displayBoard.displayFields();
          Players.user2.turn = false;
          Players.user1.turn = true;
          playerTwoIcon.classList.remove('playerTurn');
          playerOneIcon.classList.add('playerTurn');
          message.textContent = `${Players.user1.name} turn...`;
          Players.winner = checkWinner();
          if(Players.winner != '' || gameOver()) {
            displayWinner();
            console.log('someone won!');
            Gameboard.playable = false;
          }
        } else {
            console.log('occupied');
        }
     };
    }
  });
  });
 } 

function gameOver() {
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      if(Gameboard.gameboard[i][j] === '') {
        return false;
      }
    }
  }
  return true;
}

function displayWinner() {
  const message = document.querySelector('.winner-container');
  const playerOneScore = document.querySelector('.playerOneScore');
  const playerTwoScore = document.querySelector('.playerTwoScore');
  const playerOneIcon = document.querySelector('.user1-svg');
  const playerTwoIcon = document.querySelector('.user2-svg');
  playerTwoIcon.classList.remove('playerTurn');
  playerOneIcon.classList.add('playerTurn');

  if(Players.winner === 'X') {
    Players.user1.score++;
    message.textContent = `${Players.user1.name} won the round!`;
    playerOneScore.textContent = `${Players.user1.score}`;
  }

  if(Players.winner === 'O') {
    Players.user2.score++;
    message.textContent = `${Players.user2.name} won the round!`;
    playerTwoScore.textContent = `${Players.user2.score}`;
  }

  if(Players.winner === '') {
    message.textContent = `It's a tie!`;
  }
}