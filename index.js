addListeners();

const worryAnimationHandler = animaster()
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .buildHandler();

function addListeners()
{
    // Плавное появление
    document
        .getElementById('fadeInPlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('fadeInBlock');
            block.stopper = animaster().addFadeIn(5000).play(block);
        });

    // Отмена плавного появления
    document
        .getElementById('fadeInReset')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('fadeInBlock');
            if (block.stopper) block.stopper.reset();
        });

    // Плавное исчезновение
    document
        .getElementById('fadeOutPlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('fadeOutBlock');
            block.stopper = animaster().addFadeOut(5000).play(block);
        });

    // Отмена плавного исчезновения
    document
        .getElementById('fadeOutReset')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('fadeOutBlock');
            if (block.stopper) block.stopper.reset();
        });

    // Передвижение
    document
        .getElementById('movePlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    // Изменение размера
    document
        .getElementById('scalePlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block)
        });

    // Передвижение и исчезновение
    document
        .getElementById('moveAndHidePlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('moveAndHideBlock');
            block.stopper = animaster().moveAndHide(block, 5000);
        });

    // Отмена передвижения и исчезновения
    document
        .getElementById('moveAndHideReset')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('moveAndHideBlock');
            if (block.stopper) block.stopper.reset();
        });

    // Появление и исчезновение
    document
        .getElementById('showAndHidePlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 6000);
        });

    // Имитация сердцебиения
    document
        .getElementById('heartBeatingPlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('heartBeatingBlock');
            block.stopper = animaster().heartBeating(block);
        });

    // Остановка имитации сердцебиения
    document
        .getElementById('heartBeatingStop')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('heartBeatingBlock');
            if (block.stopper) block.stopper.stop();
        });

    document
        .getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
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

function animaster()
{
    let anim =
    {
        // Плавное появление элемента
        fadeIn (element, duration)
        {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        // Плавное исчезновение элемента
        fadeOut (element, duration)
        {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        // Передвижение элемента
        move (element, duration, translation)
        {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        // Изменение размера элемента
        scale (element, duration, ratio)
        {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        // Комбинация передвижения и исчезновения
        moveAndHide (element, duration)
        {
            this
                .addMove(duration * 2 / 5, {x: 100, y: 20})
                .addFadeOut(duration * 3 / 5)
            return this.play(element);
        },
        // Комбинация появления и исчезновения
        showAndHide (element, duration)
        {
            this
                .addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },
        // Имитация сердцебиения
        heartBeating (element)
        {
            this
                .addScale(500, 1.4)
                .addScale(500, 1)
            return this.play(element, true);
        },
        // Отмена действия fadeIn
        resetFadeIn (element)
        {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        // Отмена действия fadeOut
        resetFadeOut (element)
        {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        // Отмена действия move
        resetMove (element)
        {
            this.move(element, 0, {x: 0, y: 0});
        },
        // Отмена действия scale
        resetScale (element)
        {
            this.scale(element, 0, 1)
        },
        // Отмена действия moveAndHide
        resetMoveAndHide (element)
        {
            this.resetMove(element);
            element.style.transitionDuration = null;
            element.classList
                .remove('hide')
                .add('show');
        },
        // Массив шагов простейших анимации
        _steps: new Array(),
        // Добавление шага передвижения
        addMove (duration, translation)
        {
            let step =
            {
                name: 'move',
                duration: duration,
                parametr: translation
            };
            this._steps.push(step);
            return this;
        },
        // Добавление шага изменения размера
        addScale (duration, ratio)
        {
            let step =
            {
                name: 'scale',
                duration: duration,
                parametr: ratio
            };
            this._steps.push(step);
            return this;
        },
        // Добавление шага появления
        addFadeIn (duration)
        {
            let step =
            {
                name: 'fadeIn',
                duration: duration
            };
            this._steps.push(step);
            return this;
        },
        // Добавление шага исчезновения
        addFadeOut (duration)
        {
            let step =
            {
                name: 'fadeOut',
                duration: duration
            };
            this._steps.push(step);
            return this;
        },
        // Добавление шага задержки анимации
        addDelay (duration)
        {
            let step = { duration: duration }
            this._steps.push(step);
            return this;
        },
        // Запуск анимации
        play (element, cycled = false)
        {
            let time = 0; // Продолжительность анимации
            // Исходное состояние элемента (прозрачный / непрозрачный)
            let showContains = () =>
            {
                if (element.classList.contains('show'))
                    return true;
                else return false;
            };
            this._steps.forEach(e =>
            {
                time += e.duration;
            });
            // Запуск анимации
            let start = () => { let t = 0; this._steps.forEach(e =>
            {
                let d = e.duration;
                let p = e.parametr;
                setTimeout(() =>
                {
                    switch (e.name)
                    {
                        case 'move':
                            anim.move(element, d, p);
                            break;
                        case 'scale':
                            anim.scale(element, d, p);
                            break;
                        case 'fadeIn':
                            anim.fadeIn(element, d);
                            break;
                        case 'fadeOut':
                            anim.fadeOut(element, d);
                            break;
                        default:
                            break;
                    }
                }, t);
                t += d;
            }); }
            // Отмена анимации
            let reset = () => 
            {
                if (showContains()) this.resetFadeIn(element);
                else this.resetFadeOut(element);
                this.resetMove(element);
                this.resetOut(element);
            }
            let stop; // Остановка анимации
            let animID; // Повторение анимации
            start();
            if (cycled) // Если анимация должна повторяться
            {
                animID = setInterval(() => start(this._steps), time);
                stop = () => clearInterval(animID);
            }
            return { stop, reset };
        },
        buildHandler ()
        {
            let a = this;
            return function () { return a.play(this); };
        }
    }
    return anim;
}