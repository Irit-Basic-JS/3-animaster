addListeners(false,
    ['fadeIn', 5000],
    ['scale', 1000, 1.25],
    ['moveAndHide', 1000, {x: 100, y: 20}],
    ['move', 1000, {x: 100, y: 10}],
    ['showAndHide', 1000]);

addListeners(true, ['heartBeating']);

function addListeners(cycle, ...listeners) {
    for (let listener of listeners) {
        let block = document.getElementById(listener[0] + 'Block');
        let action = document.getElementById(listener[0] + (cycle ? 'Stop' : 'Reset'));

        document.getElementById(listener[0] + 'Play').addEventListener('click', function () {
                let element = animaster()[listener[0]](block, ...listener.slice(1));
                action.addEventListener('click', cycle ? element.stop : element.reset)
            });
    }
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

        fadeOut(element, duration) {
            return this.addFadeOut(duration).play(element);
        },
        
        fadeIn(element, duration) {
            return this.addFadeIn(duration).play(element);
        },

        scale(element, duration, scale) {
            return this.addScale(duration, scale).play(element);
        },

        move(element, duration, translation) {
            return this.addMove(duration, translation).play(element);
        },

        showAndHide(element, duration) {
            return this.addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },
        
        moveAndHide(element, duration) {
            return this.addMove(duration * 2 / 5, {x: 100, y: 20})
                .addFadeOut(duration * 3 / 5)
                .play(element);
        },

        heartBeating(element) {
            return this.addScale(500, 1.4)
                .addScale(500, 1)
                .play(element, true);
        },

        resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        
        resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = getTransform(0, 1);
        },

        addFadeIn(duration) {
            let newAnimaster = this.copy()
            newAnimaster._steps.push({
                duration,
                action: element => {
                    element.classList.remove('hide');
                    element.classList.add('show');},
                reset: element => this.resetFadeIn(element)
            })
            return newAnimaster;
        },

        addScale(duration, scale) {
            let newAnimaster = this.copy()
            newAnimaster._steps.push({
                duration,
                action: element => element.style.transform = getTransform(null, scale),
                reset: element => this.resetMoveAndScale(element)
            })
            return newAnimaster;
        },

        addMove(duration, translation) {
            let newAnimaster = this.copy()
            newAnimaster._steps.push({
                duration,
                action: element => element.style.transform = getTransform(translation, null),
                reset: element => this.resetMoveAndScale(element)
            })
            return newAnimaster;
        },

        addFadeOut(duration) {
            let newAnimaster = this.copy()
            newAnimaster._steps.push({
                duration,
                action: element => {
                    element.classList.remove('show');
                    element.classList.add('hide');},
                reset: element => this.resetFadeOut(element)
            })
            return newAnimaster;
        },

        addDelay(duration) {
            let newAnimaster = this.copy()
            newAnimaster._steps.push({
                duration,
                action: () => null,
                reset: () => null
            });
            return newAnimaster;
        },

        copy() {
            let newAnimaster = animaster();
            newAnimaster._steps = this._steps.slice();
            return newAnimaster;
        },

        play(element, cycle = false) {
            let tick;
            let timer = setTimeout(tick = index => {
                element.style.transitionDuration = `${this._steps[index].duration}ms`;
                this._steps[index].action(element);
                if (cycle || index < this._steps.length - 1)
                    timer = setTimeout(tick, Math.round(this._steps[index].duration),
                        (index + 1) % this._steps.length);
            }, 0, 0);

            return {
                stop: () => {clearTimeout(timer);},
                reset: () => {
                    element.style.transitionDuration = null;
                    this._steps.slice().reverse().forEach(s => s.reset(element));
                }
            }
        }
    }
}

function setMode(element, show) {
    element.classList.remove(show ? 'hide' : 'show');
    element.classList.add(show ? 'show' : 'hide');
}

function getTransform(translation, scale) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (scale) {
        result.push(`scale(${scale})`);
    }
    return result.join(' ');
}
