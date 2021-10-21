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
        .addEventListener('click', () => {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('moveAndHide')
        .addEventListener('click', () => {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000, {x: 100, y: 20});
        });

    document.getElementById('showAndHide')
        .addEventListener('click', () => {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeating')
        .addEventListener('click', () => {
            const block = document.getElementById('heartBeatingBlock');
            let anim = animaster().heartBeating(block);
            
            document.getElementById('heartBeatingStop')
                .addEventListener('click', () => {
                    anim.stop()  
                });          
        });

    document.getElementById('resetMoveAndHide')
        .addEventListener('click', () => {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
    });
}

//#region 
// /**
//  * Блок плавно появляется из прозрачного.
//  * @param element — HTMLElement, который надо анимировать
//  * @param duration — Продолжительность анимации в миллисекундах
//  */
// function fadeIn(element, duration) {
//     element.style.transitionDuration =  `${duration}ms`;
//     element.classList.remove('hide');
//     element.classList.add('show');
// }

// /**
//  * Функция, передвигающая элемент
//  * @param element — HTMLElement, который надо анимировать
//  * @param duration — Продолжительность анимации в миллисекундах
//  * @param translation — объект с полями x и y, обозначающими смещение блока
//  */
// function move(element, duration, translation) {
//     element.style.transitionDuration = `${duration}ms`;
//     element.style.transform = getTransform(translation, null);
// }

// /**
//  * Функция, увеличивающая/уменьшающая элемент
//  * @param element — HTMLElement, который надо анимировать
//  * @param duration — Продолжительность анимации в миллисекундах
//  * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
//  */
// function scale(element, duration, ratio) {
//     element.style.transitionDuration =  `${duration}ms`;
//     element.style.transform = getTransform(null, ratio);
// }
//#endregion

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

function animaster() {
    return {
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            console.log(this)
        },
        resetFadeIn(element) {
            // element.style.show = null
            element.classList.remove('show');
            element.classList.add('hide');
        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeOut(element, duration){
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetFadeOut(element) {
            element.classList.remove('hide');
            element.classList.add('show');
        },
        moveAndHide(element, duration, translation) {
            this.move(element, duration * 2 / 5, translation);
            this.fadeOut(element, duration * 3 / 5);
        },
        showAndHide(element, duration){
            animaster().fadeIn(element, duration / 3);

            setTimeout(() => {
                animaster().fadeOut(element, duration / 3);
            }, duration / 3);
        },
        heartBeating(element) {
            let timer = setInterval(() => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1);
                }, 500);
            }, 1000);
            return {
                stop() {                    
                    clearTimeout(timer);
                }
            }
        },
        resetMoveAndScale(element) {
            this.move(element, 0, {x: 0, y: 0});
            this.scale(element, 0, 1);
        },
        resetMoveAndHide(element) {
            this.resetMoveAndScale(element);
            this.resetFadeOut(element);
        },
        addMove() {
            this._steps++;            
            return this;
        },
        play() {

        },
        _steps: [],
    }
}