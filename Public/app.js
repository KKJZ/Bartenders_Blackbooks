//handle the get drink button
function handleButton () {
	$('.drinks').on('click', function () {
		event.preventDefault();
		console.log('button pressed GETting drinks');
		getDrink(renderDrink);
	})
}

//ajax call to the random drink endpoint
function getDrink (callback) {
	const options = {
		url: "/drinks",
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
	for (let i=0; i<obj.length; i++) {
		const options = `
		<article>
		<img class="result" src=${obj[i].drinkImage}>
		User: ${obj[i].user}<br>
		Name : ${obj[i].drinkName}<br>
		Glass: ${obj[i].glass}<br>
		</article>`
		console.log(obj[i]);
		$('div.drink_results').append(options);
	};
}

//for fail function
function forFail (err) {
	console.log(err);
	$('div.drink_results').html(`<p>ERROR: code ${err.status},<br>${err.responseText}`)
}

//make user
function handleUser () {
	$('#user_register').on('submit', function() {
		event.preventDefault();
		let form = $(this);
		console.log(form);
		console.log('User submitted.');
		let data = {
			userName: form[0][1].value,
			password: form[0][2].value,
			email: form[0][3].value	
		}
		console.log(data);
		postUser(data, renderUser);
	})
}

//post user makes a post request to the server to make the user
function postUser (data, callback) {
	console.log(data)
	const request = {
		url: '/users',
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		success: callback,
		error: errorUser,
	}
	$.ajax(request);
};

//render user returns the user name and a success status back to the user
function renderUser (obj) {
	console.log(obj);
	$('div.user_results').html(`${obj.userName} was successfully created.`)
};

//error on user make 
function errorUser (err) {
	console.log(err.responseText, err.status);
	$('div.user_results').html(`<p>ERROR: code ${err.status},<br>${err.responseText}`)
};

//handle form drink
function handleMakeDrink () {
	$('#drink_register').on('submit', function() {
		event.preventDefault();
		let form = $(this);
		console.log(`POSTing drink data`);
		let data = {
			user: "test",
			drinkName: form[0][1].value,
			glass: form[0][2].value,
			ingredents: [{
				ingredent: form[0][3].value,
				measurement: form[0][4].value
			}],
			instructions: form[0][5].value,
			drinkImage: form[0][6].value
		};
		console.log(form);
		console.log(data);
	})
};

//post drink to db
function postDrink() {

};

//return drink from db
function renderMadeDrink () {

};

//handle error
function makeDrinkError (err) {
	console.log(err.responseText, err.status);
	$('div.user_results').html(`<p>ERROR: code ${err.status},<br>${err.responseText}`);
};

handleButton();
handleUser();
handleMakeDrink();