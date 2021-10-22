addListeners();

function addListeners()
{
    document
        .getElementById('movePlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('moveBlock');
            animaster().addMove(500, {x: 100, y: 10}).play(block);
        });

    document
        .getElementById('scalePlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(500, 1.25).play(block)
        });

    document
        .getElementById('fadeInPlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('fadeInBlock');
            block.stopper = animaster().addFadeIn(500).play(block);
        });

    document
        .getElementById('fadeInReset')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('fadeInBlock');
            if (block.stopper) block.stopper.reset();
        });

    document
        .getElementById('fadeOutPlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('fadeOutBlock');
            block.stopper = animaster().addFadeOut(500).play(block);
        });

    document
        .getElementById('fadeOutReset')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('fadeOutBlock');
            if (block.stopper) block.stopper.reset();
        });

    document
        .getElementById('moveAndHidePlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('moveAndHideBlock');
            block.stopper = animaster().moveAndHide(block, 1000);
        });

    document
        .getElementById('moveAndHideReset')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('moveAndHideBlock');
            if (block.stopper) block.stopper.reset();
        });

    document
        .getElementById('showAndHidePlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    document
        .getElementById('heartBeatingPlay')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('heartBeatingBlock');
            block.stopper = animaster().heartBeating(block);
        });

    document
        .getElementById('heartBeatingStop')
        .addEventListener('click', function ()
        {
            const block = document.getElementById('heartBeatingBlock');
            if (block.stopper) block.stopper.stop();
        });
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
    let command =
    {
        _steps: [],

        move(element, duration, translation)
        {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale(element, duration, ratio)
        {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        fadeIn(element, duration)
        {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration)
        {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide(element, duration)
        {
            this
                .addMove(duration * 0.4, {x: 100, y: 20})
                .addFadeOut(duration * 0.6);
            return this.play(element);
        },

        showAndHide(element, duration)
        {
            this
                .addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3);
            return this.play(element);
        },

        heartBeating(element)
        {
            this
                .addScale(500, 1.4)
                .addScale(500, 1);
            return this.play(element, true);
        },

        resetFadeIn(element)
        {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut(element)
        {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        resetMove(element)
        {
            this.move(element, 0, {x: 0, y: 0});
        },

        resetScale(element)
        {
            this.scale(element, 0, 1)
        },

        resetMoveAndHide(element)
        {
            this.resetMove(element);
            element.style.transitionDuration = null;
            element.classList
                .remove('hide')
                .add('show');
        },

        addMove(duration, translation)
        {
            let step = {
                name: 'move',
                duration: duration,
                parameter: translation
            };
            this._steps.push(step);
            return this;
        },
        // Добавление шага изменения размера
        addScale(duration, ratio)
        {
            let step = {
                name: 'scale',
                duration: duration,
                parameter: ratio
            };
            this._steps.push(step);
            return this;
        },
        // Добавление шага появления
        addFadeIn(duration)
        {
            let step = {
                name: 'fadeIn',
                duration: duration
            };
            this._steps.push(step);
            return this;
        },
        // Добавление шага исчезновения
        addFadeOut(duration)
        {
            let step = {
                name: 'fadeOut',
                duration: duration
            };
            this._steps.push(step);
            return this;
        },
        // Добавление шага задержки анимации
        addDelay(duration)
        {
            let step = { 
                duration: duration 
            }
            this._steps.push(step);
            return this;
        },
        // Запуск анимации
        play(element, cycled = false)
        {
            let time = 0;
            let showContains = () =>
            {
                if (element.classList.contains('show'))
                    return true;
                else return false;
            };
            this._steps.forEach(element =>
            {
                time += element.duration;
            });
            let start = () => { let t = 0; this._steps.forEach(e =>
            {
                let d = e.duration;
                let p = e.parameter;
                setTimeout(() =>
                {
                    switch (e.name)
                    {
                        case 'move':
                            command.move(element, d, p);
                            break;
                        case 'scale':
                            command.scale(element, d, p);
                            break;
                        case 'fadeIn':
                            command.fadeIn(element, d);
                            break;
                        case 'fadeOut':
                            command.fadeOut(element, d);
                            break;
                        default:
                            break;
                    }
                }, t);
                t += d;
            }); }

            let reset = () => 
            {
                if (showContains()) this.resetFadeIn(element);
                else this.resetFadeOut(element);
                this.resetMove(element);
                this.resetOut(element);
            }
            let stop;
            let animID;
            start();
            if (cycled)
            {
                animID = setInterval(() => start(this._steps), time);
                stop = () => clearInterval(animID);
            }
            return { stop, reset };
        }
    }
    return command;
}