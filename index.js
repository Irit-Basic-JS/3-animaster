class Animaster {
    constructor(steps) {
        if (steps) {
            this._steps = steps.slice();
        } else {
            this._steps = [];
        }
    }

    scale(element, step) {
        element.style.transitionDuration = `${step.duration}ms`;
        element.style.transform = `${getTransform(null, step.scale)} ${element.style.transform}`;
    }

    move(element, step) {
        element.style.transitionDuration = `${step.duration}ms`;
        element.style.transform = `${getTransform(step.translation, null)} ${element.style.transform}`;
    }

    fadeIn(element, step) {
        element.style.transitionDuration = `${step.duration}ms`;
        element.classList.remove("hide");
        element.classList.add("show");
    }

    fadeOut(element, step) {
        element.style.transitionDuration = `${step.duration}ms`;
        element.classList.remove("show");
        element.classList.add("hide");
    }

    moveAndHide(element, step) {
        this.move(element, {duration: 2 * step.duration / 5, translation: {x: 100, y: 20}});
        setTimeout(() =>
            this.fadeOut(element, {duration: 3 * step.duration / 5}), 2 * step.duration / 5);
    }

    showAndHide(element, step) {
        this.fadeIn(element, {duration: step.duration / 3});
        setTimeout(() => this.fadeOut(element, {duration: step.duration / 3}), step.duration / 3);
    }

    heartBeating(element, step) {
        this._id = setInterval(function () {
            step.animaster.scale(element, {duration: 500, scale: 1.4});
            setTimeout(function () {
                step.animaster.scale(element, {duration: 500, scale: 1});
                element.style.transform = "";
            }, 500);
        }, 1500);
        return {
            stop: this.stopHeartBeating,
        };
    }

    flicker(element, duration) {
        element.style.duration = `${duration}ms`;
        for (let i = 0X0; i < 0xffffff; i += 100) {
            setTimeout(function () {
                let str = i.toString(16);
                str = str.padStart(6, "0");
                element.style.backgroundColor = `#${str}`;
            }, 5);
        }
    }

    stopHeartBeating() {
        clearInterval(this._id);
    }

    addFlicker(duration) {
        this._steps.push({
            animation: this.flicker,
            duration: duration,
        });
        return new Animaster(this._steps);
    }

    addMove(duration, translation) {
        this._steps.push({
            animation: this.move,
            duration: duration,
            translation: translation,
        });
        return new Animaster(this._steps);
    }

    addScale(duration, scale) {
        this._steps.push({
            animation: this.scale,
            duration: duration,
            scale: scale,
        });
        return new Animaster(this._steps);
    }

    addMoveAndHide(duration, translation) {
        this._steps.push({
            duration: duration,
            translation: translation,
            animation: this.moveAndHide,
        });
        return new Animaster(this._steps);
    }

    addShowAndHide(duration) {
        this._steps.push({
            animation: this.showAndHide,
            duration: duration,
        });
        return new Animaster(this._steps);
    }

    addHeartBeating() {
        this._steps.push({
            animation: this.heartBeating,
            animaster: this,
        });
        return new Animaster(this._steps);
    }

    addFadeOut(duration) {
        this._steps.push({
            animation: this.fadeOut,
            duration: duration,
        });
        return new Animaster(this._steps);
    }

    addFadeIn(duration) {
        this._steps.push({
            animation: this.fadeIn,
            duration: duration,
        });
        return new Animaster(this._steps);
    }

    play(element, cycled = false) {
        const reset = function reset() {
            element.style.opacity = opacity;
            element.classList.remove("hide");
            element.classList.remove("show");
            element.style.transform = null;
            element.style.scale = null;
        };
        const opacity = element.style.opacity;
        if (cycled) {
            let delay = 0;
            for (const step of this._steps) {
                delay += step.duration;
            }
            const id = setInterval(() => {
                this.playOnce(element);
                reset();
            }, delay);
        } else {
            this.playOnce(element);
        }
        return {
            stop: this.stopHeartBeating,
        };
    }

    playOnce(element) {
        let delay = 0;
        for (const step of this._steps) {
            setTimeout(() => step.animation.call(this, element, step), delay);
            delay += step.duration;
        }
        return delay;
    }

    resetMoveOrScale(element) {
        element.style.transform = "";
        element.transitionDuration = "";
    }

    resetFadeIn(element) {
        element.style = null;
        element.classList.remove("show");
        element.classList.add("hide");
    }


    resetFadeOut(element) {
        element.style = null;
        element.classList.remove("hide");
        element.classList.add("show");
    }

    resetMoveAndHide(element) {
        this.resetMoveOrScale(element);
        this.resetFadeOut(element);
    };

    buildHandler() {
        const animaster = this;
        return function () {
            animaster.play(this);
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
const block = document.getElementById("testBlock")
    .addEventListener("click", anim.buildHandler());

addListeners();

function addListener(name, option, func) {
    document.querySelector(`#${name}${option}`)
        .addEventListener("click", function () {
            const block = document.querySelector(`#${name}Block`);
            func(block);
        });
}
function addListeners() {
    addListener("fadeIn", "Play", (block) => anim.fadeIn(block, {duration: 1000}));
    addListener("move", "Play", (block) => anim.move(block, {duration: 1000, translation: {x: 100, y: 10}}));
    addListener("scale", "Play", (block) => anim.scale(block, {duration: 1000, scale: 1.25}));
    addListener("fadeOut", "Play", (block) => anim.fadeOut(block, {duration: 5000}));
    addListener("moveAndHide", "Play", (block) => anim.moveAndHide(block, {duration: 5000}));
    addListener("showAndHide", "Play", (block) => anim.showAndHide(block, {duration: 3000}));
    addListener("heartBeating", "Play", (block) => anim.heartBeating(block, {animaster: anim}));
    addListener("heartBeating", "Stop", (block) => anim.stopHeartBeating());
    addListener("moveAndHide", "Reset", (block) => anim.resetMoveAndHide(block));
    addListener("fadeIn", "Reset", (block) => anim.resetFadeIn(block));
    addListener("fadeOut", "Reset", (block) => anim.resetFadeOut(block));
    addListener("scale", "Reset", (block) => anim.resetMoveOrScale(block));
    addListener("move", "Reset", (block) => anim.resetMoveOrScale(block));
    addListener("changeColor", "Play", (block) => anim.flicker(block, 1000));
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(" ");
}
