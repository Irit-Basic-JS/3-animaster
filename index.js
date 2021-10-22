addListeners();
const animator = animaster();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            block.classList.contains('hide') ?
            animator.addFadeIn(2000).play(block):
            animator.addFadeOut(2000).play(block);  
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animator.addMove(500, {x: 20, y:20}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animator.addScale(1000,1.25).play(block);
        });
    document.getElementById('moveHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveHideBlock');
            animator.moveAndHide(block, 1000); 
            document
                .getElementById("moveHideStop")
                .addEventListener("click", function() {
                    animator.resetMoveAndScale(block);
                    animator.resetFadeOut(block);
                });          
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHide');
            animator.showAndHide(block, 1000);           
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeating');
            animator.fadeIn(block, 1000);
            let heartBeatingStop = animator.heartBeating(block, 1000);
            document
                .getElementById("heartBeatingStop")
                .addEventListener("click", heartBeatingStop.stop);
    
        });
}
function animaster(){
    
    this.steps = [];

    return{
    /**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 *      _
 */

         fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element,duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        
        resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        addMove(duration, translation) {
            return this.addAnimation('move', duration, translation);
        },

        addScale(duration, ratio) {
            return this.addAnimation('scale', duration, ratio);
        },

        addFadeIn(duration) {
            return this.addAnimation('fadeIn', duration);
        },

        addFadeOut(duration) {
            return this.addAnimation('fadeOut', duration);
        },

        play(element, cycled = false) {
            let sum = 0;
            for (let step of steps) {
                setTimeout(
                    () => this[step.animation](element, step.duration, ...step.other),
                    sum
                );
                sum += step.duration;
            }
            steps=[];
        },
        addAnimation(animation, duration, ...other) {
            steps.push({
                animation,
                duration,
                other
            });
            return this;
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

        moveAndHide(element,duration){
            const timing = duration / 5;        
            animator.move(element, timing*2, { x: 100, y: 20 });
            setTimeout(()=>animator.fadeOut(element,timing*3),timing * 2); 
        }, 
        showAndHide(element,duration){
            const timing = duration/3;
            animator.fadeIn(element,timing*3);
            setTimeout(timing*3)
            setTimeout(()=>animator.fadeOut(element,timing*3),timing*3)
        },
        heartBeating(element,duration){
            let beat = () => {
                this.scale(element, duration / 2, 1.4);
                setTimeout(() => this.scale(element, duration / 2, 1), duration / 2);
            };
            let beating = setInterval(beat, duration);
            return {
                stop() {
                    clearInterval(beating);
                }
            };

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