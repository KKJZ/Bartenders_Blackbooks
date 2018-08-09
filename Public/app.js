//handle the get drink button
function handleAllDrinksButton () {
	$('.drinks').on('click', function (event) {
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
	$('div.drink_results').html('');
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
	$('div.drink_results').html(`<p style='color: red; text-align: center;'>ERROR: code ${err.status},<br>${err.responseText}`)
}

//handle form drink
function handleMakeDrink () {
	$('#drink_register').on('submit', function() {
		event.preventDefault();
		let form = $(this);
		let filename = form[0][6].value.replace(/.*(\/|\\)/, '');
		console.log(form.serialize());
		console.log(`POSTing drink data`);
		let user = $('span.userName');
		let data = {
			user: user[0].textContent,
			drinkName: form[0][1].value,
			glass: form[0][2].value,
			ingredents: [{
				ingredent: form[0][3].value,
				measurement: form[0][4].value
			}],
			instructions: form[0][5].value,
			drinkImage: filename
		};
		console.log(form);
		console.log(data);
		postDrink(data, renderMadeDrink);
	})
};

//post drink to db
function postDrink(data, callback) {
	const options = {
		url: '/drinks',
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		success: callback,
		error: makeDrinkError
	}
	$.ajax(options);
};

//return drink from db
function renderMadeDrink (obj) {
	console.log(obj);
	$('div.newDrink').html(`<p>${obj}</p>`)

};

//handle error
function makeDrinkError (err) {
	console.log(err.responseText, err.status);
	$('div.user_results').html(`<p style='color: red; text-align: center;'>ERROR: code ${err.status},<br>${err.responseText}`);
};

//handle login
function handleLogin () {
	$('form#login').on('submit', function (event) {
		event.preventDefault();
		let form = $(this);
		let data = {
			userName: form[0][1].value,
			password: form[0][2].value
		};
		console.log(data)
		$.ajax({
			url: '/login',
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			success: (token) => console.log(token),
			error: (err) => console.log(err.status, err.responseText)
		})
	});
};

//handle register button
function handleRegister () {
	$('button.register').on('click', function (event) {
		event.preventDefault();
		$('div.login').addClass('hidden');
		$('div.register').removeClass('hidden');
	})
};

function handleRegisterSubmit () {
	$('form#register').on('submit', function (event) {
		console.log(($(this).serialize()))
		event.preventDefault();
		$('div.user_results').html('');	
		let data = $(this);
		let userData = {
			userName: data[0][1].value,
			password: data[0][2].value,
			email: data[0][3].value
		};
		console.log(userData);
		registerUser(userData, renderMain);
	})
};

//register the user in the db
function registerUser (data, callback) {
	const options = {
		url: '/users',
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		success: callback,
		error: errorRegister
	};
	$.ajax(options);
};

//render homepage for user
function renderMain (data) {
	console.log(data);
	$('div.register').addClass('hidden');
	$('nav').removeClass('hidden');
	$('span.userAccount').html(`<span class='userName'>${data.userName}</span>'s Account`);
	$('main').removeClass('hidden');
};

//on error register
function errorRegister (err) {
	console.log(err.responseText, err.status);
	$('div.user_results').html(`<p style='color: red; text-align: center;'>ERROR: code ${err.status},<br>${err.responseText}`);
};

//onload
function onload () {
	handleAllDrinksButton();
	handleMakeDrink();
	handleRegister();
	handleLogin();
	handleRegisterSubmit();
}

onload();