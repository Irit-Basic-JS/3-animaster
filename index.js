const MOVE = "move"
const SCALE = "scale"
const FADE_IN = "fadeIn"
const FADE_OUT = "fadeOut"
const DELAY = "delay"

addListeners()

function resetMoveAndScale(element) {
    element.style.transitionDuration = null
    element.style.transform = null
}

function resetFadeIn(element) {
    element.style.transitionDuration = null
    element.classList.remove("show")
    element.classList.add("hide")
}

function resetFadeOut(element) {
    element.style.transitionDuration = null
    element.classList.remove("hide")
    element.classList.add("show")
}

function resetSteps(element, steps) {
    for (const step of steps) {
        switch (step.animation) {
            case MOVE:
            case SCALE:
                resetMoveAndScale(element)
                break
            case FADE_IN:
                resetFadeIn(element)
            case FADE_OUT:
                resetFadeOut(element)
        }
    }
}

function addListeners() {
    const { 
        fadeIn, 
        fadeOut, 
        move, 
        scale, 
        moveAndHide, 
        showAndHide, 
        heartBeating 
    } = animaster()

    document.getElementById("fadeInPlay").addEventListener("click", function () {
        const block = document.getElementById("fadeInBlock")
        fadeIn(block, 5000)
    })
    document.getElementById("resetFadeIn").addEventListener("click", function () {
        const block = document.getElementById("fadeInBlock")
        resetFadeIn(block)
    })

    document.getElementById("fadeOutPlay").addEventListener("click", function () {
        const block = document.getElementById("fadeOutBlock")
        fadeOut(block, 5000)
    })

    document.getElementById("resetFadeOut").addEventListener("click", function () {
        const block = document.getElementById("fadeOutBlock")
        resetFadeOut(block)
    })

    document.getElementById("movePlay").addEventListener("click", function () {
        const block = document.getElementById("moveBlock")
        move(block, 1000, { x: 100, y: 10 })
    })

    document.getElementById("scalePlay").addEventListener("click", function () {
        const block = document.getElementById("scaleBlock")
        scale(block, 1000, 1.25)
    })

    document.getElementById("moveAndHidePlay").addEventListener("click", function () {
        const block = document.getElementById("moveAndHideBlock")
        moveAndHide(block, 3000)
    })

    document.getElementById("moveAndHideReset").addEventListener("click", function () {
        const block = document.getElementById("moveAndHideBlock")
        resetMoveAndScale(block)
        resetFadeOut(block)
    })

    document.getElementById("showAndHidePlay").addEventListener("click", function () {
        const block = document.getElementById("showAndHideBlock")
        showAndHide(block, 3000)
    })

    document.getElementById("heartBeatingPlay").addEventListener("click", function () {
        const block = document.getElementById("heartBeatingBlock")
        block.stopper = heartBeating(block)
    })

    document.getElementById("heartBeatingStop").addEventListener("click", function () {
        const block = document.getElementById("heartBeatingBlock")

        if (block.stopper) block.stopper.stop()
    })
}

function animaster(){
    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`
        element.style.transform = getTransform(null, ratio)
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`
        element.classList.remove("hide")
        element.classList.add("show")
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`
        element.classList.remove("show")
        element.classList.add("hide")
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`
        element.style.transform = getTransform(translation, null)
    }

    function backgroundColor(element, duration, color) {
        element.style.transitionDuration = `${duration}ms`
        element.style.background = color
    }

    function moveAndHide(element, duration) {
        move(element, duration * 0.4, { x: 100, y: 20 })

        setTimeout(() => fadeOut(element, duration * 0.6), duration * 0.4)
    }

    function showAndHide(element, duration) {
        const interval = duration * (1 / 3)

        fadeIn(element, interval)
        setTimeout(() => {}, interval)
        setTimeout(() => fadeOut(element, interval), interval * 2)
    }

    function heartBeating(element) {
        const interval = 500

        const intervalId = setInterval(() => {
            scale(element, interval, 1.4)
            setTimeout(() => scale(element, interval, 1), interval)
        }, interval * 2)

        return {
            stop: () => clearInterval(intervalId),
        }
    }

    function getTransform(translation, ratio) {
        const result = []
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`)
        }
        if (ratio) {
            result.push(`scale(${ratio})`)
        }
        return result.join(" ")
    }

    function addMove(duration, translation) {
        const cloneState = clone(this)

        cloneState._steps.push({
            animation: MOVE,
            duration,
            params: translation,
        })

        return cloneState
    }

    function addScale(duration, ratio) {
        const cloneState = clone(this)

        cloneState._steps.push({
            animation: SCALE,
            duration,
            params: ratio,
        })

        return cloneState
    }

    function addFadeIn(duration) {
        const cloneState = clone(this)

        cloneState._steps.push({
            animation: FADE_IN,
            duration,
        })

        return cloneState
    }

    function addFadeOut(duration) {
        const cloneState = clone(this)

        cloneState._steps.push({
            animation: FADE_OUT,
            duration,
        })

        return cloneState
    }

    function addDelay(duration) {
        const cloneState = clone(this)

        cloneState._steps.push({
            animation: DELAY,
            duration,
        })

        return cloneState
    }

    function addBackgroundColor(duration, color) {
        const cloneState = clone(this)

        cloneState._steps.push({
            animation: BACKGROUND_COLOR,
            duration,
            params: color,
        })

        return cloneState
    }

    function addMoveAndHide(duration) {
        const cloneState = clone(this)

        cloneState.addMove(duration * 0.4, { x: 100, y: 20 }).addFadeOut(duration * 0.6)

        return cloneState
    }

    function addShowAndHide(duration) {
        const cloneState = clone(this)
        const interval = duration * (1 / 3)

        cloneState.addFadeIn(interval).addDelay(interval).addFadeOut(interval)

        return cloneState
    }

    function addHeartBeating(duration) {
        const cloneState = clone(this)
        const interval = duration / 2

        this.addScale(interval, 1.4).addScale(interval, 1)

        return cloneState
    }

    function buildHandler() {
        return (e) => this.play(e.target)
    }

    function play(element, cycled = false) {
        let durationTimeout = 0

        for (const animationStep of this._steps) {
            switch (animationStep.animation) {
                case MOVE:
                    setTimeout(() => move(element, animationStep.duration, animationStep.params), durationTimeout)
                    break

                case SCALE:
                    setTimeout(() => scale(element, animationStep.duration, animationStep.params), durationTimeout)
                    break

                case FADE_IN:
                    setTimeout(() => fadeIn(element, animationStep.duration), durationTimeout)
                    break

                case FADE_OUT:
                    setTimeout(() => fadeOut(element, animationStep.duration), durationTimeout)
                    break

                case BACKGROUND_COLOR:
                    setTimeout(
                        () => backgroundColor(element, animationStep.duration, animationStep.params),
                        durationTimeout
                    )

                case DELAY:
                    setTimeout(() => {}, durationTimeout)
                    break
            }

            durationTimeout += animationStep.duration
        }

        let stop = () => {}
        if (cycled) {
            const intervalId = setInterval(() => play.call(this, element), durationTimeout)
            stop = () => clearInterval(intervalId)
        }

        return {
            stop,
            reset: () => resetSteps(element, this._steps),
        }
    }

    function clone(object) {
        return { ...object, _steps: [...object._steps] }
    }

    return {
        _steps: [],
        fadeIn,
        fadeOut,
        scale,
        move,
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        addMoveAndHide,
        addShowAndHide,
        addDelay,
        addHeartBeating,
        addBackgroundColor,
        play,
        buildHandler
    }
}