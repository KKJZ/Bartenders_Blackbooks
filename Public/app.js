const randomDrinkURL = 'http://localhost:5000/'

//handle the random button
function handleButton () {
	$('.random').on('click', function () {
		event.preventDefault();
		getDrink(renderDrink);
	})
}

//ajax call to the random drink endpoint
function getDrink (callback) {
	const options = {
		url: randomDrinkURL,
		type: 'GET',
		dataType: 'json',
		success: callback,
		error: forFail,
		crossOrigin: false
	};
	$.ajax(options);
}

//render drink  to the div.results
function renderDrink (obj) {
	const options = `
	<article>
	<img class="result" src=${obj.thumbnail}>
	Category: ${obj.category}<br>
	Name : ${obj.name}<br>
	Glass: ${obj.glass}<br>
	</article>`
	$('div.results').html(options)
}

//for fail function
function forFail (err) {
	console.log(err);
}

handleButton();