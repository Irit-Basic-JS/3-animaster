class Animaster {
    constructor(steps) {
        if (steps) {
            this._steps = steps.slice();
        } else {
            this._steps = [];
        }
    }

    scale(el, step) {
        el.style.transitionDuration = `${step.duration}ms`;
        el.style.transform = `${getTransform(null, step.scale)} ${el.style.transform}`;
    }

    move(el, step) {
        el.style.transitionDuration = `${step.duration}ms`;
        el.style.transform = `${getTransform(step.translation, null)} ${el.style.transform}`;
    }

    fadeIn(el, step) {
        el.style.transitionDuration = `${step.duration}ms`;
        el.classList.remove("hide");
        el.classList.add("show");
    }

    fadeOut(el, step) {
        el.style.transitionDuration = `${step.duration}ms`;
        el.classList
            .remove("show");
        el.classList
            .add("hide");
    }

    moveAndHide(el, step) {
        this
            .move(el, {
                duration: 2 *
                    step.duration / 5, translation: {x: 100, y: 20}
            });
        setTimeout(() =>
            this
                .fadeOut(el, {
                    duration: 3 *
                        step.duration / 5
                }), 2 * step.duration / 5);
    }

    showAndHide(el, step) {
        this
            .fadeIn(el, {duration: step.duration / 3});
        setTimeout(() => this
            .fadeOut(el, {duration: step.duration / 3}), step.duration / 3);
    }

    heartBeating(el, step) {
        this._id = setInterval(function () {
            step.animaster
                .scale(el, {duration: 500, scale: 1.4});
            setTimeout(function () {
                step.animaster
                    .scale(el, {duration: 500, scale: 1});
                el.style.transform = "";
            }, 500);
        }, 1500);
        return {
            stop: this
                .stopHeartBeating,
        };
    }

    flicker(el, duration) {
        el.style.duration = `${duration}ms`;
        for (let x = 0X0; x < 0xffffff; x += 100) {
            setTimeout(function () {
                let str = x
                    .toString(16);
                str = str
                    .padStart(6, "0");
                el.style.backgroundColor = `#${str}`;
            }, 5);
        }
    }

    stopHeartBeating() {
        clearInterval(this._id);
    }

    addFlicker(duration) {
        this._steps
            .push({
                animation: this
                    .flicker,
                duration: duration,
            });
        return new Animaster(this._steps);
    }

    addMove(duration, translation) {
        this._steps
            .push({
                animation: this
                    .move,
                duration: duration,
                translation: translation,
            });
        return new Animaster(this._steps);
    }

    addScale(duration, scale) {
        this._steps
            .push({
                animation: this
                    .scale,
                duration: duration,
                scale: scale,
            });
        return new Animaster(this._steps);
    }

    addMoveAndHide(duration, translation) {
        this._steps
            .push({
                duration: duration,
                translation: translation,
                animation: this
                    .moveAndHide,
            });
        return new Animaster(this._steps);
    }

    addShowAndHide(duration) {
        this._steps
            .push({
                animation: this
                    .showAndHide,
                duration: duration,
            });
        return new Animaster(this._steps);
    }
    addHeartBeating() {
        this._steps
            .push({
                animation: this
                    .heartBeating,
                animaster: this,
            });
        return new Animaster(this._steps);
    }

    addFadeOut(duration) {
        this._steps
            .push({
                animation: this
                    .fadeOut,
                duration: duration,
            });
        return new Animaster(this._steps);
    }

    addFadeIn(duration) {
        this._steps
            .push({
                animation: this
                    .fadeIn,
                duration: duration,
            });
        return new Animaster(this._steps);
    }

    play(el, cycled = false) {
        const reset = function reset() {
            el.style.opacity = opacity;
            el.classList
                .remove("hide");
            el.classList
                .remove("show");
            el.style.transform = null;
            el.style.scale = null;
        };

        const opacity = el.style.opacity;
        if (cycled) {
            let delay = 0;
            for (const step of this._steps) {
                delay +=
                    step.duration;
            }
            const id = setInterval(() => {
                this
                    .playOnce(el);
                reset();
            }, delay);
        } else {
            this
                .playOnce(el);
        }
        return {
            stop: this
                .stopHeartBeating,
        };
    }

    playOnce(el) {
        let delay = 0;
        for (const step of this._steps) {
            setTimeout(() => step.animation
                .call(this, element, step), delay);
            delay +=
                step.duration;
        }
        return delay;
    }

    resetMoveOrScale(el) {
        el.style.transform = "";
        el.transitionDuration = "";
    }

    resetFadeIn(el) {
        el.style = null;
        el.classList
            .remove("show");
        el.classList
            .add("hide");
    }


    resetFadeOut(el) {
        el.style = null;
        el.classList
            .remove("hide");
        el.classList
            .add("show");
    }

    resetMoveAndHide(el) {
        this
            .resetMoveOrScale(el);
        this
            .resetFadeOut(el);
    };

    buildHandler() {
        const animaster = this;
        return function () {
            animaster
                .play(this);
        };
    }
}

const anim = new Animaster()
    .addMove(200, {x: 40, y: 40})
    .addScale(800, 1.3)
    .addMove(200, {x: 80, y: 0})
    .addScale(800, 1)
    .addMove(200, {x: 40, y: -40})
    .addScale(800, 0.7)
    .addMove(200, {x: 0, y: 0})
    .addScale(800, 1);
const block = document
    .getElementById("testBlock")
    .addEventListener("click", anim
        .buildHandler());

addListeners();


function addListener(name, option, func) {
    document
        .querySelector(`#${name}${option}`)
        .addEventListener("click", function () {
            const block = document
                .querySelector(`#${name}Block`);
            func(block);
        });
}