addListeners();

function animaster() {
	this.steps = [];
	this._copy = function () {
		let copy = Object.assign({}, this);
		copy.steps = copy.steps.slice();
		return copy
	}

	let currentCommands = {
		fadeOut(element, duration) {
			element.style.transitionDuration = `${duration}ms`;
			element.classList.remove('show');
			element.classList.add('hide');
		},

		resetFadeOut(element) {
			element.style = null;
			element.classList.add('show');
			element.classList.remove('hide');
		},

		fadeIn(element, duration) {
			element.style.transitionDuration = `${duration}ms`;
			element.classList.remove('hide');
			element.classList.add('show');
		},

		resetFadeIn(element) {
			element.style = null;
			element.classList.add('hide');
			element.classList.remove('show');
		},

		move(element, duration, translation) {
			element.style.transitionDuration = `${duration}ms`;
			element.style.transform = getTransform(translation, null);
		},

		scale(element, duration, ratio) {
			element.style.transitionDuration = `${duration}ms`;
			element.style.transform = getTransform(null, ratio);
		},

		resetMoveAndScale(element) {
			element.style = null;
		},

		changeColor(element, duration, color) {
			element.style.transitionDuration = `${duration}ms`;
			element.style.backgroundColor = color;
		}
	}

	this.addMoveAndHide = function (duration, translation) {
		let add = this.addMove(duration * 0.4, translation);
		add = add.addFadeOut(duration * 0.6);
		return add;
	};

	this.addShowAndHide = function (duration) {
		let add = this.addFadeIn(duration * 1 / 3);
		add = add.addDelay(duration * 1 / 3);
		add = add.addFadeOut(duration * 1 / 3);
		return add;
	};

	this.addMove = function (duration, translation) {
		let add = this._copy();
		add.steps.push({command: "move", duration, translation});
		return add;
	};

	this.addScale = function (duration, ratio) {
		let add = this._copy();
		add.steps.push({command: "scale", duration, ratio});
		return add;
	};

	this.addDelay = function (duration) {
		let add = this._copy();
		add.steps.push({duration});
		return add;
	};

	this.addChangeColor = function (duration, color) {
		let add = this._copy();
		add.steps.push({command: "changeColor", duration, color});
		return add;
	}

	this.addHeartBeating = function () {
		let add = this.addScale(300, 1.4);
		add = add.addScale(300, 1);
		return add;
	};

	this.addFadeIn = function (duration) {
		let add = this._copy();
		add.steps.push({command: "fadeIn", duration});
		return add;
	};

	this.addFadeOut = function (duration) {
		let add = this._copy();
		add.steps.push({command: "fadeOut", duration});
		return add;
	}

	this.buildHandler = function () {
		return (el) => this.play(el.target);
	}

	this.play = function (element, unending) {
		let commandsArray = [];
		let commands = () => {
			let duration = 0;
			for (const step of this.steps) {
				commandsArray.push(setTimeout(() =>
					currentCommands[step["command"]] === undefined
					|| currentCommands[step["command"]](element, step["duration"], step["translation"]
					|| step["ratio"]
					|| step["color"]), duration));
				duration += step["duration"];
			}
		};

		let interval;
		if (!unending) {
			commands();
		} else {
			interval = setInterval(() => commands(), this.steps.reduce((a, b) => a["duration"] + b["duration"]));
		}

		return {
			reset: (element) => {
				commandsArray.forEach(x => clearTimeout(x));
				if (element.classList.contains("show") || !element.classList.contains("hide"))
					currentCommands.resetFadeOut(element);
				else
					currentCommands.resetFadeIn(element);
				currentCommands.resetMoveAndScale(element);
			},
			stop: () => {
				clearInterval(interval);
			}
		}
	};

	return this;
}

function addListeners() {
	const myAnimation = animaster()
	.addMove(200, {x: 40, y: 40})
	.addScale(800, 0.5)
	.addChangeColor(100, "red")
	.addMove(200, {x: 40, y: -40})
	.addScale(800, 0.5)
	.addChangeColor(100, "orange")
	.addMove(200, {x: -40, y: -40})
	.addScale(800, 0.5)
	.addChangeColor(100, "yellow")
	.addMove(200, {x: -40, y: 40})
	.addScale(800, 0.5)
	.addChangeColor(100, "green")
	.addMove(200, {x: 40, y: 40})
	.addScale(800, 0.5)
	.addChangeColor(100, "deepskyblue")
	.addMove(200, {x: 40, y: -40})
	.addScale(800, 0.5)
	.addChangeColor(100, "blue")
	.addMove(200, {x: -40, y: -40})
	.addScale(800, 0.5)
	.addChangeColor(100, "purple")
	.addMove(200, {x: 0, y: 0});

	const worryAnimationHandler = animaster()
	.addMove(200, {x: 80, y: 0})
	.addMove(200, {x: 0, y: 0})
	.addMove(200, {x: 80, y: 0})
	.addMove(200, {x: 0, y: 0})
	.buildHandler();

	addHandlerOnButton('fadeIn', animaster().addFadeIn(5000), false);
	addHandlerOnButton('fadeOut', animaster().addFadeOut(5000), false);
	addHandlerOnButton('move', animaster().addMove(1000, {x: 100, y: 10}), false);
	addHandlerOnButton('scale', animaster().addScale(1000, 1.25), false);
	addHandlerOnButton('moveAndHide', animaster().addMoveAndHide(2000, {x: 100, y: 20}), false);
	addHandlerOnButton('showAndHide', animaster().addShowAndHide(2000), false);
	addHandlerOnButton("heartBeating", animaster().addHeartBeating(), true);
	addHandlerOnButton('background', animaster().addChangeColor(1000, "white"), false);
	addHandlerOnButton('myAnimation', myAnimation, false);
	document.getElementById('worryAnimationBlock').addEventListener('click', worryAnimationHandler);

	function addHandlerOnButton(elementId, animation, unending) {
		let reset;
		document.getElementById(`${elementId}Play`)
		.addEventListener('click', function () {
			const block = document.getElementById(`${elementId}Block`);
			reset = animation.play(block, unending);
		});
		document.getElementById(unending ? `${elementId}Stop` : `${elementId}Reset`)
		.addEventListener('click', function () {
			const block = document.getElementById(`${elementId}Block`);
			console.log(reset);
			reset = unending ? reset["stop"] : reset["reset"];
			reset(block);
		});
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
