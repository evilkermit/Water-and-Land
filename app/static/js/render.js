function updateTime(targetEl) {
	for (let index = 0; index < window.scenarios.length; index++) {
		const element = document.querySelector('.grid').children[index + 1];
		if (targetEl === element) {
			continue;
		}

		if (element.querySelector('.link').checked) {
			element.querySelector('.date').value = targetEl.querySelector('.date').value;
			element.querySelector('.hour').value = targetEl.querySelector('.hour').value;
		}
	}
}

function _render(event) {
	if (event !== undefined) {
		const targetEl = window.getScenarioEl(event);
		if (targetEl.querySelector('.link').checked) {
			updateTime(targetEl);
		}
	}

	for (let index = 0; index < window.scenarios.length; index++) {
		const scenario = window.scenarios[index];
		const element = document.querySelector('.grid').children[index + 1];

		fetch('/render/', {
			body: JSON.stringify({
				basin: scenario.basin,
				date: element.querySelector('.date').value,
				hour: element.querySelector('.hour').value,
				scenario: scenario.scenario,
				variable: scenario.variable,
			}),
			headers: {'Content-Type': 'application/json'},
			method: 'POST',
		}).then((response) => response.blob()).then((blob) => {
			const imageURL = URL.createObjectURL(blob);
			const image = scenario.element.querySelector('.render');

			image.src = imageURL;

			scenario.element.hidden = false;
		});
	}
}

const throttledRender = _.throttle(_render, 1000);

function render(event) {
	throttledRender(event);
}
