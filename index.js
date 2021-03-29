addListeners();

function addListeners() {
    addListener("fadeIn", "Play", (block) => animaster().fadeIn(block, 1000));
    addListener("fadeIn", "Reset", (block) => animaster().resetFadeIn(block));
    addListener("fadeOut", "Play", (block) => animaster().fadeOut(block, 1000, 1.25));
    addListener("fadeOut", "Reset", (block) => animaster().resetFadeOut(block));
    addListener("move", "Play", (block) => animaster().move(block, 1000, {x: 100, y: 10}));
    addListener("move", "Reset", (block) => animaster().resetMoveAndScale(block));
    addListener("scale", "Play", (block) => animaster().scale(block, 1000, 1.25));
    addListener("scale", "Reset", (block) => animaster().resetMoveAndScale(block));
    addListener("heartBeating", "Play", (block) => animaster().heartBeating(block).play());
    addListener("heartBeating", "Stop", (block) => animaster().heartBeating(block).stop());
    addListener("moveAndHide", "Play", (block) => animaster().moveAndHide(block, 1000));
    addListener("moveAndHide", "Reset", (block) => animaster().resetMoveAndHide(block));
    addListener("showAndHide", "Play", (block) => animaster().showAndHide(block, 5000));
}

function addListener(name, param, func) {
	document.querySelector(`#${name}${param}`)
	.addEventListener("click", function () {
		const block = document.querySelector(`#${name}Block`);
		func(block);
	});
}

function AnimItem(operation, duration, translation) {
    this.operation = operation;
    this.duration = duration;
    this.translation = translation;
}

function animaster(){
    this._steps = [];
    return {
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        heartBeating(element) {
            return {
                play() {
                    interval = setInterval(() => {
                        animaster().scale.call(this, element, 500, 1.4);
                        setTimeout(() => animaster().scale.call(this, element, 500, 1), 500);
                    }, 1000);
                },
                stop() {
                    clearInterval(interval);
                }
            }
        },
        moveAndHide(element, duration) {
            this.move(element, 2 * duration / 5, {x: 100, y: 20});
            setTimeout(() =>
                this.fadeOut(element, 3 * duration / 5), 2 * duration / 5);
        },
        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
        },
        resetFadeIn(element) {
            element.style = null;
            element.classList.remove("show");
            element.classList.add("hide");
        },
        resetFadeOut(element) {
            element.style = null;
            element.classList.remove("hide");
            element.classList.add("show");
        },
        resetMoveAndHide(element) {
            element.transitionDuration = "0ms";
            element.style.transform = "";
            this.resetFadeOut(element);
        },
        resetMoveAndScale(element) {
            element.transitionDuration = "0ms";
            element.style.transform = "";
        },
        addMove(duration, translation) {
            this._steps.push(new AnimItem(this.move, duration, translation))
            return this;
        },
        play(element) {
            for (let item of this._steps) {
                item.operation.call(this, element, item.duration, item.translation);
            }
        }
    }
}
/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */


/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока



/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */


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
