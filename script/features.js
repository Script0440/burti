const itemsContainer = document.querySelector(".features-items");
const items = document.querySelectorAll(".features-item");

// Конфигурация
const mouseSpeedBoost = 2; // Ускорение при наведении мыши
const baseSpeedMultiplier = 2; // Базовая скорость шариков
let containerSize = 500;

if (window.innerWidth <= 460) {
  containerSize = 240;
}
if (window.innerWidth >= 460 ) {
  containerSize = 350;
}
if (window.innerWidth === 1400 ) {
  containerSize = 400;
}
if (window.innerWidth > 1700 ) {
  containerSize = 500;
}
const radius = containerSize / 2; // Радиус большого круга

// Генерация случайной позиции внутри круга
function getRandomPositionInCircle(radius) {
  const angle = Math.random() * 2 * Math.PI; // Случайный угол
  const distance = Math.sqrt(Math.random()) * radius; // Равномерное распределение
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  return { x, y };
}

// Генерация случайного направления движения
function getRandomDirection() {
  const angle = Math.random() * 2 * Math.PI; // Случайный угол
  return {
    vx: Math.cos(angle) * baseSpeedMultiplier,
    vy: Math.sin(angle) * baseSpeedMultiplier,
  };
}

// Инициализация шариков с физикой
const balls = Array.from(items).map((item) => {
  const centerX = radius; // Центр круга по X
  const centerY = radius; // Центр круга по Y

  // Получаем случайную позицию и направление
  const { x, y } = getRandomPositionInCircle(radius - item.offsetWidth / 2);
  const { vx, vy } = getRandomDirection();

  return {
    element: item,
    x: centerX + x - item.offsetWidth / 2,
    y: centerY + y - item.offsetHeight / 2,
    vx, // Горизонтальная скорость
    vy, // Вертикальная скорость
  };
});

// Обновление позиций шариков
function updatePositions() {
  const centerX = radius; // Центр круга по X
  const centerY = radius; // Центр круга по Y

  balls.forEach((ball) => {
    // Обновляем позиции
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Центр шарика
    const ballCenterX = ball.x + ball.element.offsetWidth / 2;
    const ballCenterY = ball.y + ball.element.offsetHeight / 2;

    // Проверка на столкновение с границами большого круга
    const distanceFromCenter = Math.sqrt(
      (ballCenterX - centerX) ** 2 + (ballCenterY - centerY) ** 2
    );

    if (distanceFromCenter + ball.element.offsetWidth / 2 > radius) {
      // Меняем направление на случайное при столкновении
      const { vx, vy } = getRandomDirection();
      ball.vx = vx;
      ball.vy = vy;

      // Корректируем положение шарика
      const overlap =
        distanceFromCenter + ball.element.offsetWidth / 2 - radius;
      ball.x -=
        Math.cos(Math.atan2(ballCenterY - centerY, ballCenterX - centerX)) *
        overlap;
      ball.y -=
        Math.sin(Math.atan2(ballCenterY - centerY, ballCenterX - centerX)) *
        overlap;
    }

    // Применяем новые координаты
    ball.element.style.left = `${ball.x}px`;
    ball.element.style.top = `${ball.y}px`;
  });

  requestAnimationFrame(updatePositions);
}

// Реакция на наведение мыши
itemsContainer.addEventListener("mousemove", (e) => {
  const containerRect = itemsContainer.getBoundingClientRect();
  const mouseX = e.clientX - containerRect.left;
  const mouseY = e.clientY - containerRect.top;

  balls.forEach((ball) => {
    const dx = ball.x + ball.element.offsetWidth / 2 - mouseX;
    const dy = ball.y + ball.element.offsetHeight / 2 - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      // Увеличиваем скорость при близости к мыши
      const angle = Math.atan2(dy, dx);
      ball.vx += Math.cos(angle) * mouseSpeedBoost;
      ball.vy += Math.sin(angle) * mouseSpeedBoost;
    }
  });
});

// Запуск анимации
updatePositions();
