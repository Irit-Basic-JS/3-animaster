function animaster() {
    return new Animaster;
}

class Animaster {
    constructor () {
        this._steps = [];
    }

    play(element, cycled = false) {
        const playSteps = (index) => {
            const duration = this._steps[index].duration;
            element.style.transitionDuration = `${duration}ms`;
            this._steps[index].action(element);
            if(cycled || index < this._steps.length - 1)
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
        return function() {
            animaster.play(this);
        }
    }

    clone() {
        let animasterClone = animaster();
        animasterClone._steps = this._steps.slice();
        return animasterClone;
    }

    addDelay(duration) {
        const newAnimaster = this.clone();
        newAnimaster._steps.push({
            duration,
            action: () => {},
            undo: () => {}
        });
        return newAnimaster;
    }
    
    addMove(duration, translation) {
        const newAnimaster = this.clone();
        newAnimaster._steps.push({
            duration,
            action: element => element.style.transform = getTransform(translation, null),
            undo: element => this.#resetMoveAndScale(element)
        });    
        return newAnimaster;
    }

    addFadeOut(duration) {
        const newAnimaster = this.clone();
        newAnimaster._steps.push({
            duration,
            action: element => {
                element.classList.remove('show'); 
                element.classList.add('hide');
            },
            undo: element => this.#resetFadeOut(element)
        });
        return newAnimaster;
    }

    addFadeIn(duration) {
        const newAnimaster = this.clone();
        newAnimaster._steps.push({
            duration,
            action: element => {
                element.classList.remove('hide'); 
                element.classList.add('show');
            },
            undo: element => this.#resetFadeIn(element)
        }); 
        return newAnimaster;
    }

    addScale(duration, ratio) {
        const newAnimaster = this.clone();
        newAnimaster._steps.push({
            duration,
            action: element => element.style.transform = getTransform(null, ratio),
            undo: element => this.#resetMoveAndScale(element)
        });
        return newAnimaster;
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
        return this.addMove(duration * 2 / 5, translation)
            .addFadeOut(duration * 3 / 5);
    }

    showAndHide(duration) {
        return this.addFadeIn(duration / 3)
            .addDelay(duration / 3)
            .addFadeOut(duration / 3);
    }

    heartBeating(duration) {
        return this.addScale(duration / 2, 1.4)
                .addDelay(duration / 6)
                .addScale(duration / 2, 1)
                .addDelay(duration / 6);
    }

    custom(duration) {
        const newAnimaster = this.clone();
        newAnimaster._steps.push({
            duration: duration / 4,
            action: function() {
                let blocks = document.getElementsByClassName('block');
                for (let block of blocks) {
                    block.style.transitionDuration = `${this.duration}ms`;
                    block.style.width = '300px';
                    block.style.height = '300px';
                }
            },
            undo: function() {
                let blocks = document.getElementsByClassName('block');
                for (let block of blocks) {
                    block.style.transitionDuration = null;
                    block.style.width = null;   
                    block.style.height = null;     
                }
            }
        });
        return newAnimaster;
    }
}

const animations = [{
    name: 'fadeIn',
    duration: 5000
}, {
    name: 'move',
    duration: 1000,
    args: {x: 100, y: 10}
}, {
    name: 'scale',
    duration: 1000,
    args: 1.25
}, {
    name: 'moveAndHide',
    duration: 1000,
    args: {x: 100, y: -20}
}, {
    name: 'showAndHide',
    duration: 1000,
}, {
    name: 'heartBeating',
    duration: 1000,
    cycled: true
}, {
    name: 'custom',
    duration: 3000
}];
addListeners();

function addListeners() {
    animations.forEach(anim => addListener(anim.name, anim.duration, anim.cycled, anim.args));

    const builtCustomAnim = animaster().addMove(1000, {x: 0,y: -100}).addMove(1000, {x: 0, y: 100}).buildHandler();
    document.getElementById('customBlock').addEventListener('click', builtCustomAnim);
}

function addListener(name, duration = 1000, cycled = false, args = []) {
    document.getElementById(`${name}Play`)
        .addEventListener('click', function () {
        const block = document.getElementById(`${name}Block`);
        const resetter = animaster()[name](duration, args).play(block, cycled);

        if (cycled)
            document.getElementById(`${name}Stop`)
                .addEventListener('click', () => resetter.stop());

        document.getElementById(`${name}Reset`)
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
    const a = animaster().addMove(1000, {x:-100,y:-100});
    const b = a.addScale(500, 2);
    const resetter = a.play(block);
    setTimeout(() => resetter.reset(block), 2000);
}

function Test_animationStacking() {
    const customAnimation = animaster()
        .addMove(200, {x: 40, y: 40})
        .addScale(800, 1.3)
        .addMove(200, {x: 80, y: 0})
        .addScale(800, 1)
        .addMove(200, {x: 40, y: -40})
        .addScale(800, 0.7)
        .addMove(200, {x: 0, y: 0})
        .addScale(800, 1);
    customAnimation.play(document.getElementById('customBlock'));
}