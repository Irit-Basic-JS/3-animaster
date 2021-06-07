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
            const block = document.getElementById('MoveAndHide');
            animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });
    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('ShowAndHide');
            animaster().showAndHide(block, 3000);
        });

    let heartBeating;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeating = animaster().heartBeating(block, 500, 1.4);
        });
    
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeating !== undefined) 
                heartBeating.stop();
        });
}

function animaster(){
    return {
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
        moveAndHide(element, duration, translation) {
            const moveDuration = Math.floor((duration * 0.4));
            const hideDuration = duration - moveDuration;
            animaster().move(element, moveDuration, translation);
            return setTimeout(() => animaster().fadeOut(element, hideDuration), moveDuration);
        },
        showAndHide(element, duration, translation) {
            const showDuration = (duration / 3);
            const a = duration - showDuration;
            element.classList.add('hide');
            animaster().fadeIn(element, showDuration, translation);
            setTimeout(null, showDuration);
            return setTimeout(() => animaster().fadeOut(element,showDuration), showDuration);
        },
        heartBeating(element, duration, ratio) {
            heartBeating(element, duration, ratio);
            let interval = setInterval(() => heartBeating(element, duration, ratio), 1000);
            return {
                stop() {
                    clearInterval(interval);
                }
            }
        },
    }
}

function animasterCancel(){
    return{
        resetFadeIn(element){
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetFadeOut(element){
            element.style.transitionDuration =  null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        resetMove(){
            element.style.transitionDuration = null;
            element.style.transform = getTransform(1, null);
        },
        resetScale(){
            element.style.transitionDuration =  null;
            element.style.transform = getTransform(null,  {x: 0, y: 0});
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

function heartBeating(element, duration, ratio) {
    animaster().scale(element, duration, ratio);
    setTimeout(() => animaster().scale(element, duration, 1), duration);
}