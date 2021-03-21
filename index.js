addListeners();

let heartBeatingStop;

function addListeners() {
    // for (let method in new Animaster()) {
    //     let div = document.createElement('div');
    //     div.classList.add('container');
        
    //     let header = document.createElement('header');
    //     header.classList.add('container-header');

    //     let h3 = document.createElement('h3');
    //     h3.classList.add('animation-name');
    // }

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            //animaster().fadeIn(block, 5000);
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            //animaster().fadeOut(block, 5000);
            animaster().addFadeOut(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster()
                .addMove(1000, {x: 100, y: 10})
                .play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            //animaster().scale(block, 1000, 1.25);
            animaster().addScale(1000, 1.25).play(block);
        });
    
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            //animaster().moveAndHide(block, 5000);
            animaster()
                .addMove(2000, {x: 100, y: 20})
                .addFadeOut(3000)
                .play(block);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            //animaster().showAndHide(block, 3000);
            animaster()
                .addFadeIn(1000)
                //.addMove(1000, {x: 0, y: 0})
                .addFadeOut(1000)
                .play(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingStop = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function() {
            heartBeatingStop.stop();
        });

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function() {
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);

            const block = document.getElementById('customAnimationBlock');
            customAnimation.play(block);
        });
}

function animaster() {
    return new Animaster();
}

class Animaster{
    static stopFadeOutTimerId = 0;

    #steps = [];

    addMove(duration, translation) {
        console.log('addMove');
        this.#steps.push({method:'move', duration, translation});
        return this;
    }

    addScale(duration, ratio) {
        console.log('addScale');
        this.#steps.push({method:'scale', duration, ratio});
        return this;
    }

    addFadeIn(duration) {
        console.log('addFadeIn');
        this.#steps.push({method: 'fadeIn', duration});
        return this;
    }

    addFadeOut(duration) {
        console.log('addFadeOut');
        this.#steps.push({method: 'fadeOut', duration});
        return this;
    }

    play(element) {
        let start = 0;
        for (let step of this.#steps) {
            this.performCommand(step, element, start);
            start += step.duration;
        }
    }
    
    performCommand(stepElement, element, start) {
        switch(stepElement.method) {
            case 'move': 
                setTimeout(() => this.move.call(this, element, stepElement.duration, stepElement.translation), start);
                break;
            case 'scale':
                setTimeout(() => this.scale.call(this, element, stepElement.duration, stepElement.ratio), start);
                break;
            case 'fadeIn':
                setTimeout(() => this.fadeIn.call(this, element, stepElement.duration), start);
                break;
            case 'fadeOut':
                setTimeout(() => this.fadeOut.call(this, element, stepElement.duration), start);
                break;
        }
    }

    /**
     * Блок плавно перемещается, а затем исчезает.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
     moveAndHide(element, duration){
        let firstDuration = duration * 2 / 5;
        let secondDuration = duration - firstDuration;
        this.move(element, firstDuration, {x: 100, y: 20});
        Animaster.stopFadeOutTimerId = setTimeout(this.fadeOut, firstDuration, element, secondDuration)
    }

    resetMoveAndHide(element) {
        if (!Animaster.stopFadeOutTimerId)
        {
            clearTimeout(Animaster.stopFadeOutTimerId);
            this.#resetMoveAndScale(element);
            this.#resetFadeOut(element);
            Animaster.stopFadeOutTimerId = 0;
        }
    }

    showAndHide(element, duration) {
        let stepDuration = duration / 3;
        this.fadeIn(element, stepDuration);
        setTimeout(this.fadeOut, stepDuration, element, stepDuration);
    }

    heartBeating(element) {
        let cicle = () => {
            this.scale(element, 500, 1.4);
            setTimeout(() => this.scale.call(this, element, 500, 1), 500);
        }
        let timerId = setInterval(cicle, 1000);
        let stop = function() {
            clearInterval(timerId);
        };

        return {
            stop
        }
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    scale(element, duration, ratio) {
        console.log('scale');
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = this.getTransform(null, ratio);
    }
    
    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    move(element, duration, translation) {
        console.log('move');
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = this.getTransform(translation, null);
    }

    #resetMoveAndScale(element) {
        element.style = null;
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    fadeIn(element, duration) {
        console.log('fadeIn');
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    
    #resetFadeIn(element) {
        element.style = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    /**
     * Блок плавно исчезает.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    fadeOut(element, duration) {
        console.log('fadeOut');
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    #resetFadeOut(element) {
        element.style = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        return result.join(' ');
    }
}