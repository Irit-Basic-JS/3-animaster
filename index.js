addListeners(false,
    ['fadeIn', 5000],
    ['move', 1000, {x: 100, y: 10}],
    ['scale', 1000, 1.25],
    ['moveAndHide', 1000, {x: 100, y: 20}],
    ['showAndHide', 1000]);

addListeners(true, ['heartBeating']);

function addListeners(cycled, ...listeners) {
    for (let listener of listeners) {
        let block = document.getElementById(listener[0] + 'Block');
        let command = document.getElementById(listener[0] + (cycled ? 'Stop' : 'Reset'));
        document.getElementById(listener[0] + 'Play')
            .addEventListener('click', function () {
                let element = animaster()[listener[0]](block, ...listener.slice(1));
                command.addEventListener('click', cycled ? element.stop : element.reset)
            });
    }
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

function animaster() {
    return {
        _steps: [],

        buildHandler() {
            let animaster = this;
            return function () {
                return animaster.play(this);
            }
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

        moveAndHide(element, duration) {
            return this.addMove(duration * 2 / 5, {x: 100, y: 20})
                .addFadeOut(duration * 3 / 5)
                .play(element);
        },

        showAndHide(element, duration) {
            return this.addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        heartBeating(element) {
            return this.addScale(500, 1.4)
                .addScale(500, 1)
                .play(element, true);
        },

        resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = getTransform(0, 1);
        },

        addMove(duration, translation) {
            let animasterCopy = this.copy()
            animasterCopy._steps.push({
                duration,
                action: element => element.style.transform = getTransform(translation, null),
                reset: element => this.resetMoveAndScale(element)
            })
            return animasterCopy;
        },

        addScale(duration, ratio) {
            let animasterCopy = this.copy()
            animasterCopy._steps.push({
                duration,
                action: element => element.style.transform = getTransform(null, ratio),
                reset: element => this.resetMoveAndScale(element)
            })
            return animasterCopy;
        },

        addFadeIn(duration) {
            let animasterCopy = this.copy()
            animasterCopy._steps.push({
                duration,
                action: element => {
                    element.classList.remove('hide');
                    element.classList.add('show');},
                reset: element => this.resetFadeIn(element)
            })
            return animasterCopy;
        },

        addFadeOut(duration) {
            let animasterCopy = this.copy()
            animasterCopy._steps.push({
                duration,
                action: element => {
                    element.classList.remove('show');
                    element.classList.add('hide');},
                reset: element => this.resetFadeOut(element)
            })
            return animasterCopy;
        },

        addDelay(duration) {
            let animasterCopy = this.copy()
            animasterCopy._steps.push({
                duration,
                action: () => null,
                reset: () => null
            });
            return animasterCopy;
        },

        copy() {
            let animasterCopy = animaster();
            animasterCopy._steps = this._steps.slice();
            return animasterCopy;
        },

        play(element, isCycled = false) {
            let tick;
            let timer = setTimeout(tick = index => {
                element.style.transitionDuration = `${this._steps[index].duration}ms`;
                this._steps[index].action(element);
                if (isCycled || index < this._steps.length - 1)
                    timer = setTimeout(tick, Math.round(this._steps[index].duration),
                        (index + 1) % this._steps.length);
            }, 0, 0);

            return {
                stop: () => {
                    clearTimeout(timer);
                },
                reset: () => {
                    element.style.transitionDuration = null;
                    this._steps.slice().reverse().forEach(s => s.reset(element));
                }
            }
        }
    }
}
