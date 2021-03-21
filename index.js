addListeners();

function addListeners() {
    // for (let method in new Animaster()) {
    //     let div = document.createElement('div');
    //     div.classList.add('container');
        
    //     let header = document.createElement('header');
    //     header.classList.add('container-header');

    //     let h3 = document.createElement('h3');
    //     h3.classList.add('animation-name');
    // }

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
    
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block);
        });
}

function animaster() {
    return new Animaster();
}

class Animaster{
    /**
     * Блок плавно перемещается, а затем исчезает.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
     moveAndHide(element, duration){
        let firstDuration = duration * 2 / 5;
        let secondDuration = duration - firstDuration;
        this.move(element, firstDuration, {x: 100, y: 20});
        setTimeout(this.fadeOut, firstDuration, element, secondDuration)
    }

    showAndHide(element, duration) {
        let stepDuration = duration / 3;
        this.fadeIn(element, stepDuration);
        setTimeout(this.fadeOut, stepDuration, element, stepDuration);
    }

    heartBeating(element) {
        let cicle = () => {
            this.scale(element, 500, 1.4);
            setTimeout(() => this.scale.call(this, element, 500, 1), 500);
        }
        setInterval(cicle, 1000);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = this.getTransform(null, ratio);
    }
    
    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = this.getTransform(translation, null);
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
     * Блок плавно исчезает.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        return result.join(' ');
    }
}