const stadium = document.querySelector(".stadium");
const goalMessage = document.getElementById("goalMessage");
const outMessage = document.getElementById("outMessage");

const ballRadius = 25; // Радиус мяча
let velocityX = 0; // Горизонтальная скорость
let velocityY = 0; // Вертикальная скорость
const speed = 15;
const detectionRadius = 30;
let movementTimeout = null;
let isBallActive = true; // Контролирует возможность удара

function createBall() {
  // Удаляем старый мяч, если есть
  const oldBall = document.getElementById("ball");
  if (oldBall) {
    oldBall.remove();
  }

  // Создаём новый мяч
  const ball = document.createElement("img");
  ball.id = "ball";
  ball.className = "ball";
  ball.src = "/img/playboll.png"; // Указываем путь к изображению
  ball.style.width = `${ballRadius * 2}px`;
  ball.style.height = `${ballRadius * 2}px`;
  ball.style.position = "absolute";
  ball.style.right = "100px"; // Стартовая позиция
  ball.style.bottom = "0px"; // Стартовая позиция
  stadium.appendChild(ball);

  isBallActive = true; // Мяч активен для удара после создания
  return ball;
}

function showGoalMessage() {
  goalMessage.style.display = "block";
  setTimeout(() => {
    goalMessage.style.display = "none";
  }, 2000);
}
function showOutMessage() {
  outMessage.style.display = "block";
  setTimeout(() => {
    outMessage.style.display = "none";
  }, 2000);
}

function resetBall() {
  velocityX = 0;
  velocityY = 0;
  createBall(); // Добавляем новый мяч на стартовую позицию
}

function checkGoal(ballRect) {
  const leftGoal = stadium.querySelector(".goal-left");
  if (!leftGoal) return;

  const leftGoalRect = leftGoal.getBoundingClientRect();

  // Проверяем, что мяч полностью внутри границ ворот
  const isFullyInsideGoal =
    ballRect.left >= leftGoalRect.left && // Левая сторона мяча правее левой границы ворот
    ballRect.right <= leftGoalRect.right && // Правая сторона мяча левее правой границы ворот
    ballRect.top >= leftGoalRect.top && // Верхняя сторона мяча ниже верхней границы ворот
    ballRect.bottom <= leftGoalRect.bottom; // Нижняя сторона мяча выше нижней границы ворот

  if (isFullyInsideGoal) {
    isBallActive = false; // Отключаем возможность удара

    // Замедляем мяч
    const slowDownInterval = setInterval(() => {
      velocityX *= 0.95; // Постепенное уменьшение скорости
      velocityY *= 0.95;

      // Если скорость стала очень маленькой, останавливаем замедление
      if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
        velocityX = 0;
        velocityY = 0;
        clearInterval(slowDownInterval);
        resetBall(); // Создаём новый мяч после гола
      }
    }, 20); // Интервал для плавного замедления

    showGoalMessage(); // Засчитываем гол
  }
}

function updateBallPosition() {
  const ball = document.getElementById("ball");
  if (!ball) return;

  const stadiumRect = stadium.getBoundingClientRect();
  const ballRect = ball.getBoundingClientRect();
  const bar = document.querySelector(".bar"); // Находим блок bar
  const barRect = bar.getBoundingClientRect();
  const outBlock = document.querySelector(".out"); // Находим блок .out
  const outRect = outBlock.getBoundingClientRect();

  let newLeft = ball.offsetLeft + velocityX;
  let newTop = ball.offsetTop + velocityY;

  // Столкновение с границами стадиона
  if (newLeft <= 0) {
    velocityX = Math.abs(velocityX);
    newLeft = 0;
  }
  if (newLeft + ballRect.width >= stadiumRect.width) {
    velocityX = -Math.abs(velocityX);
    newLeft = stadiumRect.width - ballRect.width;
  }
  if (newTop <= 0) {
    velocityY = Math.abs(velocityY);
    newTop = 0;
  }
  if (newTop + ballRect.height >= stadiumRect.height) {
    velocityY = -Math.abs(velocityY);
    newTop = stadiumRect.height - ballRect.height;
  }

  // Столкновение с блоком bar
  const isCollidingWithBar =
    ballRect.right > barRect.left && // Правая сторона мяча пересекает левую сторону bar
    ballRect.left < barRect.right && // Левая сторона мяча пересекает правую сторону bar
    ballRect.bottom > barRect.top && // Нижняя сторона мяча пересекает верхнюю сторону bar
    ballRect.top < barRect.bottom; // Верхняя сторона мяча пересекает нижнюю сторону bar

  if (isCollidingWithBar) {
    // Рикошет по горизонтали или вертикали в зависимости от точки столкновения
    if (
      ballRect.right > barRect.left && // Правая сторона мяча попадает в левую сторону bar
      ballRect.left < barRect.left
    ) {
      velocityX = -Math.abs(velocityX); // Рикошет влево
    } else if (
      ballRect.left < barRect.right && // Левая сторона мяча попадает в правую сторону bar
      ballRect.right > barRect.right
    ) {
      velocityX = Math.abs(velocityX); // Рикошет вправо
    }
    if (
      ballRect.bottom > barRect.top && // Нижняя сторона мяча попадает в верхнюю сторону bar
      ballRect.top < barRect.top
    ) {
      velocityY = -Math.abs(velocityY); // Рикошет вверх
    } else if (
      ballRect.top < barRect.bottom && // Верхняя сторона мяча попадает в нижнюю сторону bar
      ballRect.bottom > barRect.bottom
    ) {
      velocityY = Math.abs(velocityY); // Рикошет вниз
    }
  }

  // Проверка на полное попадание в блок .out
  const isFullyInsideOut =
    ballRect.left >= outRect.left && // Левая сторона мяча правее левой границы .out
    ballRect.right <= outRect.right && // Правая сторона мяча левее правой границы .out
    ballRect.top >= outRect.top && // Верхняя сторона мяча ниже верхней границы .out
    ballRect.bottom <= outRect.bottom; // Нижняя сторона мяча выше нижней границы .out

  if (isFullyInsideOut) {
    resetBall(); // Пересоздаём мяч
    showOutMessage();
  }

  // Обновляем позицию мяча
  ball.style.left = `${newLeft}px`;
  ball.style.top = `${newTop}px`;

  checkGoal(ballRect);

  requestAnimationFrame(updateBallPosition);
}

stadium.addEventListener("mousemove", (e) => {
  const ball = document.getElementById("ball");
  if (!ball || !isBallActive) return;

  const stadiumRect = stadium.getBoundingClientRect();
  const mouseX = e.clientX - stadiumRect.left;
  const mouseY = e.clientY - stadiumRect.top;

  const ballCenterX = ball.offsetLeft + ballRadius;
  const ballCenterY = ball.offsetTop + ballRadius;

  const dx = ballCenterX - mouseX;
  const dy = ballCenterY - mouseY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < detectionRadius) {
    const angle = Math.atan2(dy, dx);
    velocityX = Math.cos(angle) * speed;
    velocityY = Math.sin(angle) * speed;

    if (movementTimeout) clearTimeout(movementTimeout);

    ball.classList.add("spinning"); // Добавляем вращение мячу

    isBallActive = false; // После первого удара отключаем возможность повторных ударов

    movementTimeout = setTimeout(() => {
      velocityX = 0;
      velocityY = 0;
      ball.classList.remove("spinning"); // Останавливаем вращение

      const ballRect = ball.getBoundingClientRect();
      const leftGoalRect = stadium
        .querySelector(".goal-left")
        .getBoundingClientRect();

      const isGoal =
        ballRect.left <= leftGoalRect.right &&
        ballRect.top + ballRect.height > leftGoalRect.top &&
        ballRect.bottom < leftGoalRect.bottom;

      if (!isGoal) {
        resetBall();
      }
    }, 2500);
  }
});

// Инициализация мяча и запуск анимации
createBall();
updateBallPosition();
