document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".item button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      const svg = button.querySelector(".svg");

      // Закрыть все остальные элементы
      document.querySelectorAll(".item-content").forEach((item) => {
        if (item !== content) {
          item.classList.remove("open");
          const otherSvg = item.previousElementSibling.querySelector(".svg");
          if (otherSvg) {
            otherSvg.classList.remove("rotated");
          }
        }
      });

      // Переключить текущий элемент
      content.classList.toggle("open");
      svg.classList.toggle("rotated");
    });
  });
});
