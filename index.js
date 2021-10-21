addListeners();

function addListeners() {
    //Вызов лёгких функций
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            //animaster().move(block, 1000, {x: 100, y: 10});
            let a = animaster().addMove(1000, { x: 100, y: 10 });
            let b = a.addFadeOut(1000);
            a.play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });

    //Вызов сложных функций
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            // let timer = animaster().moveAndHide(block, 5000);
            duration = 5000;
            animaster().addMove(duration * 2 / 5, { x: 100, y: 20 }).addFadeOut(duration * 3 / 5).play(block)
            //document.getElementById('moveAndHideStop')
            // .addEventListener('click', function () {
            //    animaster().resetMoveAndHide(block);
            // });
        });
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            //animaster().showAndHide(block, 5000);
            let duration = 5000;
            animaster().addFadeIn(duration / 3).addDelay(duration / 3).addFadeOut(duration / 3).play(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let beating = animaster().heartBeating(block);

            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    clearInterval(beating);
                });
        });
    //document.getElementById('heartBeatingStop')
    // .addEventListener('click', function () {
    // clearInterval(beating);
    //});
    document.getElementById('customPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
            animaster()
            .addMove(10, { x: -40, y: -60 })
            .addFadeIn(300)
            .addMove(200, { x: 300, y: -60 })
            .addMove(200, { x: -40, y: 100 })
            .addMove(200, { x: 300, y: 100 })
            .addFadeOut(700)
            .play(block);
        });
}

class Animaster {
    constructor(mas = []) {
        this._steps = mas;
    }

    //Начало блока функций анимации
    fadeIn = function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    move = function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    scale = function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    fadeOut = function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    //Конец простых анимаций

    moveAndHide = function moveAndHide(element, duration) {
        this.move(element, duration * 2 / 5, { x: 100, y: 20 });
        return setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5);
    }

    showAndHide = function showAndHide(element, duration) {
        this.fadeIn(element, duration / 3);
        setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
    }

    heartBeating = function heartBeating(element) {
        return setInterval(() => {
            this.scale(element, 500, 1.4);
            setTimeout(() => this.scale(element, 500, 1), 500);
        }, 1000);
    }
    //Конец блока функций анимации

    //начало перечисления функций отмены
    #resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    #resetMoveAndScale(element) {
        element.style.transform = getTransform(null, null);
    }

    #resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    resetMoveAndHide = function resetMoveAndHide(element) {
        //clearTimeout(timer)
        this.#resetMoveAndScale(element);
        this.#resetFadeOut(element);
    }
    //конец блока функций отмены

    //начало блока функций Add
    addMove(duration, translation) {
        let a = this._steps.map((x) => x);
        a.push(['move', duration, translation]);
        return new Animaster(a);
    }

    addScale(duration, ratio) {
        let a = this._steps.map((x) => x);
        a.push(['scale', duration, ratio]);
        return new Animaster(a);
    }

    addFadeIn(duration) {
        let a = this._steps.map((x) => x);
        a.push(['fadeIn', duration]);
        return new Animaster(a);
    }

    addFadeOut(duration) {
        let a = this._steps.map((x) => x);
        a.push(['fadeOut', duration]);
        return new Animaster(a);
    }

    addDelay(duration) {
        let a = this._steps.map((x) => x);
        a.push(['delay', duration]);
        return new Animaster(a);
    }
    //Конец блока функций Add

    play(element) {
        console.log(this._steps.length);
        let time = 0;
        for (let i of this._steps) {
            switch (i[0]) {
                case 'move':
                    //console.log('move');
                    //console.log(i[2]);
                    setTimeout(() => this.move(element, i[1], i[2]), time);
                    break;
                case 'scale':
                    //console.log('scale');
                    setTimeout(() => this.scale(element, i[1], i[2]), time);
                    break;
                case 'fadeIn':
                    //console.log('scale');
                    setTimeout(() => this.fadeIn(element, i[1]), time);
                    break;
                case 'fadeOut':
                    //console.log('scale');
                    setTimeout(() => this.fadeOut(element, i[1]), time);
                    break;
                case 'delay':
                    break;
            }
            time = time + i[1] + 50;
        }
    }
}

function animaster() {    //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    let animated = {
        resetFadeIn: function resetFadeIn(element) {
            element.style.transitionDuration = null;
            //element.classList.remove('hide');
            //element.classList.add('show');
        },
        _resetMoveAndScale: function resetMove(element) {
            element.style.transitionDuration = null;
            //element.classList.remove('hide');
            //element.classList.add('show');
        },
        _resetFadeOut: function resetFadeOut(element) {
            element.style.transitionDuration = null;
            //element.classList.remove('hide');
            //element.classList.add('show');
        }
    };
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    animated.fadeIn = function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
        //animated.#resetFadeIn();
    }
    //animated.#resetFadeIn = function resetFadeIn(element) {
    //  element.style.transitionDuration =  null;
    //element.classList.remove('hide');
    //element.classList.add('show');
    //}

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    animated.move = function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }
    //animated.#resetMoveAndScale = function resetMove(element) {
    //element.style.transitionDuration =  null;
    //element.classList.remove('hide');
    //element.classList.add('show');
    //}
    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    animated.scale = function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    animated.fadeOut = function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    //animated.#resetFadeOut = function resetFadeOut(element) {
    //  element.style.transitionDuration =  null;
    //element.classList.remove('hide');
    //element.classList.add('show');
    //}

    animated.moveAndHide = function moveAndHide(element, duration) {
        animated.move(element, duration * 2 / 5, { x: 100, y: 20 });
        return setTimeout(() => animated.fadeOut(element, duration * 3 / 5), duration * 2 / 5);
    }
    animated.resetMoveAndHide = function resetMoveAndHide(element, timer) {
        clearTimeout(timer);
        animated.resetMove();
        animated.resetFadeOut();
    }

    animated.showAndHide = function showAndHide(element, duration) {
        animated.fadeIn(element, duration / 3);
        setTimeout(() => animated.fadeOut(element, duration / 3), duration / 3);
    }

    animated.heartBeating = function heartBeating(element) {
        return setInterval(() => {
            animated.scale(element, 500, 1.4);
            setTimeout(() => animated.scale(element, 500, 1), 500);
        }, 1000);
    }

    return new Animaster;
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
