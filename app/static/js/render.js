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

		const date = element.querySelector('.date').value;
		const hour = element.querySelector('.hour').value;
		const diff = new Date(date) - new Date('2016-11-02');
		const diffInDays = diff / (1000 * 3600 * 24);
		const timestep = 24 * diffInDays + parseInt(hour);

		fetch('/render/', {
			body: JSON.stringify({
				date,
				hour,
				basin: scenario.basin,
				scenario: scenario.scenario,
				variable: scenario.variable,
			}),
			headers: {'Content-Type': 'application/json'},
			method: 'POST',
		}).then((response) => response.blob()).then((blob) => {
			const imageURL = URL.createObjectURL(blob);
			const plot = scenario.element.querySelector('.plot');

			plot.src = imageURL;

			scenario.element.hidden = false;
		});

		$('.hyperimage', element).eq(0).data('tapestry').current_timestep = timestep;
		$('.hyperimage', element).eq(0).data('tapestry').render(0);
	}
}

const throttledRender = _.throttle(_render, 1000);

function render(event) {
	throttledRender(event);
}
