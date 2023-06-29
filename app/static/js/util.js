window.scenarios = [];

function addScenario() {
	const grid = document.querySelector('.grid')
	const index = window.scenarios.length + 1; // index of this new scenario

	const plotEl = document.createElement('div');
	plotEl.innerHTML = `
		<img class="render"></img>
		<button class="delete-btn" type="button">Delete</button>
	`;

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

	render();
}

function removeScenario(index, el) {
	el.remove();
	window.scenarios.splice(index, 1);

	if (window.scenarios.length < 1) {
		document.querySelector('.grid .placeholder').hidden = false;
	}

	render();
}

function getVariables() {
	const scenario = document.querySelector('#scenario').value;
	const basin = document.querySelector('#basin').value;

	const select = document.querySelector('#variable');
	select.innerHTML = '';

	fetch(`/getVariables/?scenario=${scenario}&basin=${basin}`).then((res) => res.json()).then((variables) => {
		for (let index = 0; index < variables.length; index++) {
			const option = document.createElement('option');
			option.text = variables[index].replaceAll('_', ' ');
			option.value = variables[index];

			select.appendChild(option);
		}
	});
}

function getBasins() {
	const scenario = document.querySelector('#scenario').value;

	fetch(`/getBasins/?scenario=${scenario}`).then((res) => res.json()).then((basins) => {
		const select = document.querySelector('#basin');
		select.innerHTML = '';

		for (let index = 0; index < basins.length; index++) {
			const option = document.createElement('option');
			option.text = basins[index].replaceAll('_', ' ');
			option.value = basins[index];

			select.appendChild(option);
		}

		getVariables();
	});
}

function getScenarios() {
	fetch('/getScenarios/').then((res) => res.json()).then((scenarios) => {
		const select = document.querySelector('#scenario');
		select.innerHTML = '';

		for (let index = 0; index < scenarios.length; index++) {
			const option = document.createElement('option');
			option.text = scenarios[index].replaceAll('_', ' ');
			option.value = scenarios[index];

			select.appendChild(option);
		}

		getBasins();
	});
}

window.onload = () => {
	getScenarios();

	const scenarioEl = document.querySelector('#scenario');
	scenarioEl.addEventListener('change', () => {
		getBasins();
	});

	const basinEl = document.querySelector('#basin');
	basinEl.addEventListener('change', () => {
		getVariables();
	});
}
