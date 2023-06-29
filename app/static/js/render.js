function render(initial){
	const button = document.querySelector('.render-btn');
	const o_options = {};

	let o_perms = {
		type:'output',
		ncpath:document.getElementById("basin-output").value, 
		variable:document.getElementById("varname-output").value,
		date:document.getElementById("date-output").value,
		hour:document.getElementById("hour-output").value
	}

	if (!initial) {
		o_options.body = JSON.stringify(o_perms);
		o_options.headers = {'Content-Type': 'application/json'};
		o_options.method = 'POST';
	}

	fetch('/render/', o_options).then((response) => response.blob()).then((blob) => {
		const image_url = URL.createObjectURL(blob);
		const image = document.querySelector('.render-output');
		image.src = image_url;
	});
}
