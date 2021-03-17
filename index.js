addListeners();



function animaster() {
    return {
        _steps: [],

        resetFadeIn(element, timer = null) {
            if (timer !== null) clearTimeout(timer);
            element.style.transitionDuration =  null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetFadeOut(element, timer = null) {
            if (timer !== null) clearTimeout(timer);
            element.style.transitionDuration =  null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        resetMoveAndScale(element, timer = null) {
            if (timer !== null) clearTimeout(timer);
            element.style.transitionDuration =  null;
            element.style.transform = null;
        },

        addMove(duration, transform) {
            this._steps.push({option(e, d, t) {move(e, d, t)}, duration, transform}); // TODO Исправить
            return this;
        },
        addScale(duration, transform) {
            this._steps.push({option(e, d, t) {scale(e, d, t)}, duration, transform}); // TODO Исправить
            return this;
        },
        addFadeIn(duration) {
            this._steps.push({option(e, d) {fadeIn(e, d)}, duration}); // TODO Исправить
            return this;
        },
        addFadeOut(duration) {
            this._steps.push({option(e, d) {fadeOut(e, d)}, duration}); // TODO Исправить
            return this;
        },
        play(element) {
            let duration = 0;
            for (let el of this._steps) {
                setTimeout(() => el.option(element, el.duration, el.transform), duration);
                duration += el.duration;
            }
            console.log(this._steps);
        },

        move(element, duration, translation) {
            move(element, duration, translation);
        },
        fadeIn(element, duration) {
            fadeIn(element, duration);
        },
        scale(element, duration, ratio) {
            scale(element, duration, ratio);
        },
        fadeOut(element, duration) {
            fadeOut(element, duration);
        },
        moveAndHide(element, duration, translation) {
            return moveAndHide(element, duration, translation);
        },
        showAndHide(element, duration) {
            showAndHide(element, duration);
        },
        heartBeating(element, duration, ratio) {
            heartBeating(element, duration, ratio);
            let interval = setInterval(() => heartBeating(element, duration, ratio), 1000);
            return {
                stop() {
                    clearInterval(interval);
                }
            }
        }
    };
}



function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });


    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            //animaster().move(block, 1000, {x: 100, y: 10});
            //animaster().addMove(5000, {x: 100, y: 10}).play(block);
            const customAnimation = animaster()
                .addFadeOut(500)
                .addFadeIn(500)
                .addMove(200, {x: 0, y: 100})
            customAnimation.play(block);
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);

        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        });

    let timer;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            timer = animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndScale(block, timer);
            animaster().resetFadeOut(block, timer);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    let heartBeating;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeating = animaster().heartBeating(block, 500, 1.4);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeating !== undefined) heartBeating.stop();
        });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
function fadeIn(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
}

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */
function move(element, duration, translation) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(translation, null);
}

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
function scale(element, duration, ratio) {
    element.style.transitionDuration =  `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
}

function fadeOut(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('show');
    element.classList.add('hide');
}

function moveAndHide(element, duration, translation) {
    const moveDuration = Math.floor((duration * 2) / 5);
    const hideDuration = duration - moveDuration;
    animaster().move(element, moveDuration, translation);
    return setTimeout(() => animaster().fadeOut(element, hideDuration), moveDuration);
}

function showAndHide(element, duration) {
    const showAndHideDuration = Math.floor((duration) / 3);
    const restDuration = duration - showAndHideDuration * 2;
    animaster().fadeIn(element, showAndHideDuration);
    setTimeout(null, restDuration);
    setTimeout(() => animaster().fadeOut(element, showAndHideDuration), showAndHideDuration + restDuration);
}

function heartBeating(element, duration, ratio) {
    animaster().scale(element, duration, ratio);
    setTimeout(() => animaster().scale(element, duration, 1), duration);
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
