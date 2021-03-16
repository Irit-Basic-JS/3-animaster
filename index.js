addListeners();

function animaster() {
	let animaster = {};

	/**
	 * Блок плавно появляется из прозрачного.
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 */
	animaster.fadeIn = function (element, duration) {
		element.style.transitionDuration = `${duration}ms`;
		element.classList.remove('hide');
		element.classList.add('show');
	}

	/**
	 * Блок плавно растворяется из видимого.
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 */
	animaster.fadeOut = function (element, duration) {
		element.style.transitionDuration = `${duration}ms`;
		element.classList.add('hide');
		element.classList.remove('show');
	}

	/**
	 * Функция, передвигающая элемент
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 * @param translation — объект с полями x и y, обозначающими смещение блока
	 */
	animaster.move = function (element, duration, translation) {
		element.style.transitionDuration = `${duration}ms`;
		element.style.transform = getTransform(translation, null);
	}

	/**
	 * Функция, увеличивающая/уменьшающая элемент
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
	 */
	animaster.scale = function (element, duration, ratio) {
		element.style.transitionDuration = `${duration}ms`;
		element.style.transform = getTransform(null, ratio);
	}

	return animaster;
}

function addListeners() {
	document.getElementById('fadeInPlay').addEventListener('click', function () {
		const block = document.getElementById('fadeInBlock');
		animaster().fadeIn(block, 5000);
	});

	document.getElementById('movePlay').addEventListener('click', function () {
		const block = document.getElementById('moveBlock');
		animaster().move(block, 1000, {x: 100, y: 10});
	});

	document.getElementById('scalePlay').addEventListener('click', function () {
		const block = document.getElementById('scaleBlock');
		animaster().scale(block, 1000, 1.25);
	});
}

function getTransform(translation, ratio) {
	const result = [];
	if (translation) {
		result.push(`translate(${translation.x}px,${translation.y}px)`);
	}
	if (ratio) {
		result.push(`scale(${ratio})`);
	}
	return result.join(' ');
}
