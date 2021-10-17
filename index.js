class Animaster {
    constructor() {
        this._steps = []
    }

    static #getTransform(translation = null, ratio = null, angle = null) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        if (angle) {
            result.push(`rotate(${angle}deg)`);
        }

        return result.join(' ');
    }

    static #setMode(element, show) {
        element.classList.remove(show ? 'hide' : 'show');
        element.classList.add(show ? 'show' : 'hide');
    }

    play(element, cycled = false) {
        let tick;
        let timerId = setTimeout(tick = index => {
            element.style.transitionDuration = `${this._steps[index].duration}ms`;
            this._steps[index].action(element);
            if (cycled || index < this._steps.length - 1)
                timerId = setTimeout(tick, Math.round(this._steps[index].duration),
                    (index + 1) % this._steps.length);
        }, 0, 0);
        return {
            stop: () => {
                clearTimeout(timerId);
            },

            reset: () => {
                element.style.transitionDuration = null;
                this._steps.slice().reverse().forEach(s => s.reverse(element));
            }
        }
    }

    buildHandler() {
        let animasterObj = this;
        return function () {
            return animasterObj.play(this);
        };
    }

    copy() {
        let newAnimaster = new Animaster();
        newAnimaster._steps = this._steps.slice();
        return newAnimaster;
    }

    addFadeIn(duration) {
        let animCopy = this.copy();
        animCopy._steps.push({
            duration,
            action: element => Animaster.#setMode(element, true),
            reverse: element => Animaster.#setMode(element, false)
        });
        return animCopy;
    }

    addFadeOut(duration) {
        let animCopy = this.copy();
        animCopy._steps.push({
            duration,
            action: element => Animaster.#setMode(element, false),
            reverse: element => Animaster.#setMode(element, true)
        });
        return animCopy;
    }

    addMove(duration, translation) {
        let animCopy = this.copy();
        animCopy._steps.push({
            duration,
            action: element => element.style.transform = Animaster.#getTransform(translation),
            reverse: element => element.style.transform = Animaster.#getTransform()
        });
        return animCopy;
    }

    addScale(duration, ratio) {
        let animCopy = this.copy();
        animCopy._steps.push({
            duration,
            action: element => element.style.transform = Animaster.#getTransform(null, ratio),
            reverse: element => element.style.transform = Animaster.#getTransform()
        });
        return animCopy;
    }

    addDelay(duration) {
        let animCopy = this.copy();
        animCopy._steps.push({
            duration,
            action: () => null,
            reverse: () => null
        });
        return animCopy;
    }

    addRotateAndScale(duration, ratio, angle) {
        let animCopy = this.copy();
        animCopy._steps.push({
            duration,
            action: element => element.style.transform = Animaster.#getTransform(null, ratio, angle),
            reverse: element => element.style.transform = Animaster.#getTransform()
        });
        return animCopy;
    }

    fadeIn(duration) {
        return this.addFadeIn(duration);
    }

    fadeOut(duration) {
        return this.addFadeOut(duration);
    }

    move(duration, translation) {
        return this.addMove(duration, translation);
    }

    scale(duration, ratio) {
        return this.addScale(duration, ratio);
    }

    moveAndHide(duration, translation) {
        return this
            .addMove(duration * 2 / 5, translation)
            .addFadeOut(duration * 3 / 5)
    }

    showAndHide(duration) {
        return this
            .addFadeIn(duration / 4)
            .addDelay(duration / 4)
            .addFadeOut(duration / 4)
    }

    heartBeating() {
        return this
            .addScale(250, 1.4)
            .addScale(250, 1)
            .addDelay(25)
            .addScale(250, 1.4)
            .addScale(250, 1)
            .addDelay(500)
    }
}

function animaster() {
    return new Animaster();
}

function addListeners(cycled, ...listeners) {
    for (let listener of listeners) {
        let block = document.getElementById(listener[0] + 'Block');
        let execute = document.getElementById(listener[0] + (cycled ? 'Stop' : 'Reset'));
        let animasterObj = animaster()[listener[0]](...listener.slice(1))
        document.getElementById(listener[0] + 'Play')
            .addEventListener('click', function () {
                let executor = animasterObj.play(block, cycled);
                execute.addEventListener('click', cycled ? executor.stop : executor.reset)
            });
    }
}

addListeners(false,
    ['fadeIn', 5000],
    ['fadeOut', 5000],
    ['move', 1000, {x: 100, y: 10}],
    ['scale', 1000, 1.25],
    ['moveAndHide', 1000, {x: 100, y: 10}],
    ['showAndHide', 1000]);

addListeners(true, ['heartBeating']);

const worryAnimationHandler = animaster()
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .buildHandler();

document
    .getElementById('worryAnimationBlock')
    .addEventListener('click', worryAnimationHandler);

const rotateAndScaleHandler = animaster()
    .addRotateAndScale(1000, 0.1, 360)
    .addDelay(500)
    .addRotateAndScale(1000, 1, 0.1)
    .buildHandler();

document
    .getElementById('rotateAndScaleBlock')
    .addEventListener('click', rotateAndScaleHandler);