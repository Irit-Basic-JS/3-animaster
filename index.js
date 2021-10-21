let timer;
let y;
let z;


addListeners();

function animaster(){
    return new AnimasterClass;
}

class AnimasterClass{
    constructor(){
        this._steps = []
    };
    fadeIn=function (element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    };

    fadeOut=function (element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    };

    move=function (element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    };

    scale=function(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    };

    moveAndHide=function(element, duration, translation) {
        element.style.transitionDuration = `${duration*2/5}ms`;
        element.style.transform = getTransform(translation, null);        
        element.classList.remove('show');
        setTimeout(()=>element.classList.add('hide'), duration*3/5);
    };

    showAndHide=function (element, duration) {
        element.style.transitionDuration =  `${duration/3}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
        setTimeout(()=>element.classList.remove('show'), duration/3);        
        setTimeout(()=>element.classList.add('hide'), duration/3); 
    };

    heartBeating=function(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        if (!isNaN(y)){
            clearInterval(y);
            clearInterval(z);
        }
        y = setInterval(()=>element.style.transform = getTransform(null, ratio), duration/2);
        z = setInterval(()=>element.style.transform = getTransform(null, 1), duration);
        return {stop:() =>{
                    clearInterval(y);
                    clearInterval(z);}
        }
    };
    
    #resetFadeIn=function(element){
        element.style.opacity = null;
        element.classList.remove('show');
        element.classList.add('hide');
    };

    #resetFadeOut=function(element){
        element.style.opacity = null;
        element.classList.remove('hide');
        element.classList.add('show');
    };

    #resetMoveAndScale=function(element){
        element.style.transitionDuration =  `${0}ms`;
        element.style.transform = null;
    };
    addMove=function(duration, translation){
        this._steps.push({
            duration,
            translation,            
            name: 'move'
        });
        return this;
    };
    addScale=function(duration, ratio){
        this._steps.push({            
            duration,
            ratio,       
            name: 'scale'
        });
        return this;
    };
    addFadeIn=function(duration){
        this._steps.push({
            duration,                        
            name: 'fadeIn'
        });
        return this;
    };
    addFadeOut=function(duration){
        this._steps.push({
            duration,                     
            name: 'fadeOut'
        });
        return this;
    };
    play=function(element){
        let time = 0;
        for(let i of this._steps){
            switch(i.name){
                case 'move':
                    console.log('move');                    
                    setTimeOut(()=>this.move(element, i.duration, i.translation),++time);
                    break;
                case 'scale':
                    console.log('scale');                    
                    this.scale(element, i.duration, i.ratio);
                    break; 
                case 'fadeIn':
                    console.log('fadeIn');                    
                    this.fadeIn(element, i.duration);
                    break; 
                case 'fadeOut':
                    console.log('fadeOut');                    
                    this.fadeOut(element, i.duration);
                    break;
            }
        }
    };
}
// const customAnimation = animaster()
//     .addMove(200, {x: 40, y: 40})
//     .addScale(800, 1.3)
//     .addMove(200, {x: 80, y: 0})
//     .addScale(800, 1)
//     .addMove(200, {x: 40, y: -40})
//     .addScale(800, 0.7)
//     .addMove(200, {x: 0, y: 0})
//     .addScale(800, 1);

function addListeners() {

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            //animaster().fadeIn(block, 5000);
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            //animaster().fadeOut(block, 5000);
            animaster().addFadeOut(5000).play(block);
            //customAnimation.play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            //animaster().move(block, 1000, {x: 100, y: 10});
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            //animaster().scale(block, 1000, 1.25);
            animaster().addScale(1000, 1.25).play(block);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');          
            animaster().resetMoveAndScale(block);
            animaster().resetFadeOut(block);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            timer = animaster().heartBeating(block, 500, 1.4);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {            
            timer.stop();
        });
}



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
