function animaster() {
    return new Animaster;
}

class Animaster {
    constructor() {
        this._steps = [];
    }

    play(element, cycled = false) {
        const playSteps = (index) => {
            const duration = this._steps[index].duration;
            element.style.transitionDuration = `${duration}ms`;
            this._steps[index].action(element);

            if (cycled || index < this._steps.length - 1)
                timer = setTimeout(playSteps, duration, (index + 1) % this._steps.length);
        };

        let timer = setTimeout(playSteps, 0, 0);
        const originalClassList = element.classList;

        return {
            stop: () => clearTimeout(timer),
            reset: element => {
                clearTimeout(timer);
                element.style.transitionDuration = null;
                this._steps.reverse().forEach(step => step.undo(element));
                element.classList = originalClassList;
            }
        }
    }

    buildHandler() {
        const animaster = this;

        return function () {
            animaster.play(this);
        }
    }

    clone() {
        let clone = animaster();
        clone._steps = this._steps.slice();

        return clone;
    }

    addDelay(duration) {
        const clonedAnim = this.clone();
        clonedAnim._steps.push({
            duration,
            action: () => { },
            undo: () => { }
        });

        return clonedAnim;
    }

    addMove(duration, translation) {
        const clonedAnim = this.clone();
        clonedAnim._steps.push({
            duration,
            action: element => element.style.transform = getTransform(translation, null),
            undo: element => this.#resetMoveAndScale(element)
        });

        return clonedAnim;
    }

    addFadeOut(duration) {
        const clonedAnim = this.clone();
        clonedAnim._steps.push({
            duration,
            action: element => {
                element.classList.remove('show');
                element.classList.add('hide');
            },
            undo: element => this.#resetFadeOut(element)
        });

        return clonedAnim;
    }

    addFadeIn(duration) {
        const clonedAnim = this.clone();
        clonedAnim._steps.push({
            duration,
            action: element => {
                element.classList.remove('hide');
                element.classList.add('show');
            },
            undo: element => this.#resetFadeIn(element)
        });

        return clonedAnim;
    }

    addScale(duration, ratio) {
        const clonedAnim = this.clone();
        clonedAnim._steps.push({
            duration,
            action: element => element.style.transform = getTransform(null, ratio),
            undo: element => this.#resetMoveAndScale(element)
        });

        return clonedAnim;
    }

    addBorderRadiusChange(duration, radiusTopLeft = '0%', radiusTopRight = '0%', radiusBottomRight = '0%', radiusBottomLeft = '0%') {
        const clonedAnim = this.clone();
        clonedAnim._steps.push({
            duration,
            action: element => {
                element.style.transitionDuration = `${this.duration}ms`;
                element.style.borderTopLeftRadius = radiusTopLeft;
                element.style.borderTopRightRadius = radiusTopRight;
                element.style.borderBottomRightRadius = radiusBottomRight;
                element.style.borderBottomLeftRadius = radiusBottomLeft;
            },
            undo: element => this.#resetBorderRadiusChange(element)
        });

        return clonedAnim;
    }

    #resetFadeIn(element) {
        element.classList.remove('show');
        element.classList.add('hide');
    }

    #resetFadeOut(element) {
        element.classList.remove('hide');
        element.classList.add('show');
    }

    #resetMoveAndScale(element) {
        element.style.transform = getTransform(null, null);
    }

    #resetBorderRadiusChange(element) {
        element.style.borderTopLeftRadius = null;
        element.style.borderTopRightRadius = null;
        element.style.borderBottomRightRadius = null;
        element.style.borderBottomLeftRadius = null;
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param duration — Продолжительность анимации в миллисекундах
     */
    fadeIn(duration) {
        return this.addFadeIn(duration);
    }

    /**
     * Функция, передвигающая элемент
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    move(duration, translation) {
        return this.addMove(duration, translation);
    }
    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    scale(duration, ratio) {
        return this.addScale(duration, ratio);
    }

    moveAndHide(duration, translation) {
        let timing = duration / 5;
        return this.addMove(timing * 2, translation)
            .addFadeOut(timing * 3);
    }

    showAndHide(duration) {
        let timing = duration / 3;
        return this.addFadeIn(timing)
            .addDelay(timing)
            .addFadeOut(timing);
    }

    heartBeating(duration) {
        return this.addScale(duration / 2, 1.4)
            .addScale(duration / 2, 1);
    }

    custom(duration, translation) {
        let timing  = duration / 6;
        return this.addBorderRadiusChange(timing, '50%', '50%', '50%', '50%')
            .addMove(timing, translation)
            .addBorderRadiusChange(timing, '100%', '0%', '100%', '0%')
            .addBorderRadiusChange(timing, '0%', '100%', '0%', '100%')
            .addMove(timing, { x: 0, y: 0 })
            .addBorderRadiusChange(timing, '0%', '0%', '0%', '0%');
    }
}

const animations = [{
    name: 'fadeIn',
    duration: 5000
},

{
    name: 'move',
    duration: 1000,
    args: { x: 100, y: 10 }
},

{
    name: 'scale',
    duration: 1000,
    args: 1.25
},

{
    name: 'moveAndHide',
    duration: 1000,
    args: { x: 100, y: 20 }
},

{
    name: 'showAndHide',
    duration: 1000,
},

{
    name: 'heartBeating',
    duration: 1000,
    cycled: true
},

{
    name: 'custom',
    duration: 2000,
    args: { x: 200, y: 0 }
}
];
addListeners();

function addListeners() {
    animations.forEach(animation => addListener(animation.name, animation.duration, animation.cycled, animation.args));
}

function addListener(name, duration = 1000, cycled = false, args = []) {
    document.getElementById(`${name}Play`)
        .addEventListener('click', function () {
            const block = document.getElementById(`${name}Block`);
            const resetter = animaster()[name](duration, args).play(block, cycled);

            if (cycled)
                document
                    .getElementById(`${name}Stop`)
                    .addEventListener('click', () => resetter.stop());

            document
                .getElementById(`${name}Reset`)
                .addEventListener('click', () => resetter.reset(block));
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

function Test_animationUniqueness() {
    const block = document.getElementById('customBlock');
    const a = animaster().addMove(1000, { x: 300, y: 0 })
    const b = a.addFadeOut(400);
    const resetter = a.play(block);
    document.addEventListener('click', () => resetter.reset(block));
}

function Test_animationStacking() {
    const customAnimation = animaster()
        .addMove(200, { x: 40, y: 40 })
        .addScale(800, 1.3)
        .addMove(200, { x: 80, y: 0 })
        .addScale(800, 1)
        .addMove(200, { x: 40, y: -40 })
        .addScale(800, 0.7)
        .addMove(200, { x: 0, y: 0 })
        .addScale(800, 1);
    customAnimation.play(document.getElementById('customBlock'));
}

function Test_BuildHandler() {
    const worryAnimationHandler = animaster()
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .buildHandler();

    document.getElementById('customBlock')
        .addEventListener('click', worryAnimationHandler);
}
