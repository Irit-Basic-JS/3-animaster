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

    addDelay(duration) {
        console.log('addDelay');
        this.#steps.push({method: 'delay', duration});
        return this;
    }

    addFadeOut(duration) {
        console.log('addFadeOut');
        this.#steps.push({method: 'fadeOut', duration});
        return this;
    }

    addChangeColor(duration) {
        console.log('addChangeColor');
        this.#steps.push({method: 'changeColor', duration});
        return this;
    }

    buildHandler(cycled) {
        let animaser = this;
        return function() {
            let startName =  this.id.substring(0, this.id.length - 'Play'.length);
            let blockName = startName + "Block";
            let element = document.getElementById(blockName);
            return animaser.play.call(animaser, element, cycled);
         }
    }

    play(element, cycled) {
        let methods = [];

        let start = 0;
        for (let step of this.#steps) {
            let command = this.prepareCommand(step, element, start);
            start += step.duration;
            methods.push({method: step.method, command});
        }

        let perfomMethods = function() {
            let resetMethods = [];
            for (let method of methods) {
                let resetMethod = method.command();
                resetMethods.push(resetMethod);
            }
            resetMethods.reverse();
            return resetMethods;
        };

        if (cycled) {
            let timerId = setInterval(perfomMethods, start);
    
            let stop = function() {
                clearInterval(timerId);
            };
    
            return {
                stop
            }
        }
        else {
            let resetMethods = perfomMethods();

            return {
                resetMethods,
                reset() {
                    console.log('reset');
                    for (let method of this.resetMethods) {
                        if (method) {
                            method();
                        }
                    }
                }
            }
        }
    }
    
    prepareCommand(stepElement, element, start) {
        switch(stepElement.method) {
            case 'move': 
                return () => {
                    let timerId = setTimeout(() => this.move.call(this, element, stepElement.duration, stepElement.translation), start);
                    return () => {
                        console.log('reseting_move');
                        clearTimeout(timerId);
                        this.#resetMoveAndScale.call(this, element);
                    }
                }
            case 'scale':
                return () => {
                    let timerId = setTimeout(() => this.scale.call(this, element, stepElement.duration, stepElement.ratio), start);
                    return () => {
                        console.log('reseting_scale');
                        clearTimeout(timerId);
                        this.#resetMoveAndScale.call(this, element);
                    }
                }
            case 'fadeIn':
                return () => {
                    let timerId = setTimeout(() => this.fadeIn.call(this, element, stepElement.duration), start);
                    return () => { 
                        console.log('reseting_fadeIn');
                        clearTimeout(timerId); 
                        this.#resetFadeIn.call(this, element); 
                    }
                }
            case 'fadeOut':
                return () => {
                    let timerId = setTimeout(() => this.fadeOut.call(this, element, stepElement.duration), start);
                    return () => { 
                        console.log('reseting_fadeOut');
                        clearTimeout(timerId); 
                        this.#resetFadeOut.call(this, element);
                     }
                }
            case 'delay':
                return () => {
                    let timerId = setTimeout(function() { console.log('delay'); }, start);
                    return () => {
                        console.log('reseting_delay');
                        clearTimeout(timerId);
                    }
                }
            case 'changeColor':
                return () => {
                    let timerId = setTimeout(() => this.changeColor.call(this, element, stepElement.duration), start);
                    return () => {
                        console.log('reseting_changeColor');
                        clearTimeout(timerId);
                        this.#resetChangeColor.call(this, element);
                    }
                }
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

        return () => this.#resetMoveAndScale.call(this, element);
    }

    #resetMoveAndScale(element) {
        console.log('resetMoveAndScale');
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

        return () => this.#resetFadeIn.call(this, element);
    }
    
    #resetFadeIn(element) {
        console.log('resetFadeIn');
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

        return () => this.#resetFadeOut.call(this, element);
    }

    #resetFadeOut(element) {
        console.log('resetFadeOut');
        element.style = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    changeColor(element, duration) {
        console.log('changeColor');
        element.style.transitionDuration = `${duration}ms`;
        element.classList.add('red');
    }

    #resetChangeColor(element) {
        element.style = null;
        element.classList.remove('red');
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

addListeners();

let heartBeatingStop, 
    showAndHideReset, 
    moveAndHideReset, 
    fadeInReset,
    fadeOutReset,
    moveReset,
    scaleReset,
    customAnimationReset,
    changeColorReset;

function animaster() {
    return new Animaster();
}

function addListeners() {
    // for (let method in new Animaster()) {
    //     let div = document.createElement('div');
    //     div.classList.add('container');
        
    //     let header = document.createElement('header');
    //     header.classList.add('container-header');

    //     let h3 = document.createElement('h3');
    //     h3.classList.add('animation-name');
    // }

    document.getElementById('changeColorPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('changeColorBlock');
            //animaster().changeColor(block, 1000);
            changeColorReset = animaster().addChangeColor(1000).play(block);
        });
    
    document.getElementById('changeColorReset')
        .addEventListener('click', function () {
            const block = document.getElementById('changeColorBlock');
            changeColorReset.reset();
        });

    //const fadeInPlayHandler = animaster().addFadeIn(5000).buildHandler(false);

    document.getElementById('fadeInPlay')
        //.addEventListener('click', fadeInPlayHandler);
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            //animaster().fadeIn(block, 5000);
            fadeInReset = animaster().addFadeIn(5000).play(block);
        });
    
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            fadeInReset.reset();
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            //animaster().fadeOut(block, 5000);
            fadeOutReset = animaster().addFadeOut(5000).play(block);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            fadeOutReset.reset();
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            moveReset = animaster()
                .addMove(1000, {x: 100, y: 10})
                .play(block);
        });
    
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            moveReset.reset();
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            //animaster().scale(block, 1000, 1.25);
            scaleReset = animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            scaleReset.reset();
        });
    
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            //animaster().moveAndHide(block, 5000);
            moveAndHideReset = animaster()
                .addMove(2000, {x: 100, y: 20})
                .addFadeOut(3000)
                .play(block);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            //animaster().resetMoveAndHide(block);
            if (moveAndHideReset) {
                moveAndHideReset.reset();
                moveAndHideReset = undefined;
            }
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            //animaster().showAndHide(block, 3000);
            showAndHideReset = animaster()
                .addFadeIn(1000)
                .addDelay(1000)
                .addFadeOut(1000)
                .play(block);
        });

    document.getElementById('showAndHideReset')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            showAndHideReset.reset();
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            //heartBeatingStop = animaster().heartBeating(block);
            heartBeatingStop = animaster()
                .addScale(500, 1.4)
                .addScale(500, 1)
                .play(block, true);
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
            customAnimationReset = customAnimation.play(block);
        });

    document.getElementById('customAnimationReset')
        .addEventListener('click', function() {
            const block = document.getElementById('customAnimationBlock');
            customAnimationReset.reset();
        });
}