
function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            block.classList.contains('hide') ?
                animator.fadeIn(block, 5000) :
                animator.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, { x: 100, y: 10 });
            animaster().addMove(1000, { x: 100, y: 10 }).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animator.scale(block, 1000, 1.25);
        });

    document.getElementById('moveHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveHideBlock');
            timer = animaster().moveAndHide(block, 1000);
        });

    document.getElementById('moveHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveHideBlock')
            animaster().resetMoveAndHide(block);
        });

    document.getElementById('showandHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showHideBlock');
            animator.showAndHide(block, 1000);
        });

    document.getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            timer = animaster().heartBeating(block, 500, 1.4);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            timer.stop();
        });
}

function animaster() {
    return new Animaster;
}

class Animaster {
    constructor() {
        this._steps = [];
    }

    // фнкция Стёпы
    //play(element) {
    //    let animationTime = 0;
    //    for (let i of this._steps) {
    //        if (i[0] == 'move') {
    //            setTimeout(() => this.move(element, i[1], i[2]), i[1] + animationTime);
    //        }
    //        else if (i[0] == 'scale') {
    //            setTimeout(() => this.scale(element, i[1], i[2]), i[1] + animationTime);
    //        }
    //        animationTime += i[1];
    //    }
    //}

    // функция Богдана
    play(element, looped = false) {
        const doSteps = (index) => {
            const duration = this._steps[index].duration;
            element.style.transitionDuration = `${duration}ms`;
            this._steps[index].action(element);
            if (looped || index < this._steps.length - 1)
                timer = setTimeout(doSteps, duration, (index + 1) % this._steps.length);
        };
        let timer = setTimeout(doSteps, 0, 0);
        const origClassList = element.classList;
        return {
            stop: () => clearTimeout(timer),
            reset: element => {
                clearTimeout(timer);
                element.style.transitionDuration = null;
                this._steps.reverse().forEach(step => step.undo(element));
                element.classList = origClassList;
            }
        }
    }

    cloneAnimaster() {
        let newAnimaster = animaster();
        newAnimaster._steps = this._steps.slice();
        return newAnimaster;
    }

    addMove(duration, translation) {
        const clone = this.cloneAnimaster();
        clone._steps.push({
            duration,
            action: el => el.style.transform = getTransform(translation, null),
            undo: el => this.#resetMoveAndScale(el)
        });
        return clone;
    }

    addScale(duration, ratio) {
        const clone = this.cloneAnimaster();
        clone._steps.push({
            duration,
            action: el => el.style.transform = getTransform(null, ratio),
            undo: el => this.#resetMoveAndScale(el)
        });
        return clone;
    }

    addFadeIn(duration) {
        const clone = this.cloneAnimaster();
        clone._steps.push({
            duration,
            action: element => {
                element.classList.remove('hide');
                element.classList.add('now');
            },
            undo: element => this.#resetFadeIn(element)
        });
        return clone;
    }

    addFadeOut(duration) {
        const clone = this.cloneAnimaster();
        clone._steps.push({
            duration,
            action: element => {
                element.classList.remove('hide');
                element.classList.add('now');
            },
            undo: element => this.#resetFadeOut(element)
        });
        return clone;
    }

    #resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    #resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    #resetMoveAndScale(element) {
        element.style.transform = getTransform(null, null);
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    /**
     * Блок плавно становится прозрачным.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    move(element, duration, translation) {        
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
        return this.addMove(duration, translation);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    moveAndHide(element, duration) {
        const timing = duration / 5;
        this.addMove(timing * 2, { x: 100, y: 20 }).play(element);
        //setTimeout(() => this.addFadeOut(timing * 3).play(element), timing * 2);
        //this.move(element, timing * 2, { x: 100, y: 20 });
        setTimeout(() => this.fadeOut(element, timing * 3), timing * 2);
    }

    resetMoveAndHide = function resetMoveAndHide(element) {
        this.#resetFadeIn(element);
        this.#resetMoveAndScale(element);
    }

    showAndHide(element, duration) {
        const timing = duration / 3;
        //this.addFadeIn(timing).play(element);
        //console.log('HAPPY!!')
        //setTimeout(() => this.addFadeOut(timing).play(element), timing);
        this.fadeIn(element, timing);
        setTimeout(() => this.fadeOut(element, timing), timing);
    }

    heartBeating(element, duration, ratio) {
        const one = setInterval(() => this.scale(element, duration, ratio), 500);
        const two = setInterval(() => this.scale(element, duration, 1), 1000);
        return {
            stop() {
                clearInterval(one);
                clearInterval(two);
            }
        }
    }
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

addListeners();
const animator = animaster();


