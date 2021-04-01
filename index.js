addListeners();

let Animaster = new class {
	#steps = [];

	/**
	 * Блок плавно появляется из прозрачного.
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 */
	fadeIn(element, duration) {
		element.style.transitionDuration = `${duration}ms`;
		element.classList.remove('hide');
		element.classList.add('show');

		setTimeout(() => this.#resetFadeIn(element), 1500);
	}

	#resetFadeIn(element) {
		element.style.transitionDuration = null;
		element.classList.add('hide');
		element.classList.remove('show');
	}

	/**
	 * Блок плавно растворяется из видимого.
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 */
	fadeOut(element, duration) {
		element.style.transitionDuration = `${duration}ms`;
		element.classList.add('hide');
		element.classList.remove('show');
	}

	#resetFadeOut(element) {
		element.style.transitionDuration = null;
		element.classList.remove('hide');
		element.classList.add('show');
	}

	/**
	 * Функция, передвигающая элемент
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 * @param translation — объект с полями x и y, обозначающими смещение блока
	 */
	move(element, duration, translation = {}) {
		element.style.transitionDuration = `${duration}ms`;
		element.style.transform = this.#getTransform(translation, null);
	}

	/**
	 * Функция, увеличивающая/уменьшающая элемент
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
	 */
	scale(element, duration, ratio) {
		element.style.transitionDuration = `${duration}ms`;
		element.style.transform = this.#getTransform(null, ratio);
	}

	#resetMoveAndScale(element) {
		element.style.transitionDuration = `0ms`;
		element.style.transform = this.#getTransform(null, null);
	}

	moveAndHide(element, duration, translation) {
		this.move(element, duration * 2 / 5, translation);
		setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5);
		return {
			stop() {
				Animaster.#resetMoveAndScale(element);
				Animaster.#resetFadeOut(element);
			}
		}
	}

	showAndHide(element, duration) {
		this.fadeIn(element, duration / 3);
		setTimeout(() => this.fadeOut(element, duration / 3), duration * 2 / 3);
	}

	heartBeating(element, duration, ratio) {
		let loop = () => {
			this.scale(element, duration / 2, ratio);
			setTimeout(() => this.scale(element, duration / 2, 1), duration / 2);
		}
		let timerId = setInterval(loop, duration);

		return {
			stop() {
				clearInterval(timerId);
			}
		};
	}

	#getTransform(translation, ratio) {
		const result = [];
		if (translation) {
			result.push(`translate(${translation.x}px,${translation.y}px)`);
		}
		if (ratio) {
			result.push(`scale(${ratio})`);
		}
		return result.join(' ');
	}

	addMove(duration, ratio = 1, translation = {x: 0, y: 0}) {
		this.#steps.push({
			name: 'move',
			duration,
			ratio,
			translation,
		});

		return this;
	}

	play(element) {
		for (const animation of this.#steps)
			this[animation.name](animation.duration, animation.ratio, animation.translation);
	}
}

function addListeners() {
	addPlayListener('fadeIn', 2000);
	addPlayListener('fadeOut', 2000);
	addPlayListener('move', 1000, {x: 100, y: 10});
	addPlayListener('scale', 1000, 1.25);
	addPlayAndStopListener('moveAndHide', 1000, {x: 100, y: 20});
	addPlayListener('showAndHide', 1000);
	addPlayAndStopListener('heartBeating', 1000, 1.4);
}

function addPlayListener(method, ...args) {
	document.getElementById(`${method}Play`).addEventListener('click', function () {
		const block = document.getElementById(`${method}Block`);
		Animaster[method](block, ...args);
	});
}

function addPlayAndStopListener(method, ...args) {
	let stopObject;

	document.getElementById(`${method}Play`).addEventListener('click', function () {
		const block = document.getElementById(`${method}Block`);
		stopObject?.stop();
		stopObject = Animaster[method](block, ...args);
	});

	document.getElementById(`${method}Stop`).addEventListener('click', function () {
		stopObject.stop();
	});
}
