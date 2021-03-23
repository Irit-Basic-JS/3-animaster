class Animaster {
	constructor() {
		this._steps = [];
	}
	
	scale(element, step) {
		element.style.transitionDuration = `${step.duration}ms`;
		element.style.transform = `${getTransform(null, step.scale)} ${element.style.transform}`;
	}
	
	move(element, step) {
		element.style.transitionDuration = `${step.duration}ms`;
		element.style.transform = `${getTransform(step.translation, null)} ${element.style.transform}`;
	}
	
	fadeIn(element, step) {
		element.style.transitionDuration = `${step.duration}ms`;
		element.classList.remove("hide");
		element.classList.add("show");
	}
	
	fadeOut(element, step) {
		element.style.transitionDuration = `${step.duration}ms`;
		element.classList.remove("show");
		element.classList.add("hide");
	}
	
	moveAndHide(element, step) {
		this.move(element, {duration: 2 * step.duration / 5, translation: {x: 100, y: 20}});
		setTimeout(() =>
			this.fadeOut(element, {duration: 3 * step.duration / 5}), 2 * step.duration / 5);
	}
	
	showAndHide(element, step) {
		this.fadeIn(element, {duration: step.duration / 3});
		setTimeout(() => this.fadeOut(element, {duration: step.duration / 3}), step.duration / 3);
	}
	
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
	}
	
	stopHeartBeating(){
		clearInterval(this._id);
	}
	
	addMove(duration, translation) {
		this._steps.push({
			animation: this.move,
			duration: duration,
			translation: translation,
		});
		return this;
	}
	
	addScale(duration, scale) {
		this._steps.push({
			animation: this.scale,
			duration: duration,
			scale: scale,
		});
		return this;
	}
	
	addMoveAndHide(duration, translation) {
		this._steps.push({
			duration: duration,
			translation: translation,
			animation: this.moveAndHide,
		});
		return this;
	}
	
	addShowAndHide(duration){
		this._steps.push({
			animation: this.showAndHide,
			duration: duration
		});
		return this;
	}
	addHeartBeating(){
		this._steps.push({
			animation:this.heartBeating,
			animaster: this
		});
		return this;
	}
	
	addFadeOut(duration) {
		this._steps.push({
			animation: this.fadeOut,
			duration: duration,
		});
		return this;
	}
	
	addFadeIn(duration) {
		this._steps.push({
			animation: this.fadeIn,
			duration: duration,
		});
		return this;
	}
	
	play(element, cycled = false) {
		const reset = function reset(){
			element.style.opacity = opacity;
			element.classList.remove("hide")
			element.classList.remove("show");
			element.style.transform = null;
			element.style.scale = null;
		}
		const opacity = element.style.opacity;
		if (cycled){
			let delay = 0;
			for (const step of this._steps) {
				delay += step.duration;
			}
			const id = setInterval(() => {
				this.playOnce(element);
				reset();
			}, delay);
		}
		else{
			this.playOnce(element);
		}
		return {
			stop: this.stopHeartBeating
		}
	}
	
	playOnce(element){
		let delay = 0;
		for (const step of this._steps) {
			setTimeout(() => step.animation.call(this, element, step), delay);
			delay += step.duration;
		}
		return delay;
	}
	resetMoveOrScale(element){
		element.style.transform = "";
		element.transitionDuration = "";
	}
	resetFadeIn(element) {
		element.style = null;
		element.classList.remove("show");
		element.classList.add("hide");
	}
	
	
	resetFadeOut(element) {
		element.style = null;
		element.classList.remove("hide");
		element.classList.add("show");
	}
	
	resetMoveAndHide(element) {
		this.resetMoveOrScale(element);
		this.resetFadeOut(element);
	};
	
	buildHandler(animaster){
		return animaster.play(this);
	}
}

const anim = new Animaster();
anim.addMove(200, {x: 40, y: 40})
.addScale(800, 1.3)
.addMove(200, {x: 80, y: 0})
.addScale(800, 1)
.addMove(200, {x: 40, y: -40})
.addHeartBeating();
const block = document.getElementById("testBlock")
.addEventListener("click", anim.buildHandler(anim));

addListeners();

function addListeners() {
	document.getElementById("fadeInPlay")
	.addEventListener("click", function () {
		const block = document.getElementById("fadeInBlock");
		anim.fadeIn(block, {duration: 1000});
	});
	
	document.getElementById("movePlay")
	.addEventListener("click", function () {
		const block = document.getElementById("moveBlock");
		anim.move(block, {duration: 1000, translation: {x: 100, y: 10}});
	});
	
	document.getElementById("scalePlay")
	.addEventListener("click", function () {
		const block = document.getElementById("scaleBlock");
		anim.scale(block, {duration: 1000, scale: 1.25});
	});
	document
	.querySelector("#fadeOutPlay")
	.addEventListener("click", function () {
		const block = document.querySelector("#fadeOutBlock");
		anim.fadeOut(block, {duration: 5000});
	});
	document
	.querySelector("#moveAndHidePlay")
	.addEventListener("click", function () {
		const block = document.querySelector("#moveAndHideBlock");
		anim.moveAndHide(block, {duration: 5000});
	});
	
	document.querySelector("#showAndHidePlay")
	.addEventListener("click", function () {
		const block = document.querySelector("#showAndHideBlock");
		anim.showAndHide(block, {duration: 3000});
	});
	
	document.querySelector("#heartBeatingPlay")
	.addEventListener("click", function () {
		const block = document.querySelector("#heartBeatingBlock");
		anim.heartBeating(block, {animaster: anim});
	});
	
	document.querySelector("#heartBeatingStop")
	.addEventListener("click", function () {
		anim.stopHeartBeating();
	});
	document.querySelector("#moveAndHideReset")
	.addEventListener("click", function () {
		const block = document.querySelector("#moveAndHideBlock");
		anim.resetMoveAndHide(block);
	});
	document.querySelector("#fadeInReset")
	.addEventListener("click", function (){
		const block = document.querySelector("#fadeInBlock");
		anim.resetFadeIn(block);
	});
	
	document.querySelector("#fadeOutReset")
	.addEventListener("click", function (){
		const block = document.querySelector("#fadeOutBlock");
		anim.resetFadeOut(block);
	});
	
	document.querySelector("#scaleReset")
	.addEventListener("click", function (){
		const block = document.querySelector("#scaleBlock");
		anim.resetMoveOrScale(block);
	});
	document.querySelector("#moveReset")
	.addEventListener("click", function (){
		const block = document.querySelector("#moveBlock");
		anim.resetMoveOrScale(block);
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
	return result.join(" ");
}


