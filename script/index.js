document.addEventListener("DOMContentLoaded", () => {
	let currentLanguage = "en";
	const switchButton = document.getElementById("switchLng");
	const usaFlag = document.getElementById("usaLng");
	const georgiaFlag = document.getElementById("geLng");
 
	switchButton.addEventListener("click", () => {
	  if (currentLanguage === "en") {
		 currentLanguage = "ge";
		 usaFlag.style.display = "none";
		 georgiaFlag.style.display = "block";
	  } else {
		 currentLanguage = "en";
		 usaFlag.style.display = "block";
		 georgiaFlag.style.display = "none";
	  }
 
	  console.log(`Language switched to: ${currentLanguage}`);
	  // Добавьте сюда ваш код для смены языка, например:
	  // changeLanguage(currentLanguage);
	});
 
	const burger = document.querySelector(".burger");
	const navPanel = document.querySelector(".nav-panel");
	const container = document.querySelector(".container");
	const navLinks = document.querySelectorAll(".nav a");
	const header = document.querySelector(".header");
 
	let lastScrollY = 0;
 
	// Отслеживание скролла
	window.addEventListener("scroll", () => {
	  const currentScrollY = window.scrollY;
 
	  if (currentScrollY > lastScrollY && currentScrollY > 0) {
		 header.style.borderBottom = "1px solid #fff !impormant";
		 header.style.opacity = "1";
	  } else if (currentScrollY < lastScrollY) {
		 header.style.opacity = "0";
		 setTimeout(() => {
			if (window.scrollY === 0) {
			  header.style.borderBottom = "none";
			}
		 }, 300); // Время для плавного скрытия
	  }
 
	  lastScrollY = currentScrollY;
	});
 
	// Открытие/закрытие меню при клике на бургер
	burger.addEventListener("click", () => {
	  burger.classList.toggle("active"); // Переключаем класс для бургер-меню (полоски на крестик)
	  navPanel.classList.toggle("open"); // Открываем или закрываем навигационную панель
	  container.classList.toggle("locked"); // Блокируем или разблокируем скроллинг
	});
 
	// Закрытие меню при клике на ссылку
	navLinks.forEach((link) => {
	  link.addEventListener("click", () => {
		 burger.classList.remove("active");
		 navPanel.classList.remove("open");
		 container.classList.remove("locked"); // Снимаем блокировку скроллинга
	  });
	});
 
	// Закрытие меню при клике вне бургер-меню и панели навигации
	document.addEventListener("click", (e) => {
	  if (
		 !header.contains(e.target) &&
		 !navPanel.contains(e.target) &&
		 !burger.contains(e.target)
	  ) {
		 burger.classList.remove("active");
		 navPanel.classList.remove("open");
		 container.classList.remove("locked"); // Снимаем блокировку скроллинга
	  }
	});
 
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
 