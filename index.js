addListeners();

function addListeners() {

    const state = {};

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            // animaster().fadeIn(block, 1000);
            state.fadeIn = animaster().addFadeIn(1000).play(block);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            state.fadeIn.reset();
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            // animaster().fadeOut(block, 1000);
            state.fadeOut = animaster().addFadeOut(1000).play(block);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            state.fadeOut.reset();
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            // animaster.move(block, 1000, { x:100, y: 10 });
            state.move = animaster().addMove(1000, { x: 100, y: 10 }).play(block);
        });

    // const worryAnimationHandler = animaster()
    //     .addMove(200, {x: 80, y: 0})
    //     .addMove(200, {x: 0, y: 0})
    //     .addMove(200, {x: 80, y: 0})
    //     .addMove(200, {x: 0, y: 0})
    //     .buildHandler();
    
    // document
    //     .getElementById('moveBlock')
    //     .addEventListener('click', worryAnimationHandler);

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            state.move.reset();
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            // animaster().scale(block, 1000, 1.25);
            state.scale = animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            state.scale.reset();
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            // state = animaster().moveAndHide(block, 1000, {x: 100, y: 20});
            state.moveAndHide = animaster().addMoveAndHide(1000, { x: 100, y: 20 }).play(block);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            state.moveAndHide.reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            // animaster().showAndHide(block, 1000);
            state.showAndHide = animaster()
                .addFadeIn(333)
                .addDelay(333)
                .addFadeOut(333)
                .play(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            state.heartBeating = animaster().addHeartBeating(500, 1.4).play(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            state.heartBeating.stop();
        });

    document.getElementById('transformToCirclePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('transformToCircle');
            // state.transformToCircle = animaster().transformToCircle(element, 1000);
            state.transformToCircle = animaster().addtransformToCircle(1000).play(block);
        });

    document.getElementById('transformToCircleReset')
        .addEventListener('click', function () {
            state.transformToCircle.reset();
        })
}

function animaster() {

    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');

        return {
            reset() { resetFadeIn(element) }
        };
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');

        return {
            reset() { resetFadeOut(element) }
        }
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);

        return {
            reset() { resetMoveAndScale(element) }
        }
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);

        return {
            reset() { resetMoveAndScale(element) }
        }
    }

    function moveAndHide(element, duration, translation) {
        move(element, duration / 5 * 2, translation);
        let timer = setTimeout(() => fadeOut(element, duration / 5 * 3), duration / 5 * 2);

        return {
            reset() {
                clearTimeout(timer);
                resetMoveAndScale(element);
                resetFadeOut(element);
            }
        }
    }

    function showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(() => fadeOut(element, duration / 3), duration / 3 * 2);
    }

    function heartBeating(element, duration, ratio) {
        scale(element, duration, ratio);
        let timerId1 = setInterval(() => scale(element, duration, 1), duration);
        let timerId2 = setInterval(() => scale(element, duration, ratio), duration * 2);

        return {
            stop() {
                scale(element, duration, 1);
                clearInterval(timerId1);
                clearInterval(timerId2);
            }
        }
    }

    function transformToCircle (element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.borderRadius = '50%';

        return {
            reset() { resettransformToCircle(element) }
        };
    }

    function resetFadeIn (element) {
        element.style.transitionDuration = '0ms';
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut (element) {
        element.style.transitionDuration = '0ms';
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale (element) {
        element.style.transitionDuration = '0ms';
        element.style.transform = getTransform({ x: 0, y: 0 }, 1);
    }

    function resettransformToCircle (element) {
        element.style.transitionDuration = '0ms';
        element.style.borderRadius = null;
    }

    return {
        _steps: [],
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide,
        heartBeating,
        transformToCircle,

        addMove: function (duration, translation) {
            this._steps.push({
                name: 'move',
                duration,
                translation,
            });

            return this;
        },

        addScale: function (duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration,
                ratio,
            });

            return this;
        },

        addFadeIn: function (duration) {
            this._steps.push({
                name: 'fadeIn',
                duration,
            });

            return this;
        },

        addFadeOut: function (duration) {
            this._steps.push({
                name: 'fadeOut',
                duration,
            });

            return this;
        },

        addMoveAndHide: function (duration, translation) {
            this._steps.push({
                name: 'moveAndHide',
                duration,
                translation,
            });

            return this;
        },

        addHeartBeating: function (duration, ratio) {
            this._steps.push({
                name: 'heartBeating',
                duration,
                ratio
            });

            return this;
        },

        addtransformToCircle: function (duration) {
            this._steps.push({
                name: 'transformToCircle',
                duration,
            })

            return this;
        },

        addDelay: function (duration) {
            this._steps.push({
                name: 'delay',
                duration,
            });

            return this;
        },

        buildHandler: function () {
            return (element) => this.play(element.currentTarget);
        },

        play: function (element) {
            let state;
            let step = this._steps.shift();

            switch (step.name) {
                case 'move': 
                    state = move(element, step.duration, step.translation);
                    break;
                case 'scale':
                    state = scale(element, step.duration, step.ratio);
                    break;
                case 'fadeIn':
                    state = fadeIn(element, step.duration);
                    break;
                case 'fadeOut':
                    state = fadeOut(element, step.duration);
                    break;
                case 'moveAndHide':
                    state = moveAndHide(element, step.duration, step.translation);
                    break;
                case 'heartBeating':
                    state = heartBeating(element, step.duration, step.ratio);
                    break;
                case 'transformToCircle':
                    state = transformToCircle(element, step.duration);
                    break;
                case 'delay':
                    break;
            }
            
            let timerId = setInterval(() => {  
                if (this._steps.length !== 0) { 
                    this.play(element);
                } 
                clearInterval(timerId);
            }, step.duration);

            return state;
        }
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
