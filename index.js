addListeners();
const animator = animaster();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            block.classList.contains('hide') ?
                animator.fadeIn(block, 5000):
                animator.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animator.move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animator.scale(block, 1000, 1.25);
        });
    
    document.getElementById('moveHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveHideBlock');
            animator.moveAndHide(block, 1000);           
        });
    
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOut');
            animator.fadeOut(block, 1000);           
    });

    document.getElementById('showHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHide');
            animator.showAndHide(block, 1000);           
    });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            block = document.getElementById('heartBeating');
            animator.heartBeating(block, 1000);
            let heartBeatingStop = animator.heartBeating(block, 1000).stop;
            document.getElementById("heartBeatingStop").addEventListener("click", heartBeatingStop)       
    });

    /*document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeating');
            animator.heartBeating(block, 1000).stop;           
    }); */

}

function animaster() {
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

    fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
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

    moveAndHide(element, duration) {
        const timing = duration / 5;        
        animator.move(element, timing*2, { x: 100, y: 20 });
        setTimeout(()=>animator.fadeOut(element,timing*3),timing * 2);   
    },

    showAndHide(element, duration) {
        const timing = duration / 3;
        element.style.transitionDuration = `${timing}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
        setTimeout(() => animator.fadeOut(element, timing), timing);
    },
    
    heartBeating(element, duration) {
        let beat = () => {
            this.scale(element, duration / 2, 1.4);
            setTimeout(() => this.scale(element, duration / 2, 1), duration / 2);
        };
        let beating = setInterval(beat, duration);

        return {
            stop() {
                //clearTimeout(beat)
                clearInterval(beating);
            }
        };
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
}
