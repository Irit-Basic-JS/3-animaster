addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            block.classList.contains('hide') ?
                animaster().addFadeIn(1000).play(block):
                animaster().addFadeOut(1000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster()
                .addMove(500, { x: 100, y: 10 })
                .addMove(500, { x: 0, y: 0})
                .play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster()
                .addScale(500, 1.25)
                .addScale(500, 1)
                .play(block);
        });

    //через BuildHandler
    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();

    document
        .getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
    
    const moveHideBlock = document.getElementById('moveHideBlock');
    const moveHideAnimation = animaster().moveAndHide(moveHideBlock, 1000);
    document.getElementById('moveHidePlay')
        .addEventListener('click', function () {
            moveHideAnimation.play();           
        });
    document.getElementById('moveHideStop')
        .addEventListener('click', function () {
            moveHideAnimation.stop();           
        });


    document.getElementById('showHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showHideBlock');
            animaster()
                .addFadeIn(300)
                .addDelay(300)
                .addFadeOut(300)
                .play(block);
        });
    
    const heartBeatBlock = document.getElementById('heartbeatBlock');
    let heartBeatAnimation;
    document.getElementById('heartbeatPlay')
        .addEventListener('click', function () {
            heartBeatAnimation = animaster()
                .addScale(300, 1.25)
                .addDelay(300)
                .addScale(300, 1)
                .play(heartBeatBlock, true);          
        });
    document.getElementById('heartbeatStop')
        .addEventListener('click', function () {
            if (heartBeatAnimation)
                heartBeatAnimation.stop();           
        });
    
    document.getElementById('shadowPlay')
    .addEventListener('click', function () {
        const block = document.getElementById('shadowText');
        animaster()
            .addShadow(1500)
            .removeShadow(1500)
            .play(block);
    });
}

function animaster() {
    return {

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
        },

        _steps: [],

        /**
         * Функция, добавляющая анимациию (новая реализация)
         */
        addStep(name, duration, translation, scale, execFn) {
            const step = {
                exec: execFn,
                duration: duration,
                translation: translation,
                scale: scale,
                name: name,
            }

            this._steps.push(step);
            return this;
        },

        addMove(duration, translation) {
            return this.addStep('move', duration, translation, null,
            (element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(translation, null);
            });
        },

        addScale(duration, scale) {
            return this.addStep('scale', duration, null, scale,
            (element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(null, scale);
            });
        },

        addFadeIn(duration) {
            return this.addStep('fadeIn', duration, null, null,
            (element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('hide');
                element.classList.add('show');
            });
        },

        addFadeOut(duration) {
            return this.addStep('fadeOut', duration, null, null,
            (element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            });
        },

        addDelay(duration) {
            return this.addStep('wait', duration, null, null, 
            (element) => {
                //...
            });
        },

        addShadow(duration) {
            return this.addStep('shadow', duration, null, null, 
            (element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.add('shadow');
            });
        },
        removeShadow(duration) {
            return this.addStep('shadow', duration, null, null, 
            (element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('shadow');
            });
        },

        play(element, cycled = false, stepIndex = 0) {
            if (stepIndex < this._steps.length) {
                this._steps[stepIndex].exec(element);
                this._playTimeout = setTimeout( () =>
                {
                    this.play(element, cycled, stepIndex+1)
                }, this._steps[stepIndex].duration)
            }

            else if (cycled) {
                this.play(element, cycled, 0)
            }

            return {
                stop: () => {
                    if (this._playTimeout)
                        clearInterval(this._playTimeout);
                },

                reset: () => {
                    stop();
                    _resetMoveScale(element);
                    _resetfadeIn(element);
                }
            }
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

        moveAndHide(element, duration) {
            const timing = duration / 5;
            let timer;
            return {
                play: () => {
                    animaster().move(element, timing*2, { x: 100, y: 20 });
                    timer = setTimeout(()=>animaster().fadeOut(element,timing*3),timing * 2);   
                },

                stop: () => {
                    clearTimeout(timer);
                    _resetMoveScale(element);
                    _resetfadeIn(element);
                }
            }
        },

        showAndHide(element, duration) {
            const timing = duration / 3;
            setTimeout(()=>animaster().fadeIn(element,timing),0);
            setTimeout(()=>animaster().fadeOut(element,timing),timing*2); 
        },

        heartBeating(element, timing = 500, ratio = 1.4) {
            let timer;
            const animation = () => {
                timer = setTimeout(
                    () => {
                        animaster().scale(element, timing, ratio)
                        timer = setTimeout (
                            ()=> {
                                animaster().scale(element, timing, 1)
                                timer = setTimeout(animation, timing*3)
                            }, timing
                        )
                    }, 0
                );
            };

            const stop = () => {
                clearTimeout(timer);
            }

            return {
                play: animation,
                stop: stop,
            }
        },

        buildHandler() {
            const animator = this;
            return function (element) {
                return animator.play(element.target);
            };
        },
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

    function _resetMoveScale(element) {
        element.style.transitionDuration = `${0}ms`;
        element.style.transform = getTransform(null, null);
    }

    function _resetfadeIn(element) {
        _resetfadeOut(element);
    }

    function _resetfadeOut(element) {
        element.style.transitionDuration = `${0}ms`;
        element.classList.remove('hide');
        element.classList.remove('show');
    }

}