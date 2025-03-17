
// Language Localization (Internationalization)
const gameText = {
    en: {
        welcome: "Welcome to the Naruto-Themed Game Hub",
        selectGame: "Select a Game",
        qanda: "Q&A Game",
        quiz: "Quiz Game",
        chess: "Play Chess",
        timeTaken: "Time Taken: ",
        correctAnswer: "Correct!",
        wrongAnswer: "Wrong answer. Try again.",
        gameCompleted: "Game Completed! Download your results."
    },
    es: {
        welcome: "Bienvenido al Hub de Juegos con Tema Naruto",
        selectGame: "Selecciona un Juego",
        qanda: "Juego de Preguntas y Respuestas",
        quiz: "Juego de Preguntas de Opción Múltiple",
        chess: "Jugar Ajedrez",
        timeTaken: "Tiempo tomado: ",
        correctAnswer: "¡Correcto!",
        wrongAnswer: "Respuesta incorrecta. Intenta de nuevo.",
        gameCompleted: "¡Juego completado! Descarga tus resultados."
    },
    jp: {
        welcome: "ナルトテーマのゲームハブへようこそ",
        selectGame: "ゲームを選んでください",
        qanda: "Q&Aゲーム",
        quiz: "クイズゲーム",
        chess: "チェスをプレイ",
        timeTaken: "時間経過: ",
        correctAnswer: "正解！",
        wrongAnswer: "間違えました。もう一度試してください。",
        gameCompleted: "ゲーム完了！ 結果をダウンロードしてください。"
    }
};

let currentLanguage = 'en';
let gameTimer;
let gameTime = 0;
let score = 0;

document.getElementById('languageSelect').addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    updateLanguage();
});

function updateLanguage() {
    document.querySelector('h1').textContent = gameText[currentLanguage].welcome;
    document.querySelectorAll('button')[0].textContent = gameText[currentLanguage].qanda;
    document.querySelectorAll('button')[1].textContent = gameText[currentLanguage].quiz;
    document.querySelectorAll('button')[2].textContent = gameText[currentLanguage].chess;
}

function startQandA() {
    document.getElementById('gameContent').innerHTML = "<h2>Q&A Game Started</h2><p>Answer questions to proceed.</p><div id='timer'></div>";
    startGameTimer();
    showPopup(gameText[currentLanguage].selectGame);
}

function startQuiz() {
    document.getElementById('gameContent').innerHTML = "<h2>Quiz Game Started</h2><p>Answer multiple choice questions.</p><div id='timer'></div>";
    startGameTimer();
    showPopup(gameText[currentLanguage].selectGame);
}

function startChess() {
    let action = prompt("Do you want to create or join a game? (Type 'create' or 'join')");
    let gameId = prompt("Enter Game ID:");
    let password = prompt("Enter Game Password:");
    let playerName = prompt("Enter Your Name:");

    let data = {
        action: action,
        gameId: gameId,
        password: password,
        playerName: playerName
    };

    fetch('multiplayer_chess.php', {
        method: 'POST',
        body: new URLSearchParams(data)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            initChessGame();
        }
    })
    .catch(error => console.error('Error:', error));
}

function startGameTimer() {
    gameTime = 0;
    gameTimer = setInterval(() => {
        gameTime++;
        document.getElementById('timer').textContent = `${gameText[currentLanguage].timeTaken} ${gameTime}s`;
    }, 1000);
}

function stopGameTimer() {
    clearInterval(gameTimer);
    showGameCompletedPopup();
}

function showPopup(message) {
    const popup = document.getElementById('popupNotification');
    popup.textContent = message;
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

function showGameCompletedPopup() {
    showPopup(gameText[currentLanguage].gameCompleted);
}

function initChessGame() {
    const board = Chessboard('chessBoard', {
        draggable: true,
        dropOffBoard: 'trash',
        sparePieces: true
    });
    board.start();
}

function storePlayerData(name, game, score, time) {
    const playerData = {
        name: name,
        gamePlayed: game,
        score: score,
        timeTaken: time,
        ip: getIP(),
        deviceInfo: getDeviceInfo()
    };
    savePlayerDataToFile(playerData);
}

function savePlayerDataToFile(data) {
    const jsonData = JSON.stringify(data);
    const fileName = `${data.name}_${data.gamePlayed}.json`;
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function getIP() {
    return '127.0.0.1';
}

function getDeviceInfo() {
    return navigator.userAgent;
}
