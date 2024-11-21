// Menu Mobile
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    if (!menuOpen) {
        menuBtn.classList.add('open');
        navLinks.classList.add('active');
        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        navLinks.classList.remove('active');
        menuOpen = false;
    }
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll para Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        // Fecha o menu mobile se estiver aberto
        if (menuOpen) {
            menuBtn.classList.remove('open');
            navLinks.classList.remove('active');
            menuOpen = false;
        }
    });
});

// Animação de Elementos no Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        if (elementPosition < screenPosition - 100) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Validação do Formulário
const contactForm = document.getElementById('contactForm');
const formGroups = document.querySelectorAll('.form-group');

const validateInput = (input) => {
    const formGroup = input.parentElement;
    const feedback = formGroup.querySelector('.form-feedback');
    
    if (input.validity.valid) {
        formGroup.classList.remove('error');
        feedback.textContent = '';
        return true;
    } else {
        formGroup.classList.add('error');
        if (input.validity.valueMissing) {
            feedback.textContent = 'Este campo é obrigatório';
        } else if (input.validity.typeMismatch && input.type === 'email') {
            feedback.textContent = 'Por favor, insira um email válido';
        }
        return false;
    }
};

formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => validateInput(input));
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        // Animação de envio
        submitBtn.disabled = true;
        btnText.textContent = 'Enviando...';
        btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                btnText.textContent = 'Enviado!';
                btnIcon.innerHTML = '<i class="fas fa-check"></i>';
                contactForm.reset();
                
                // Reset do botão após 2 segundos
                setTimeout(() => {
                    submitBtn.disabled = false;
                    btnText.textContent = 'Enviar';
                    btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
                }, 2000);
            } else {
                throw new Error('Erro ao enviar');
            }
        } catch (error) {
            btnText.textContent = 'Erro ao enviar';
            btnIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            
            // Reset do botão após 2 segundos
            setTimeout(() => {
                submitBtn.disabled = false;
                btnText.textContent = 'Enviar';
                btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
            }, 2000);
        }
    }
});

// Slider de Serviços Touch
const servicesSlider = document.querySelector('.services-slider');
let isDown = false;
let startX;
let scrollLeft;

servicesSlider.addEventListener('mousedown', (e) => {
    isDown = true;
    servicesSlider.classList.add('active');
    startX = e.pageX - servicesSlider.offsetLeft;
    scrollLeft = servicesSlider.scrollLeft;
});

servicesSlider.addEventListener('mouseleave', () => {
    isDown = false;
    servicesSlider.classList.remove('active');
});

servicesSlider.addEventListener('mouseup', () => {
    isDown = false;
    servicesSlider.classList.remove('active');
});

servicesSlider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - servicesSlider.offsetLeft;
    const walk = (x - startX) * 2;
    servicesSlider.scrollLeft = scrollLeft - walk;
});

// Jogo Snake
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startGame');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let gameLoop = null;
let gameSpeed = 100;

function initGame() {
    // Inicializa a cobra
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    
    // Inicializa a comida
    spawnFood();
    
    // Reseta a pontuação
    score = 0;
    scoreElement.textContent = score;
    
    // Define a direção inicial
    direction = 'right';
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Evita que a comida apareça sobre a cobra
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            spawnFood();
            break;
        }
    }
}

function drawGame() {
    // Limpa o canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha a comida
    ctx.fillStyle = '#ff4081';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    
    // Desenha a cobra
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00bcd4' : '#2196f3';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Verifica colisão com as paredes
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // Verifica colisão com o próprio corpo
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    // Adiciona nova cabeça
    snake.unshift(head);
    
    // Verifica se comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        spawnFood();
        // Aumenta a velocidade
        if (gameSpeed > 50) {
            gameSpeed -= 2;
            clearInterval(gameLoop);
            gameLoop = setInterval(gameStep, gameSpeed);
        }
    } else {
        // Remove a cauda se não comeu
        snake.pop();
    }
}

function gameStep() {
    moveSnake();
    drawGame();
}

function gameOver() {
    clearInterval(gameLoop);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText(`Pontuação: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
    
    startButton.textContent = 'Jogar Novamente';
    startButton.disabled = false;
}

// Controles do teclado
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Controles touch para dispositivos móveis
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Movimento horizontal
        if (deltaX > 0 && direction !== 'left') {
            direction = 'right';
        } else if (deltaX < 0 && direction !== 'right') {
            direction = 'left';
        }
    } else {
        // Movimento vertical
        if (deltaY > 0 && direction !== 'up') {
            direction = 'down';
        } else if (deltaY < 0 && direction !== 'down') {
            direction = 'up';
        }
    }
    
    touchStartX = touchEndX;
    touchStartY = touchEndY;
});

// Inicia o jogo
startButton.addEventListener('click', () => {
    clearInterval(gameLoop);
    gameSpeed = 100;
    initGame();
    gameLoop = setInterval(gameStep, gameSpeed);
    startButton.disabled = true;
    startButton.textContent = 'Jogando...';
});

// Sistema de contagem de visitas
function updateVisitCount() {
    // Obtém a data atual
    const today = new Date().toLocaleDateString();
    
    // Recupera os dados do localStorage
    let stats = JSON.parse(localStorage.getItem('siteStats')) || {
        totalVisits: 0,
        lastVisit: '',
        todayVisits: 0
    };
    
    // Verifica se é um novo dia
    if (stats.lastVisit !== today) {
        stats.todayVisits = 1;
    } else {
        stats.todayVisits++;
    }
    
    // Atualiza as estatísticas
    stats.totalVisits++;
    stats.lastVisit = today;
    
    // Salva no localStorage
    localStorage.setItem('siteStats', JSON.stringify(stats));
    
    // Atualiza a exibição
    document.getElementById('todayVisits').textContent = stats.todayVisits;
    document.getElementById('totalVisits').textContent = stats.totalVisits;
}

// Atualiza o contador quando a página carrega
document.addEventListener('DOMContentLoaded', updateVisitCount);