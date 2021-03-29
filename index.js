addListeners();
const customAnimation = animaster()
.addMove(200, {x: 40, y: 40})
.addScale(800, 1.3)
.addMove(200, {x: 80, y: 0})
.addScale(800, 1)
.addMove(200, {x: 40, y: -40})
.addScale(800, 0.7)
.addMove(200, {x: 0, y: 0})
.addScale(800, 1);

function addListeners() {
    addListener("fadeIn", "Play", (block) => animaster().addFadeIn(1000).play(block));
    addListener("fadeIn", "Reset", (block) => animaster().resetFadeIn(block));
    addListener("fadeOut", "Play", (block) => animaster().addFadeOut(1000).play(block));
    addListener("fadeOut", "Reset", (block) => animaster().resetFadeOut(block));
    addListener("move", "Play", (block) => animaster().addMove(1000, {x: 100, y: 10}).play(block));
    addListener("move", "Reset", (block) => animaster().resetMoveAndScale(block));
    addListener("scale", "Play", (block) => animaster().addScale(1000, 1.25).play(block));
    addListener("scale", "Reset", (block) => animaster().resetMoveAndScale(block));
    addListener("heartBeating", "Play", (block) => animaster().heartBeating(block).play());
    addListener("heartBeating", "Stop", (block) => animaster().heartBeating(block).stop());
    addListener("moveAndHide", "Play", (block) => animaster().addmoveAndHide(1000).play(block));
    addListener("moveAndHide", "Reset", (block) => animaster().resetMoveAndHide(block));
    addListener("showAndHide", "Play", (block) => animaster().addShowAndHide(5000).play(block));
    addListener("customAnimation", "Play", (block) => customAnimation.play(block));
}

function addListener(name, param, func) {
	document.querySelector(`#${name}${param}`)
	.addEventListener("click", function () {
		const block = document.querySelector(`#${name}Block`);
		func(block);
	});
}

function animaster(steps){
    return {
        _steps: steps ? steps : [],
        fadeIn(element, step) {
            element.style.transitionDuration =  `${step.duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut(element, step) {
            element.style.transitionDuration =  `${step.duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        move(element, step) {
            element.style.transitionDuration = `${step.duration}ms`;
            element.style.transform = getTransform(step.translation, null);
        },
        scale(element, step) {
            element.style.transitionDuration =  `${step.duration}ms`;
            element.style.transform = getTransform(null, step.ratio);
        },
        heartBeating(element) {
            return {
                play() {
                    interval = setInterval(() => {
                        animaster().scale.call(this, element, {duration: 500, ratio: 1.4});
                        setTimeout(() => animaster().scale.call(this, element, {duration: 500, ratio: 1}), 500);
                    }, 1000);
                },
                stop() {
                    clearInterval(interval);
                }
            }
        },
        moveAndHide(element, step) {
            this.move(element, {duration: 2 * step.duration / 5, translation: {x: 100, y: 20}});
            setTimeout(() =>
                this.fadeOut(element, {duration: 3 * step.duration / 5}), 2 * step.duration / 5);
        },
        showAndHide(element, step) {
            this.fadeIn(element, {duration: step.duration / 3});
            setTimeout(() => this.fadeOut(element, {duration: step.duration / 3}), step.duration / 3);
        },
        delay(element, step) {

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
            this._steps.push({operation: this.move, duration: duration, translation: translation})
            return this;
        },
        addScale(duration, ratio) {
            this._steps.push({operation: this.scale, duration: duration, ratio: ratio})
            return this;
        },
        addFadeIn(duration) {
            this._steps.push({operation: this.fadeIn, duration: duration})
            return this;
        },
        addFadeOut(duration) {
            this._steps.push({operation: this.fadeOut, duration: duration})
            return this;
        },
        addmoveAndHide(duration) {
            this._steps.push({operation: this.moveAndHide, duration: duration})
            return this;
        },
        addShowAndHide(duration) {
            this._steps.push({operation: this.showAndHide, duration: duration})
            return this;
        },
        play(element) {
            let delay = 0;
            for (let step of this._steps) {
                setTimeout(() => step.operation.call(this, element, step), delay);
                delay += step.duration ? step.duration : 0;
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
