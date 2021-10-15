addElements();

function addElement(text, func, ...blockClasses) {
    const container = document.createElement('div');
    container.classList.add('container');

    const header = document.createElement('header');
    header.classList.add("container-header");

    const h3 = document.createElement('h3');
    h3.classList.add('animation-name');
    h3.innerText = text;

    const block = document.createElement('div');
    block.classList = blockClasses;
    block.classList.add('block');

    const button = document.createElement('button');
    button.classList.add('button');
    button.innerText = 'Play';

    let animator = undefined;
    button.addEventListener('click', () => {
        animator = func(block);
    });

    header.append(h3);
    header.append(button);
    container.append(header);
    container.append(block);

    document.body.append(container);
    return {
        container,
        header,
        block,
        getAnimator() {
            return animator;
        }
    };
}

function addElementWithTwoButtons(text, func, secondText, ...blockClasses) {
    const {header, getAnimator} = addElement(text, func, blockClasses);
    const stopButton = document.createElement('button');
    stopButton.classList.add('button');
    stopButton.innerText = secondText;
    stopButton.addEventListener('click', () => {
        const animator = getAnimator();
        (animator.stop || animator.reset)();
    });
    header.append(stopButton);
}

function addElements() {
    addElement('fadeIn/fadeOut', block => {
        block.classList.contains('hide') ?
            animaster().fadeIn(block, 500) :
            animaster().fadeOut(block, 500);
    }, 'hide');

    addElementWithTwoButtons('move',
        block => animaster().move(block, 1000, {x: 100, y: 10}),
        'Reset');

    addElementWithTwoButtons('scale',
        block => animaster().scale(block, 1000, 1.25),
        "Reset");

    addElementWithTwoButtons('moveAndHide',
        block => animaster().moveAndHide(block, 1000),
        "Reset");

    addElement('showAndHide',
        block => animaster().showAndHide(block, 1000),
        'hide');

    addElementWithTwoButtons('heartBeating',
        block => animaster().heartBeating(block, 1000),
        "Stop");

    addElementWithTwoButtons('backgroundSize',
        block => {
            return animaster()
                .addBackgroundSize(2000, 100)
                .addBackgroundSize(1000, 20)
                .play(block, true);
        },
        "Stop", 'radial-background');

    addElement('immutable',
        block => {
            const a = animaster().addMove(111, {x: 10, y: -10});
            a.addFadeOut(400);
            a.play(block);
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

    return {
        _steps: [],

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
            return {
                reset() {
                    animaster().resetMoveAndScale(element);
                }
            };
        },

        changeBackgroundSize(element, duration, size) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.backgroundSize = `${size}px ${size}px`;
            return {
                reset() {
                    animaster().resetBackgroundSize(element);
                }
            };
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
            return {
                reset() {
                    animaster().resetMoveAndScale(element);
                }
            };
        },

        moveAndHide(element, duration) {
            const timing = duration / 5;
            return this.addMove(timing * 2, {x: 100, y: 20})
                .addDelay(timing * 2)
                .addFadeOut(timing * 3)
                .play(element);
        },

        showAndHide(element, duration) {
            const timing = duration / 3;
            this.addFadeIn(timing)
                .addDelay(timing)
                .addFadeOut(timing)
                .play(element);
        },

        heartBeating(element, duration) {
            return this
                .addScale(duration / 4, 1.4)
                .addDelay(duration / 4)
                .addScale(duration / 4, 1)
                .addDelay(duration / 4)
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
            element.style.transform = null;
            element.style.scale = null;
        },

        resetMoveAndHide(element) {
            element.style.transform = null;
            this.resetFadeOut(element);
        },

        resetBackgroundSize(element) {
            element.style.transitionDuration = null;
            element.style.backgroundSize = null;
        },

        wait(duration) {
            setTimeout(() => {
            }, duration);
        },

        addAnimation(animation, duration, ...other) {
            const copy = Object.assign({}, this);
            copy._steps = this._steps.slice();
            copy._steps.push({
                animation,
                duration,
                other
            });
            return copy;
        },

        play(element, cycled = false) {
            const cycle = (function () {
                let totalDelay = 0;
                for (const step of this._steps) {
                    setTimeout(() => this[step.animation](element, step.duration, ...step.other), totalDelay);
                    totalDelay += step.duration;
                }
                return totalDelay;
            }).bind(this);

            const totalDelay = cycle();
            return cycled ? this.getStop(cycle, totalDelay) : this.getReset(element);
        },

        getReset(element) {
            const undo = [];
            const animations = this._steps.map(step => step.animation);
            if (animations.includes('move') || animations.includes('scale'))
                undo.push(animaster().resetMoveAndScale);
            if (animations.includes('changeBackgroundSize'))
                undo.push(animaster().resetBackgroundSize);
            for (const animation of animations) {
                if (animation === 'fadeIn' || animation === 'fadeOut') {
                    if (animation === 'fadeIn')
                        undo.push(animaster().resetFadeIn);
                    else
                        undo.push(animaster().resetFadeOut);
                    break;
                }
            }
            return {
                reset() {
                    for (const action of undo)
                        action(element);
                }
            };
        },

        getStop(cycle, totalDelay) {
            const beating = setInterval(() => cycle(), totalDelay);
            return {
                stop() {
                    clearInterval(beating);
                }
            };
        },

        addMove(duration, translation) {
            return this.addAnimation('move', duration, translation);
        },

        addScale(duration, ratio) {
            return this.addAnimation('scale', duration, ratio);
        },

        addFadeIn(duration) {
            return this.addAnimation('fadeIn', duration);
        },

        addFadeOut(duration) {
            return this.addAnimation('fadeOut', duration);
        },

        addDelay(duration) {
            return this.addAnimation('wait', duration);
        },

        addBackgroundSize(duration, size) {
            return this.addAnimation('changeBackgroundSize', duration, size);
        },

        buildHandler() {
            const animator = this;
            return function () {
                animator.play(this);
            };
        }
    };

    function getTransform(translation, ratio) {
        const result = [];
        if (translation)
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        if (ratio)
            result.push(`scale(${ratio})`);
        return result.join(' ');
    }
}
