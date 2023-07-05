window.scenarios = [];

function addScenario() {
	const grid = document.querySelector('.grid')
	const index = window.scenarios.length;

	const plotEl = document.createElement('div');
	plotEl.classList.add('plot');
	plotEl.hidden = true;
	plotEl.innerHTML = `
		<img class="render"></img>
		<button class="delete-btn" type="button">
			<i class="fa-solid fa-trash"></i>
		</button>
	`;

	const timeControlEl = document.querySelector('.time-control').cloneNode(true);
	timeControlEl.style.display = 'block';
	plotEl.appendChild(timeControlEl);

	plotEl.querySelector('.delete-btn').addEventListener('click', () => {
		removeScenario(index, plotEl);
	});

	grid.appendChild(plotEl);
	grid.querySelector('.placeholder').hidden = true;

	window.scenarios.push({
		basin: document.querySelector('#basin').value,
		element: plotEl,
		scenario: document.querySelector('#scenario').value,
		variable: document.querySelector('#variable').value,
	});

	window.render();
}

function removeScenario(index, el) {
	el.remove();
	window.scenarios.splice(index, 1);

	if (window.scenarios.length < 1) {
		document.querySelector('.grid .placeholder').hidden = false;
	}

	window.render();
}

function getScenarioEl(event) {
	for (let index = 0; index < window.scenarios.length; index++) {
		const element = document.querySelector('.grid').children[index + 1];
		if (element.contains(event.target)) {
			return element;
		}
	}
}

function addDay(event, render) {
	const element = window.getScenarioEl(event);
	const dateEl = element.querySelector('.date');

	const date = new Date(dateEl.value);
	date.setDate(date.getDate() + 1);

	dateEl.valueAsDate = date;

	if (render) {
		window.render(event);
	}
}

function subtractDay(event, render) {
	const element = window.getScenarioEl(event);
	const dateEl = element.querySelector('.date');

	const date = new Date(dateEl.value);
	date.setDate(date.getDate() - 1);

	dateEl.valueAsDate = date;

	if (render) {
		window.render(event);
	}
}

function addHour(event, render) {
	const element = window.getScenarioEl(event);
	const dateEl = element.querySelector('.date');
	const hourEl = element.querySelector('.hour');

	const oldDate = dateEl.value;
	let newHour = parseInt(hourEl.value) + 1;

	if (newHour === 24) {
		addDay();

		if (dateEl.value !== oldDate) {
			newHour = 0;
		}
	}

	hourEl.value = newHour;

	if (render) {
		window.render(event);
	}
}

function subtractHour(event, render) {
	const element = window.getScenarioEl(event);
	const dateEl = element.querySelector('.date');
	const hourEl = element.querySelector('.hour');

	const oldDate = dateEl.value;
	let newHour = parseInt(hourEl.value) - 1;

	if (newHour === -1) {
		subtractDay();

		if (dateEl.value !== oldDate) {
			newHour = 23;
		}
	}

	hourEl.value = newHour;

	if (render) {
		window.render(event);
	}
}

function getVariables() {
	const basin = document.querySelector('#basin').value;
	const scenario = document.querySelector('#scenario').value;

	fetch(`/getVariables/?basin=${basin}&scenario=${scenario}`).then((res) => res.json()).then((variables) => {
		const select = document.querySelector('#variable');
		const oldValue = select.value;
		select.innerHTML = '';

		for (let index = 0; index < variables.length; index++) {
			const option = document.createElement('option');
			option.text = variables[index].replaceAll('_', ' ');
			option.value = variables[index];

			select.appendChild(option);
		}

		if (oldValue && variables.includes(oldValue)) {
			select.value = oldValue;
		}
	});
}

function getScenarios() {
	const basin = document.querySelector('#basin').value;

	fetch(`/getScenarios/?basin=${basin}`).then((res) => res.json()).then((scenarios) => {
		const select = document.querySelector('#scenario');
		const oldValue = select.value;
		select.innerHTML = '';

		for (let index = 0; index < scenarios.length; index++) {
			const option = document.createElement('option');
			option.text = scenarios[index].replaceAll('_', ' ');
			option.value = scenarios[index];

			select.appendChild(option);
		}

		if (oldValue && scenarios.includes(oldValue)) {
			select.value = oldValue;
		}

		getVariables();
	});
}

function getBasins() {
	fetch('/getBasins/').then((res) => res.json()).then((basins) => {
		const select = document.querySelector('#basin');
		const oldValue = select.value;
		select.innerHTML = '';

		for (let index = 0; index < basins.length; index++) {
			const option = document.createElement('option');
			option.text = basins[index].replaceAll('_', ' ');
			option.value = basins[index];

			select.appendChild(option);
		}

		if (oldValue && basins.includes(oldValue)) {
			select.value = oldValue;
		}

		getScenarios();
	});
}

window.onload = () => {
	getBasins();

	const basinEl = document.querySelector('#basin');
	basinEl.addEventListener('change', () => {
		getScenarios();
	});

	const scenarioEl = document.querySelector('#scenario');
	scenarioEl.addEventListener('change', () => {
		getVariables();
	});
}
