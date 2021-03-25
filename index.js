addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            // animaster().fadeIn(block, 5000);
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            // animaster().fadeOut(block, 5000);
            animaster().addFadeOut(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            // animaster().move(block, 1000, {x: 100, y: 10});
            animaster().addMove(1000, {x: 100, y:10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            // animaster().scale(block, 1000, 1.25);
            animaster().addScale(1000, 1.25).play(block);
        });  


    let reset;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            reset = animaster().moveAndHide(block, 5000);
        }); 

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            reset.reset();
        }); 

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });  
        
    let hb;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            hb = animaster().heartBeating(block, 1000, 1.4);
        });  

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            hb.stop();
        });  
}

function animaster() {
    let animaster = {};
    animaster._steps = [];

    animaster.addMove = function(duration, translation) {
        let step = {
            name: 'move',
            duration: duration,
            translation: translation
        };
        this._steps.push(step);
        return this;
    }

    animaster.addScale = function(duration, ratio) {
        let step = {
            name: 'scale',
            duration: duration,
            ratio: ratio
        };
        this._steps.push(step);
        return this;
    }

    animaster.addFadeIn = function(duration) {
        let step = {
            name: 'fadeIn',
            duration: duration
        };
        this._steps.push(step);
        return this;
    }

    animaster.addFadeOut = function(duration) {
        let step = {
            name: 'fadeOut',
            duration: duration
        };
        this._steps.push(step);
        return this;
    }

    animaster.play = function(element) {
        for (const step of this._steps) {
            switch (step.name) {
                case 'move':
                    this.move(element, step.duration, step.translation);
                    break;
                 case 'scale':
                    this.scale(element, step.duration, step.ratio);
                    break;
                case 'fadeIn':
                    this.fadeIn(element, step.duration);
                    break;
                case 'fadeOut':
                    this.fadeOut(element, step.duration);
                    break;
                default:
                    break;
            }
        }
        this._steps = [];
    }
    animaster.fadeIn = function(element, duration) {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    animaster.fadeOut = function(element, duration) {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    animaster.move = function(element, duration, translation) {
        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    animaster.scale = function(element, duration, ratio) {
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    animaster.moveAndHide = function(element, duration){
        element.style.transitionDuration =  `${duration}ms`;
        animaster.addMove(0.4 * duration, {x: 100, y: 20}).play(element);
        setTimeout(() => (animaster.addFadeOut(0.6 * duration), 0.4 * duration).play(element));
        let reset = function() {
            animaster.resetFadeOut(element);
        }
        return {reset};
    }

    animaster.showAndHide = function(element, duration){
        element.style.transitionDuration =  `${duration}ms`;
        animaster.addFadeIn(duration * 1/3).play(element);
        setTimeout(() => (animaster.addFadeOut(1/3 * duration), 2/3 * duration).play(element));
    }

    animaster.heartBeating = function(element, duration, ratio){
        let func = () => {
            animaster.addScale(duration / 2, ratio).play(element);
            setTimeout(() => (animaster.addScale(duration / 2, 1)).play(element), duration / 2);
        }
        let time = setInterval(func, duration);
        let stop = function() {
            clearInterval(time);
        }
        return {stop};
    }

    animaster.resetFadeIn = function(element) {
        element.style = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    animaster.resetFadeOut = function(element) {
        element.style = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    animaster.resetMoveAndScale = function(element) {
        element.style = null;
    }

    return animaster;
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