addListeners();

let Animaster = new class {
	/**
	 * Блок плавно появляется из прозрачного.
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 */
	fadeIn(element, duration) {
		element.style.transitionDuration = `${duration}ms`;
		element.classList.remove('hide');
		element.classList.add('show');
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

	/**
	 * Функция, передвигающая элемент
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 * @param translation — объект с полями x и y, обозначающими смещение блока
	 */
	move(element, duration, translation) {
		element.style.transitionDuration = `${duration}ms`;
		element.style.transform = this._getTransform(translation, null);
	}

	/**
	 * Функция, увеличивающая/уменьшающая элемент
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
	 */
	scale(element, duration, ratio) {
		element.style.transitionDuration = `${duration}ms`;
		element.style.transform = this._getTransform(null, ratio);
	}

	moveAndHide(element, duration, translation) {
		this.move(element, duration * 2 / 5, translation);
		setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5);
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
		setInterval(loop, duration);
	}

	_getTransform(translation, ratio) {
		const result = [];
		if (translation) {
			result.push(`translate(${translation.x}px,${translation.y}px)`);
		}
		if (ratio) {
			result.push(`scale(${ratio})`);
		}
		return result.join(' ');
	}
}

function addListeners() {
	addListener('fadeIn', 2000);
	addListener('fadeOut', 2000);
	addListener('move',1000, {x: 100, y: 10});
	addListener('scale', 1000, 1.25);
	addListener('moveAndHide',1000, {x: 100, y: 20});
	addListener('showAndHide', 1000);
	addListener('heartBeating', 1000, 1.4);
}

function addListener(methodName, ...methodArguments) {
	document.getElementById(`${methodName}Play`).addEventListener('click', function () {
		const block = document.getElementById(`${methodName}Block`);
		Animaster[methodName](block, ...methodArguments);
	});
}
