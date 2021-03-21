addListeners();

function addListeners() {

//region SimpleCommands
    let resetFadeIn = undefined;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            resetFadeIn = animaster().addFadeIn(5000).play(block);
        });
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            resetFadeIn.reset(block);
        });

    let resetFadeOut = undefined;
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            resetFadeOut = animaster().addFadeOut(5000).play(block);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            resetFadeOut.reset(block);
        });

    let resetMovePlay = undefined;
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            resetMovePlay = animaster()
                .addMove(1000, {x: 100, y: 10})
                .play(block);
        });
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            resetMovePlay.reset(block);
        });

    let resetScale = undefined;
    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            resetScale = animaster().addScale(1000, 1.25).play(block);
        });
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            resetScale.reset(block);
        });

    let backgroundReset = undefined;
    document.getElementById('backgroundPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('backgroundBlock');
            backgroundReset = animaster()
                .addChangeBackGroundColor(1000, "black")
                .play(block);
        });
    document.getElementById('backgroundReset')
        .addEventListener('click', function () {
            const block = document.getElementById('backgroundBlock');
            backgroundReset.reset(block);
        });

//endregion

    let resetMoveAndHide = undefined;
    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndHide = animaster()
                .addMoveAndHide(2000, {x: 100, y: 20})
                .play(block);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndHide.reset(block);
        });

    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster()
                .addShowAndHide(2000)
                .play(block);
        });

    let heartBeatingStop = undefined;
    document.getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingStop = animaster()
                .addHeartBeating()
                .play(block, true);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeatingStop.stop();
        });

    let comboReset = undefined;
    document.getElementById('comboPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('comboBlock');
            let a = animaster().addScale(300, 0.1)
                .addMove(300, {x:40, y: 40});
            let b = a.addScale(500, 1,1)
                    .addChangeBackGroundColor(500, "black");
            console.log(a._steps);
            console.log(b._steps);
            comboReset = animaster()
                .addFadeIn(500)
                .addMove(200, {x: 40, y: 40})
                .addScale(200, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addFadeOut(10)
                .play(block);
        });

    document.getElementById('comboReset')
        .addEventListener('click', function () {
            const block = document.getElementById('comboBlock');
            comboReset.reset(block);
        });

    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();
    document
        .getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
}

function animaster() {
    this._steps = [];
    this._copy = function () {
        let copy = Object.assign({}, this);
        copy._steps = copy._steps.slice();
        return copy
    }

    let simpleCommands = {
        fadeIn (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        resetFadeIn (element) {
            element.style = null;
            element.classList.add('hide');
            element.classList.remove('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut (element) {
            element.style = null;
            element.classList.add('show');
            element.classList.remove('hide');
        },

        move (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        resetMoveAndScale (element) {
            element.style = null;
        },

        changeBackGroundColor (element, duration, color) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.backgroundColor = color;
        }
    }
    //region CommandsAdd
    this.addMoveAndHide = function (duration, translation) {
        let copy = this.addMove(duration * 0.4, translation);
        copy = copy.addFadeOut(duration * 0.6);
        return copy;
    };

    this.addShowAndHide = function (duration) {
        let copy = this.addFadeIn(duration * 1 / 3)._steps;
        copy = copy.addDelay(duration * 1 / 3);
        copy = copy.addFadeOut(duration * 1 / 3);
        return copy;
    };

    this.addHeartBeating = function () {
        let copy = this.addScale(300, 1.4);
        copy = copy.addScale(300, 1);
        return copy;
    };

    this.addFadeIn = function (duration) {
        let copy = this._copy();
        copy._steps.push({command: "fadeIn", duration});
        return copy;
    };

    this.addFadeOut = function (duration) {
        let copy = this._copy();
        copy._steps.push({command: "fadeOut", duration});
        return copy;
    }

    this.addMove = function (duration, translation) {
        let copy = this._copy();
        copy._steps.push({command: "move", duration, translation});
        return copy;
    };

    this.addScale = function (duration, ratio) {
        let copy = this._copy();
        copy._steps.push({command: "scale", duration, ratio});
        return copy;
    };

    this.addDelay = function (duration) {
        let copy = this._copy();
        copy._steps.push({duration});
        return copy;
    };

    this.addChangeBackGroundColor = function (duration, color) {
        let copy = this._copy();
        copy._steps.push({command: "changeBackGroundColor", duration, color});
        return copy;
    }
//endregion

    this.play = function (element, cycled = false) {
        let flag = element.classList.contains("show") || !element.classList.contains("hide");
        let arrayTimeOut = [];
        let _interval = undefined;
        let runCommands = () => {
            let duration = 0;
            for (const anim of this._steps) {
                arrayTimeOut.push(setTimeout(() =>
                    simpleCommands[anim["command"]](element, anim["duration"],
                        anim["translation"] || anim["ratio"] || anim["color"]), duration));
                duration += anim["duration"];
            }
        };
        if (cycled) {
            _interval = setInterval(() => runCommands(),
                this._steps.reduce((a, b) => a["duration"] + b["duration"]));
        } else {
            runCommands();
        }

        return {
            reset: (element) => {
                arrayTimeOut.forEach(x => clearTimeout(x));
                if (flag)
                    simpleCommands.resetFadeOut(element);
                else
                    simpleCommands.resetFadeIn(element);
                simpleCommands.resetMoveAndScale(element);
            },
            stop: () => {
                clearInterval(_interval);
            }
        }
    };

    this.buildHandler = function () {
        return (el) => this.play(el.target);
    }

    return this;
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
