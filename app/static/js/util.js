function populateOptions() {
	getVariableNames(document.getElementById("basin-output").value).then((data) => {
		fillOptions(document.getElementById('varname-output'), data);
		render();
	});
}

function getVariableNames(path, type) {
	return fetch('/getVariableNames/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			ncpath: path,
		}),
	}).then(res => res.json());
}

function fillOptions(el, optionsList) {
	while (el.options.length) el.remove(0);
	optionsList.forEach(optionText => {
		const option = document.createElement('option');
		option.text = optionText.replaceAll('_', ' ');
		option.value = optionText;
		el.appendChild(option);
	});
}

window.onload = () => {
	fetch('/getBasins/').then(res => res.json()).then((basins) => {
		const select = document.querySelector('#basin-output');

		for (let idx = 0; idx < basins.length; idx++) {
			const option = document.createElement('option');
			option.text = basins[idx].replaceAll('_', ' ');
			option.value = basins[idx];

			select.appendChild(option);
		}

		populateOptions();
	});
}
