class Animaster {
    #steps = [];
    #timers = []

    #getClone() {
        let clone = new Animaster();
        clone.#steps = [...this.#steps];
        clone.#timers = [...this.#timers];
        return clone;
    }

    static getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        return result.join(" ");
    }

    addMove(duration, translation) {
        return this.#getClone()._addAnimation("move", duration, translation);
    }

    addScale(duration, ratio) {
        return this.#getClone()._addAnimation("scale", duration, ratio);
    }

    addFadeIn(duration) {
        return this.#getClone()._addAnimation("fadeIn", duration);
    }

    addDelay(duration) {
        return this.#getClone()._addAnimation("delay", duration);
    }

    addFadeOut(duration) {
        return this.#getClone()._addAnimation("fadeOut", duration);
    }

    _addAnimation(animation, duration, ...another) {
        this.#steps.push({
            animation,
            duration,
            another,
        });
        return this;
    }

    #animate(element) {
        let sum = 0;
        for (let step of this.#steps) {
            this.#timers.push(
                setTimeout(
                    () => {
                        if (step.animation !== "delay")
                            this[step.animation](element, step.duration, ...step.another)
                    },
                    sum
                ));
            sum += step.duration;
        }
    }

    play(element, cycled) {
        this.#animate(element);

        let intervalId;
        let durationAnimation = this.#steps.reduce((sumDuration, step) => sumDuration + step.duration, 0);
        if (cycled) {
            intervalId = setInterval(
                () => this.#animate(element),
                durationAnimation
            );
        }
        let $this = this;
        return {
            stop() {
                $this.#timers.forEach(timerId => clearTimeout(timerId));
                clearInterval(intervalId);
                this.reset();
            },
            reset() {
                $this.#steps.forEach(el => {
                    switch (el.animation) {
                        case 'move':
                        case 'scale':
                            $this.#resetMoveAndScale(element);
                            break;
                        case 'fadeIn':
                            $this.#resetFadeIn(element);
                            break;
                        case 'fadeOut':
                            $this.#resetFadeOut(element);
                            break;
                    }
                })
            }
        }
    }

    buildHandler(cycled) {
        let $this = this;
        return function () {
            $this.play(this, cycled);
        };
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove("hide");
        element.classList.add("show");
    }

    /**
     * Блок плавно скрывается .
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove("show");
        element.classList.add("hide");
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = Animaster.getTransform(translation, null);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = Animaster.getTransform(null, ratio);
    }

    /**
     * Функция, передвигающая элемент и скрывающая
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    moveAndHide(element, duration, translation) {
        return this.addMove((duration * 2) / 5, translation)
            .addFadeOut((duration * 3) / 5)
            .play(element);
    }

    /**
     * Блок плавно появляется и скрывается.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    showAndHide(element, duration) {
        return this.addFadeIn(duration / 3)
            .addDelay(duration / 3)
            .addFadeOut(duration / 3)
            .play(element);
    }

    /**
     * Анимация сердцебиения.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    heartBeating(element, duration) {
        return this.addScale(duration / 2, 1.4)
            .addScale(duration / 2, 1)
            .play(element, true);
    }

    #resetFadeIn(element) {
        element.classList.remove("show");
        element.classList.add("hide");
        this.#resetMoveAndScale(element);
    }

    #resetFadeOut(element) {
        element.classList.remove("hide");
        element.classList.add("show");
        this.#resetMoveAndScale(element);
    }

    #resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
        element.style.scale = null;
    }
}

function animaster() {
    return new Animaster();
}

function addListeners() {
    document.getElementById("fadeInPlay").addEventListener("click", (e) => {
        const block = document.getElementById("fadeInBlock");
        animaster().addFadeIn(5000).play(block);
    });

    document.getElementById("scalePlay").addEventListener("click", (e) => {
        const block = document.getElementById("scaleBlock");
        animaster()
            .addScale(1000, 1.25)
            .play(block);
    });

    document.getElementById("movePlay").addEventListener("click", (e) => {
        const block = document.getElementById("moveBlock");
        animaster()
            .addMove(1000, {x: 100, y: 10})
            .play(block);
    });

    document.getElementById("fadeOutPlay").addEventListener("click", (e) => {
        const block = document.getElementById("fadeOutBlock");
        animaster()
            .addFadeOut(1000)
            .play(block);
    });

    document
        .getElementById("moveAndHidePlay")
        .addEventListener("click", (e) => {
            const block = document.getElementById("moveAndHideBlock");
            animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });

    document
        .getElementById("moveAndHideReset")
        .addEventListener("click", (e) => {
            const block = document.getElementById("moveAndHideBlock");
            block?.stopperAnimation?.stop();
        });

    document
        .getElementById("showAndHidePlay")
        .addEventListener("click", (e) => {
            const block = document.getElementById("showAndHideBlock");

            animaster().showAndHide(block, 1000);
        });

    document
        .getElementById("heartBeatingPlay")
        .addEventListener("click", (e) => {
            const block = document.getElementById("heartBeatingBlock");
            block.stopperAnimation = animaster().heartBeating(block, 1000);
        });

    document
        .getElementById("heartBeatingStop")
        .addEventListener("click", (e) => {
            const block = document.getElementById("heartBeatingBlock");
            block?.stopperAnimation.stop();
        });

    document
        .getElementById("customAnimationPlay")
        .addEventListener("click", (e) => {
            const block = document.getElementById("customAnimationBlock");
            animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1)
                .play(block);
        });
    // const worryAnimationHandler = animaster()
    //     .addMove(200, {x: 80, y: 0})
    //     .addMove(200, {x: 0, y: 0})
    //     .addMove(200, {x: 80, y: 0})
    //     .addMove(200, {x: 0, y: 0})
    //     .buildHandler();
    //
    // document
    //     .getElementById('worryAnimationBlock')
    //     .addEventListener('click', worryAnimationHandler);

    document
        .getElementById("newAnimationPlay")
        .addEventListener("click", (e) => {
            const block = document.getElementById("newAnimationBlock");
            animaster()
                .addScale(800, 1)
                .addFadeOut(500)
                .addFadeIn(400)
                .addMove(200, {x: 40, y: 40})
                .addMove(200, {x: 40, y: -40})
                .addFadeOut(600)
                .addFadeIn(200)
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1)
                .play(block);
        });
}

addListeners();
