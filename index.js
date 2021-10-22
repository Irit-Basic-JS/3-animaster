addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 3000, {x: 100, y: 10});
            document.getElementById('moveAndHideStop')
                .addEventListener('click', () => { animaster().resetMoveAndHide(block) });
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHidelock');
            animaster().showAndHide(block, 5000);
        });
        
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let heartBeat = animaster().heartBeating(block, 1000, 1.5);
            document.getElementById('heartBeatingStop')
                .addEventListener('click', () => { heartBeat.stop() });
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
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
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

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
/**
 * Блок плавно исчезает.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;    
            element.classList.add('hide');
            element.classList.remove('show');
        },

/**
 * Блок должен одновременно сдвигаться на 100 пикселей вправо и на 20 вниз, а потом исчезать.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
        moveAndHide(element, duration, translation) {
            this.move(element, duration * 0.4, translation);
            setTimeout(() => this.fadeOut(element, duration * 0.6), duration * 0.4);
        },
/**
 * Блок должен появиться, подождать и исчезнуть.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration * 2 / 3);
        },
/**
 * Блок должен имитировать сердцебиение.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
        heartBeating(element, duration, ratio) {
            let loop = () => {
                this.scale(element, duration / 2, ratio);
                setTimeout(() => this.scale(element, duration / 2, 1), duration / 2);
            }
            let intervalId = setInterval(loop, duration);
            return {
                stop(){
                    clearInterval(intervalId);
                }
            }
        },

        resetFadeIn(element) {
            element.style.transitionDuration =  null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut(element) {
            element.style.transitionDuration =  null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        },

        resetMoveAndHide(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
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

