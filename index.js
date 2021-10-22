addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster()
                .addMove(2000, {x: 100, y: 20})
                .addFadeOut(3000)
                .play(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster()
                .addFadeIn(6000 / 3)
                .addDelay(6000 / 3)
                .addFadeOut(6000 / 3)
                .play(block);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndScale(block);
            animaster().resetFadeOut(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let heartBeatings = animaster().heartBeating(block, 1000);
            document
                .getElementById("heartBeatingStop")
                .addEventListener("click", heartBeatings.stop);
        });

    document.getElementById('customAnimation')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);
        });
}

function animaster(){
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

        /**
         * Блок плавно исчезает
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
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
        },

        /**
         * Функция, передвигающая элемент и после прячущая его
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        moveAndHide(element, duration) {
            this.move(element, duration*0.4, {x: 100, y: 20});
            setTimeout(() => this.fadeOut(element, duration*0.6), duration*0.4);
        },

        /**
         * Функция, показывающая элемент и после паузы прячущая его
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        showAndHide(element, duration){
            this.fadeIn(element, duration/3);
            setTimeout(() => this.fadeOut(element, duration/3), duration/3);
        },

        /**
         * Анимация сердцебиений
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        heartBeating(element, duration) {
            let beat = () => {
                this.scale(element, duration / 2, 1.4);
                setTimeout(() => this.scale(element, duration / 2, 1), duration / 2);
            };
            let beating = setInterval(beat, duration);

            return {
                stop() {
                    clearInterval(beating);
                }
            };
        },

        resetFadeIn(element) {
            element.style.transitionDuration =  null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut(element) {
            element.style.transitionDuration =  null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        resetMoveAndScale(element) {
            element.style = null;
        },

        /**
         * Ничего не делай
         * @param duration — Продолжительность в миллисекундах
         */
        wait(duration) {
            setTimeout(duration);
        },

        pushAnimation(animation, duration, ...other) {
            this._steps.push({
                animation,
                duration,
                other
            });
            return this;
        },

        play(element, cycled = false) {
            let sum = 0;
            for (let step of this._steps) {
                setTimeout(
                    () => this[step.animation](element, step.duration, ...step.other),
                    sum
                );
                sum = sum + step.duration;
            }
        },

        addMove(duration, translation) {
            return this.pushAnimation('move', duration, translation);
        },

        addScale(duration, ratio) {
            return this.pushAnimation('scale', duration, ratio);
        },

        addFadeIn(duration) {
            return this.pushAnimation('fadeIn', duration);
        },

        addFadeOut(duration) {
            return this.pushAnimation('fadeOut', duration);
        },

        addDelay(duration) {
            return this.pushAnimation('wait', duration);
        },

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
