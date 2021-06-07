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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000, {x: 100, y: 20} );
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay').addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        const animation = animaster().heartBeating(block, 1000, 1.4);

        document.getElementById('heartBeatingStop').addEventListener('click', function () {
            animation.clear()
        });
    });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);
        });
}

function animaster() {
    this.steps = [];

    return{
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

        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
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

        moveAndHide(element, duration, translation){
            this.move(element, duration * 2 / 5, translation)
            setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5)
        },

        showAndHide(element, duration){
            this.fadeIn(element, duration * 1 / 3)
            setTimeout(() => this.fadeOut(element, duration * 1 / 3), duration * 2 / 3)
        },

        heartBeating(element, duration, ratio){
            const clear = () => {
                this.scale(element, duration / 2, ratio);
                setTimeout(() => this.scale(element, duration / 2, 1), duration / 2);
            }
            const timer = setInterval(clear, duration);

            return { clear : () => { clearInterval(timer) }}
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
        },

        addAnimation(animation, duration, ...other) {
            steps.push({
                animation,
                duration,
                other
            });
            return this;
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
