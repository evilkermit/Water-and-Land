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

function getVariables(basin) {
	const select = document.querySelector('#variable');
	select.innerHTML = '';

	fetch('/getVariableNames/', {
		body: JSON.stringify({
			ncpath: basin,
		}),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
	}).then((res) => res.json()).then((data) => {
		for (let index = 0; index < data.length; index++) {
			const option = document.createElement('option');
			option.text = data[index].replaceAll('_', ' ');
			option.value = data[index];

			select.appendChild(option);
		}
	});
}

function getBasins() {
	fetch('/getBasins/').then((res) => res.json()).then((basins) => {
		const select = document.querySelector('#basin');
		select.innerHTML = '';

		for (let index = 0; index < basins.length; index++) {
			const option = document.createElement('option');
			option.text = basins[index].replaceAll('_', ' ');
			option.value = basins[index];

			select.appendChild(option);
		}

		if (basins.length > 0) {
			getVariables(basins[0]);
		}
	});
}

window.onload = () => {
	getBasins();

	const basinEl = document.querySelector('#basin');
	basinEl.addEventListener('change', (event) => {
		getVariables(event.target.value);
	});
}
