const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartModalButton = document.getElementById('restartModalButton');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreElement = document.getElementById('finalScore');
const countdownElement = document.createElement('div'); // Contador de 3, 2, 1
const welcomeModal = document.getElementById('welcomeModal'); // Modal de boas-vindas
const startWelcomeButton = document.getElementById('startWelcomeButton'); // Botão para iniciar o jogo

countdownElement.id = 'countdown';
document.body.appendChild(countdownElement); // Adiciona o contador ao corpo

const gridSize = 20; // Tamanho de cada célula
let snake, direction, food, score, level, speed, gameInterval;
let gameStarted = false; // Variável para controlar o início do jogo

// Função para iniciar o jogo
function startGame() {
    if (gameStarted) return; // Se o jogo já estiver iniciado, não faz nada
    gameStarted = true; // Marca o jogo como iniciado

    snake = [{ x: 200, y: 200 }];
    direction = { x: gridSize, y: 0 };
    food = getRandomFoodPosition();
    score = 0;
    level = 1;
    speed = 200; // Intervalo inicial em milissegundos

    updateScoreAndLevel(); // Atualiza a exibição inicial
    gameOverModal.style.display = 'none'; // Esconde o modal de game over

    countdown(3, () => {
        gameInterval = setInterval(gameLoop, speed);
    });
}

// Função para exibir o modal de boas-vindas
function showWelcomeModal() {
    welcomeModal.style.display = 'flex'; // Exibe o modal
}

// Função de contagem regressiva
function countdown(seconds, callback) {
    countdownElement.textContent = seconds;
    countdownElement.style.display = 'block';

    let interval = setInterval(() => {
        seconds--;
        countdownElement.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(interval);
            countdownElement.style.display = 'none';
            callback(); // Chama a função de início do jogo após a contagem regressiva
        }
    }, 1000);
}

// Função para reiniciar o jogo
function restartGame() {
    clearInterval(gameInterval);
    gameStarted = false; // Marca o jogo como não iniciado
    startGame(); // Inicia novamente
}

// Loop principal do jogo
function gameLoop() {
    update();
    draw();
    if (checkGameOver()) {
        clearInterval(gameInterval);
        showGameOverModal(); // Mostra o modal de game over
    }
}

// Atualiza o estado do jogo
function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = getRandomFoodPosition();
        updateLevelAndSpeed();
    } else {
        snake.pop();
    }

    updateScoreAndLevel(); // Atualiza a pontuação e o nível na tela
}

// Função para desenhar o jogo
function draw() {
    // Preenche o fundo com a cor correspondente à velocidade atual
    ctx.fillStyle = getBackgroundColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a comida
    ctx.fillStyle = '#c5311d';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Desenha a cobra
    snake.forEach((part, index) => {
        if (index === 0) {
            // Desenha a cabeça como um círculo
            ctx.beginPath();
            ctx.arc(part.x + gridSize / 2, part.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = '#45BC75';
            ctx.fill();
            ctx.strokeStyle = 'darkgreen';
            ctx.stroke();
        } else {
            // Desenha o corpo como retângulos
            ctx.fillStyle = 'lightgreen';
            ctx.fillRect(part.x, part.y, gridSize, gridSize);
            ctx.strokeStyle = 'darkgreen';
            ctx.strokeRect(part.x, part.y, gridSize, gridSize);
        }
    });
}

// Função para obter a cor de fundo com base na velocidade
function getBackgroundColor() {
    if (speed > 180) return '#1f1831'; // Fundo padrão para velocidades mais baixas
    if (speed > 140) return '#2e2a47'; // Um pouco mais escuro
    if (speed > 100) return '#3d3f5b'; // Mais escuro
    return '#4c4e6f'; // Fundo mais escuro para velocidades altas
}

// Gera uma nova posição para a comida
function getRandomFoodPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

// Verifica se o jogo acabou
function checkGameOver() {
    const [head, ...body] = snake;
    const hitWall = head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
    const hitSelf = body.some(part => part.x === head.x && part.y === head.y);
    return hitWall || hitSelf;
}

// Atualiza o nível e a velocidade
function updateLevelAndSpeed() {
    if (score % 5 === 0) { // A cada 5 alimentos coletados
        level++;
        speed = Math.max(50, speed - 20); // Aumenta a velocidade, não permitindo menos de 50ms
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }
}

// Atualiza a pontuação e o nível na tela
function updateScoreAndLevel() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
}

// Mostra o modal de game over
function showGameOverModal() {
    finalScoreElement.textContent = score;
    gameOverModal.style.display = 'flex'; // Exibe o modal
}

// Controla a direção da cobra
window.addEventListener('keydown', (e) => {
    const { key } = e;
    if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -gridSize };
    if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: gridSize };
    if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -gridSize, y: 0 };
    if (key === 'ArrowRight' && direction.x === 0) direction = { x: gridSize, y: 0 };
});

// Inicia o modal de boas-vindas ao carregar a página
window.addEventListener('load', showWelcomeModal);

// Eventos dos botões
startWelcomeButton.addEventListener('click', () => {
    welcomeModal.style.display = 'none'; // Esconde o modal de boas-vindas
    startGame(); // Inicia o jogo
});
restartModalButton.addEventListener('click', restartGame);
