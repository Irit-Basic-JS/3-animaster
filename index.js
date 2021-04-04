addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
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
    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 2000, {x: 100, y: 20});
        });
    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 2000);
        });

    document.getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block);
        });
}
document.getElementById('showAndHidePlay')
    .addEventListener('click', function () {
        const block = document.getElementById('showAndHideBlock');
        animaster()
            .addFadeIn(5000 / 3)
            .addDelay(5000 / 3)
            .addFadeOut(5000 / 3)
            .play(block);
    });




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
function animaster(){
    this.steps = [];
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
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        //плавно исчезает
         fadeOut(element, duration){
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove("show");
        element.classList.add("hide");
        },

        moveAndHide(element, duration) {
        move(element, 2 * duration / 5, {x: 100, y: 20});
        setTimeout(() => fadeOut(element, 3 * duration / 5), 2 * duration / 5);
        },

        showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
        },

        heartBeating(element, step) {
            this._id = setInterval(function () {
                step.animaster.scale(element, {duration: 500, scale: 1.4});
                setTimeout(function (){
                    step.animaster.scale(element, {duration: 500, scale: 1});
                    element.style.transform = "";
                }, 500);
            }, 1500);
            return {
                stop: this.stopHeartBeating
            };
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

        resetMoveAndHide(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

    }
}
