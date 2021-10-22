class Animaster {
    #steps;

    constructor(steps = []) {
        this.#steps = steps ? steps.slice() : [];
    }

    fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
        return { reset: () => Animaster.#resetFadeIn(element) };
    }

    fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
        return { reset: () => Animaster.#resetFadeOut(element) };
    }

    move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = Animaster.#getTransform(translation, null);
        return { reset: () => Animaster.#resetMoveAndScale(element) };
    }

    scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = Animaster.#getTransform(null, ratio);
        return { reset: () => Animaster.#resetMoveAndScale(element) };
    }

    changeBackgroundColor(element, duration, color) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.backgroundColor = color;
    }

    wait(duration) {
        setTimeout(() => {
        }, duration);
    }

    moveAndHide(element, duration) {
        return this
            .addMove(0.4 * duration, { x: 100, y: 20 })
            .addFadeOut(0.6 * duration)
            .play(element);
    }

    showAndHide(element, duration) {
        const stepDuration = 0.33 * duration;
        return this
            .addFadeIn(stepDuration)
            .addDelay(stepDuration)
            .addFadeOut(stepDuration)
            .play(element);
    }

    heartBeating(element, duration) {
        const stepDuration = 0.5 * duration;
        return this
            .addScale(stepDuration, 1.4)
            .addScale(stepDuration, 1)
            .play(element, true);
    }

    colorChanges(element, duration, ...colors) {
        const stepDuration = duration / (colors.length + 1);
        let animaster = this;
        const originalColor = element.style.backgroundColor;
        colors.push(originalColor);
        colors.forEach(color => animaster = animaster.addChangeBackgroundColor(stepDuration, color));
        return animaster.play(element, true);
    }

    addMove(duration, translation) {
        return this.#addAnimation('move', duration, translation);
    }

    addScale(duration, ratio) {
        return this.#addAnimation('scale', duration, ratio);
    }

    addFadeIn(duration) {
        return this.#addAnimation('fadeIn', duration);
    }

    addFadeOut(duration) {
        return this.#addAnimation('fadeOut', duration);
    }

    addDelay(duration) {
        return this.#addAnimation('wait', duration);
    }

    addChangeBackgroundColor(duration, color) {
        return this.#addAnimation('changeBackgroundColor', duration, color);
    }

    play(element, cycled = false) {
        let totalDelay;
        let cancels;
        const animation = () => {
            totalDelay = 0;
            cancels = [];
            this.#steps.forEach(step => {
                setTimeout(() => {
                    const func = this[step.funcName](element, step.duration, ...step.option);
                    if (func) {
                        const cancelFunc = func.stop || func.reset;
                        cancels.push(cancelFunc);
                    }
                }, totalDelay);
                totalDelay += step.duration;
            });
        };
        animation();
        if (cycled) {
            const cycle = setInterval(() => animation(), totalDelay);
            return { stop: () => clearInterval(cycle) };
        }
        return Animaster.#getReset(cancels);
    }

    buildHandler() {
        const animaster = this;
        return function () {
            animaster.play(this);
        }
    }

    #addAnimation(funcName, duration, ...option) {
        const copy = new Animaster(this.#steps);
        copy.#steps.push({ funcName, duration, option });
        return copy;
    }

    static #getReset(cancels) {
        return {
            reset: () => {
                while (cancels.length) {
                    const cancelFunc = cancels.pop();
                    cancelFunc();
                }
            }
        }
    }

    static #resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    static #resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    static #resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
        element.style.scale = null;
    }

    static #getTransform(translation, ratio) {
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

function animaster() {
    return new Animaster();
}

function addListeners() {
    addHandlersTo('fadeIn', block => {
        const animation = block.classList.contains('hide')
            ? animaster().addFadeIn(500)
            : animaster().addFadeOut(500);
        return animation.play(block);
    }, 'Reset');
    addHandlersTo('move', block => animaster().addMove(1000, { x: 100, y: 10 }).play(block), 'Reset');
    addHandlersTo('scale', block => animaster().addScale(1000, 1.25).play(block), 'Reset');
    addHandlersTo('moveAndHide', block => animaster().moveAndHide(block, 2000), 'Reset');
    addHandlersTo('showAndHide', block => animaster().showAndHide(block, 3000));
    addHandlersTo('heartBeating', block => animaster().heartBeating(block, 1000), 'Stop');
    addHandlersTo('colorChanges', block =>
        animaster().colorChanges(block, 1500, 'Red', 'Yellow', 'Green', 'Blue'), 'Stop');

    const worryAnimationHandler = animaster()
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .buildHandler();

    document
        .getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
}

addListeners();

function addHandlersTo(title, func, cancelText = undefined) {
    const playButton = document.getElementById(`${title}Play`);
    const block = document.getElementById(`${title}Block`);
    let animation = undefined;
    playButton.addEventListener('click', () => animation = func(block));
    if (cancelText) {
        const cancelButton = document.getElementById(`${title}${cancelText}`);
        cancelButton.addEventListener('click', () => {
            if (animation) {
                const cancelFunc = animation.stop || animation.reset;
                cancelFunc();
            }
        });
    }
}