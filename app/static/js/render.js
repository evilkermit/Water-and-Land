function render() {
	for (let index = 0; index < window.scenarios.length; index++) {
		const scenario = window.scenarios[index];

		fetch('/render/', {
			body: JSON.stringify({
				basin: scenario.basin,
				date: document.querySelector('#date').value,
				hour: document.querySelector('#hour').value,
				scenario: scenario.scenario,
				variable: scenario.variable,
			}),
			headers: {'Content-Type': 'application/json'},
			method: 'POST',
		}).then((response) => response.blob()).then((blob) => {
			const imageURL = URL.createObjectURL(blob);
			const image = scenario.element.querySelector('.render');

			image.src = imageURL;
		});
	}
}
