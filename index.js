addListeners(false,
    ['fadeIn', 5000],
    ['fadeOut', 5000],
    ['move', 1000, {x: 100, y: 10}],
    ['scale', 1000, 1.25],
    ['moveAndHide', 1000, {x: 100, y: 10}]);

addListeners(true,
    ['heartBeating'],
    ['showAndHide', 1000]);

function addListeners(cycled, ...listeners) {
    for (let listener of listeners) {
        let block = document.getElementById(listener[0] + 'Block');
        let execute = document.getElementById(listener[0] + (cycled ? 'Stop' : 'Reset'));
        document.getElementById(listener[0] + 'Play')
            .addEventListener('click', function () {
                let executor = animaster()[listener[0]](block, ...listener.slice(1));
                execute.addEventListener('click', cycled ? executor.stop : executor.reset)
            });
    }
}

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

function animaster() {
    return {
        _steps: [],

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
                    this._steps.forEach(s => s.reverse(element));
                }
            }
        },

        buildHandler() {
            let animasterObj = this;
            return function () {
                return animasterObj.play(this);
            };
        },

        copy() {
            let newAnimaster = animaster();
            newAnimaster._steps = this._steps.slice();
            return newAnimaster;
        },

        addFadeIn(duration) {
            this._steps.push({
                duration,
                action: element => setMode(element, true),
                reverse: element => setMode(element, false)
            });
            return this.copy();
        },

        addFadeOut(duration) {
            this._steps.push({
                duration,
                action: element => setMode(element, false),
                reverse: element => setMode(element, true)
            });
            return this.copy();
        },

        addMove(duration, translation) {
            this._steps.push({
                duration,
                action: element => element.style.transform = getTransform(translation),
                reverse: element => element.style.transform = getTransform()
            });
            return this.copy();
        },

        addScale(duration, ratio) {
            this._steps.push({
                duration,
                action: element => element.style.transform = getTransform(null, ratio),
                reverse: element => element.style.transform = getTransform()
            });
            return this.copy();
        },

        addDelay(duration) {
            this._steps.push({
                duration,
                action: () => null,
                reverse: () => null
            });
            return this.copy();
        },

        addRotateAndScale(duration, ratio, angle) {
            this._steps.push({
                duration,
                action: element => element.style.transform = getTransform(null, ratio, angle),
                reverse: element => element.style.transform = getTransform()
            });
            return this.copy();
        },

        fadeIn(element, duration) {
            return this.addFadeIn(duration).play(element);
        },

        fadeOut(element, duration) {
            return this.addFadeOut(duration).play(element);
        },

        move(element, duration, translation) {
            return this.addMove(duration, translation).play(element);
        },

        scale(element, duration, ratio) {
            return this.addScale(duration, ratio).play(element);
        },

        moveAndHide(element, duration, translation) {
            return this
                .addMove(duration * 2 / 5, translation)
                .addFadeOut(duration * 3 / 5)
                .play(element);
        },

        showAndHide(element, duration) {
            return this
                .addFadeIn(duration / 4)
                .addDelay(duration / 4)
                .addFadeOut(duration / 4)
                .addDelay(duration / 4)
                .play(element, true);
        },

        heartBeating(element) {
            return this
                .addScale(250, 1.4)
                .addScale(250, 1)
                .addDelay(25)
                .addScale(250, 1.4)
                .addScale(250, 1)
                .addDelay(500)
                .play(element, true);
        }
    }

    function getTransform(translation = null, ratio = null, angle = null) {
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

    function setMode(element, show) {
        element.classList.remove(show ? 'hide' : 'show');
        element.classList.add(show ? 'show' : 'hide');
    }
}