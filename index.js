class Animaster {
    wasBeatingStopped = false;
    _steps = [];

    addMove(duration, translation) {
        this._steps.push(['move', duration, translation]);
        return this;
    }

    addScale(duration, ratio) {
        this._steps.push(['scale', duration, ratio]);
        return this;
    }

    addFadeIn(duration) {
        this._steps.push(['fadeIn', duration]);
        return this;
    }

    addFadeOut(duration) {
        this._steps.push(['fadeOut', duration]);
        return this;
    }

    addDelay(duration) {
        this._steps.push(['delay', duration]);
        return this;
    }

    addHeartBeating(duration, ratio) {
        this._steps.push(['heartBeating', duration, ratio]);
        return this;
    }

    play(element, cycled) {
        for(let step of this._steps)
            switch(step[0]) {

                case 'move':
                    setTimeout(() => {
                        element.style.transitionDuration = `${step[1]}ms`;
                        element.style.transform = this.getTransform(step[2], null);
                    }, 10);
                    break;

                case 'fadeIn':
                    setTimeout(() => {
                        element.style.transitionDuration = `${step[1]}ms`;
                        element.classList.remove('hide');
                    }, 10);
                    break;

                case 'fadeOut':
                    setTimeout(() => {                    
                        element.style.transitionDuration = `${step[1]}ms`;
                        element.classList.remove('show');
                        element.classList.add('hide');
                    }, 10);
                    break;

                case 'scale':
                    setTimeout(() => {
                        element.style.transitionDuration =  `${step[1]}ms`;
                        element.style.transform = this.getTransform(null, step[2]);
                    }, 10);
                    break;

                case 'delay':
                    setTimeout(() => {}, step[1]);
                    break;

                case 'heartBeating':
                    if (cycled) {
                        const beating = setInterval(() => {
                            if (!this.wasBeatingStopped) {
                                this.scale(element, step[1] / 2, step[2]);
                                setTimeout(() => this.scale(element, step[1] / 2, 1), 100);
                            } else clearInterval(beating);
                        }, 500);

                        return {
                            reset: () => {
                                this.wasBeatingStopped = true;
                                this.scale(element, step[1] / 2, 1);
                            }
                        }
                    }
                    break;

                default:
                    console.log('wrong command');
                    break;
            }
        this._steps = [];
    }

    /**
    * Блок плавно появляется из прозрачного.
    * @param element — HTMLElement, который надо анимировать
    * @param duration — Продолжительность анимации в миллисекундах
    */
    fadeIn(element, duration) {
        this.addFadeIn(duration).play(element);
        return () => this.#resetFadeIn.call(this, element);
    }
        
    #resetFadeIn(element) {
        this.#resetMoveAndScale(element);
        element.classList.add('hide');
        element.classList.remove('show');
    }

    fadeOut(element, duration) {
        this.addFadeOut(duration).play(element);
        return () => this.#resetFadeOut.call(this, element);
    }

    #resetFadeOut(element) {
        this.#resetMoveAndScale(element);
        element.classList.add('show');
        element.classList.remove('hide');
    }

    /**
    * Функция, передвигающая элемент
    * @param element — HTMLElement, который надо анимировать
    * @param duration — Продолжительность анимации в миллисекундах
    * @param translation — объект с полями x и y, обозначающими смещение блока
    */
    move(element, duration, translation) {
        this.addMove(duration, translation).play(element);
        return () => this.#resetMoveAndScale.call(this, element);
    }

    /**
    * Функция, увеличивающая/уменьшающая элемент
    * @param element — HTMLElement, который надо анимировать
    * @param duration — Продолжительность анимации в миллисекундах
    * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
    */
    scale(element, duration, ratio) {
        this.addScale(duration, ratio).play(element);
        return () => this.#resetMoveAndScale.call(this, element);
    }

    #resetMoveAndScale(element) {
        element.style = null;
    }

    getTransform(translation, ratio) {
        const result = [];
        if (translation) result.push(`translate(${translation.x}px,${translation.y}px)`);
        if (ratio) result.push(`scale(${ratio})`);
        return result.join(' ');
    }

    moveAndHide(element, translation, duration) {
        this.addMove(duration * 0.4, translation).addFadeOut(duration * 0.6).play(element);
        return () => this.#resetMoveAndHide.call(this, element);
    }

    #resetMoveAndHide(element) {
        this.#resetMoveAndScale(element);
        this.#resetFadeOut(element);
    }

    showAndHide(element, duration) {
        this.addFadeIn(duration / 3).addDelay(duration / 3).addFadeOut(duration / 3).play(element);
        this.fadeIn(element, duration / 3);
        setTimeout(() => this.fadeOut(element, duration / 3), 500);
    }

    heartBeating(element, duration, ratio) {
        return this.addHeartBeating(duration, ratio).play(element, true);
    }
}

const animaster = new Animaster();
addListeners();

function addListeners() {
    let fadeInReseter,
        fadeOutReseter,
        moveAndHideReseter,
        moveReseter,
        scaleReseter,
        heartBeatingReseter;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            fadeInReseter = animaster.fadeIn(block, 5000);
        }); 
    
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            if (fadeInReseter) fadeInReseter();
            fadeInReseter = undefined;
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            fadeOutReseter = animaster.fadeOut(block, 5000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            if (fadeOutReseter) fadeOutReseter();
            fadeOutReseter = undefined;
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            moveReseter = animaster.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            if (moveReseter) moveReseter();
            moveReseter = undefined;
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            scaleReseter = animaster.scale(block, 1000, 1.25);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            if (scaleReseter) scaleReseter();
            scaleReseter = undefined;
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideReseter = animaster.moveAndHide(block, {x: 100, y: 20}, 1000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            if (moveAndHideReseter) moveAndHideReseter();
            moveAndHideReseter = undefined;
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster.showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster.wasBeatingStopped = false;
            heartBeatingStopper = animaster.heartBeating(block, 1000, 1.4);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if (heartBeatingStopper) heartBeatingStopper.reset();
            heartBeatingStopper = undefined;
        });
}
