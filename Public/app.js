//handle login
function handleLogin () {
	$('form#login').on('submit', function (event) {
		$('div.user_results').html('');
		event.preventDefault();
		let form = $(this);
		let data = {
			userName: form[0][1].value,
			password: form[0][2].value
		};
		login(data, renderMain)
	});
};
//handle login requests
function login (objData, callback) {
	$.ajax({
	url: '/login',
	type: 'POST',
	dataType: 'json',
	data: JSON.stringify(objData),
	contentType: "application/json; charset=utf-8",
	success: callback,
	error: loginError
	})

};

function loginError (err) {
	console.log(err.responseText, err.status);
	$('div.user_results').html(`
		<p style='color: red; text-align: center;'>ERROR: code ${err.status},
		<br>${err.responseText}`)
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
//on error register
function errorRegister (err) {
	console.log(err.responseText, err.status);
	$('div.user_results').html(`
		<p style='color: red; text-align: center;'>ERROR: code ${err.status},
		<br>${err.responseText}`);
};
//render homepage for user
function renderMain (data) {
	console.log(data);
	console.log(`JWT:${data.token}`);
	$('div.register').addClass('hidden');
	$('div.login').addClass('hidden');
	$('nav').removeClass('hidden');
	$('span.userAccount').html(`<span class='userName'>${data.userName}</span>'s Account
		<span class='token hidden'>${data.token}</span>`);
	$('main').removeClass('hidden');
};
//make event listener for button.home
function handleHomeButton () {
	$('button.home').on('click', (event) => {
		event.preventDefault();
		$('div.menu_buttons').removeClass('hidden');
		$('div.drink_results').html('');
		$('form#drink_register').html('');
		$('div.myDrinks').html('');
		$('div.myDrink').html('');
		$('div.termMix').html('');
		$('div.newDrink').html('');
		$('div.drink_result').html('');
		$("div.error").html('');
	})
};
//botton logout
function handleLogoutButton() {
	$('button.logout').on('click', (event) => {
		event.preventDefault();
		$('div.login').removeClass('hidden');
		$('nav').addClass('hidden');
		$('span.userAccount').html("");
		$('main').addClass('hidden');
	})

};
//handle the get drink button
function handleAllDrinksButton () {
	$('div.button_drinks').on('click', function (event) {
		event.preventDefault();
		$('div.menu_buttons').addClass('hidden');
		console.log('button pressed GETting drinks');
		getDrink(renderDrink);
	})
};
//ajax call to the drink endpoint
function getDrink (callback) {
	const options = {
		url: "/drinks",
		type: 'GET',
		dataType: 'json',
		success: callback,
		error: forGetDrinkFail,
		crossOrigin: false
	};
	$.ajax(options);
};
//for fail function
function forGetDrinkFail (err) {
	console.log(err);
	$('div.error').html(`
		<p style='color: red; text-align: center;'>ERROR: code ${err.status},
		<br>${err.responseText}`)
};
//render drink  to the div.drink_results
function renderDrink (obj) {
	$('div.drink_results').html('');
	for (let i=0; i<obj.length; i++) {
		const options = `
		<div class='drink_log colu-4 border'>
		<img class="result" src=${obj[i].drinkImage} alt="${obj[i].drinkName}">
		<span class="result">Name: ${obj[i].drinkName}</span>
		<span class="result">User: ${obj[i].user}</span>
		<span class="result">Glass: ${obj[i].glass}</span>
		<button id=${obj[i].id} class="drink_btn btn btn-block btn-primary">Learn more about this drink</button>
		</div>`
		console.log(obj[i]);
		$('div.drink_results').append(options);
	};
};
//clicking on the drink in the list
function handleDrinkList () {
	$('div.drink_results').on('click', 'button', (event) => {
		event.preventDefault();
		console.log($(this));
		let theId = $(event)[0].target.id;
		console.log(`BUTTON PRESSED: ${theId}`)
		getOneDrink(theId, renderOneDrink)
	})
};
//goes to id endpoint and gets one drink back
function getOneDrink (id, callback) {
	const options = {
		url: `/drinks/${id}`,
		type: 'GET',
		dataType: 'json',
		success: callback,
		error: forGetDrinkFail,
		crossOrigin: false
	};
	$.ajax(options);
};

function renderOneDrink (obj) {
	$('div.drink_results').html('');
	$('div.drink_result').html(`
		<div class='drink colu-12 border'>
			<img class="drinkPage" src=${obj.drinkImage} alt="${obj.drinkName}">
			<h2>Name</h2> <span id="${obj.drinkName}" class="result">${obj.drinkName}</span>
			<h2>User</h2> <span id="${obj.user}" class="result">${obj.user}</span>
			<h2>Glass</h2> <span id="${obj.glass}" class="result">${obj.glass}</span>
			<h2>Ingredents</h2> <span id="${obj.ingredents}" class="result">${splitIng(obj.ingredents)}</span>
			<h2>Garnish</h2> <span id="${obj.garnish}" class="result">${obj.garnish}</span>
			<h2>Instructions</h2> <span id="${obj.instructions}" class="result"> ${obj.instructions}</span>
			<span class="hidden">${obj.id}</span>
		</div>
		<form id="comments">
			<label for="comments" class"sr-only">
				<input type="text" placeholder="Comments" class="form-control"></label>
		</form>
		`)
};
//split ingredents by the posistion in the array
function splitIng (obj) {
	let ol = `<ol>`
	obj.forEach(function(ing) {
		ol += `<li>${ing}</li>`
	})
	ol += `</ol>`
	return ol
}

//make event listener for div.button_make
function handleButtonMake() {
	$('div.button_make').on('click', (event) => {
		event.preventDefault();
		console.log('Button Make pressed');
		$('div.menu_buttons').addClass('hidden');
		$('div')
		const drinkForm =`
		<fieldset class="makeDrink">
			<h1>Make a new drink</h1>
			<label for="drinkName">Drink Name:
				<input type="text" name="drinkName" placeholder="Moscow Mule" required></label><br>
			<label for="glass">Glass:
				<input type="text" name="glass" placeholder="Copper Mug"></label><br>
			<label for="ingredents">Ingredents:
				<textarea name="ingredents" rows="6" placeholder="Vodka 1 1/2oz,&#10;Lime Juice 1/2oz,&#10;Ginger Beer Fill" required></textarea></label><br>
			<label for="instructions" >Instructions
				<input type="text" name="instructions" placeholder="How it is made" required></label><br>
			<label for="drinkImage">Drink Image:
				<input type="file" name="drinkImage" accept="image/*" required></label><br>
			<label for="garnish">Garnish:
				<input type="text" name="garnish" placeholder="Lime Wedge"></label><br>
			<input class="btn btn-block btn-lrg btn-primary" type="submit" name="Submit">
		</fieldset>
		`
		$('form#drink_register').html(drinkForm)
	})
};
//handle form to make a drink
function handleMakeDrink () {
	$('#drink_register').on('submit', function() {
		event.preventDefault();
		let form = $(this);
		let filename = form[0][6].value.replace(/.*(\/|\\)/, '');
		console.log(`POSTing drink data`);
		let user = $('span.userName');
		let token = $('span.token')[0].textContent;
		let data = {
			user: user[0].textContent,
			drinkName: form[0][1].value,
			glass: form[0][2].value,
			ingredents: [{
				ingredent: form[0][3].value,
				measurement: form[0][4].value
			}],
			instructions: form[0][5].value,
			drinkImage: filename,
			garnish: form[0][7].value
		};
		console.log(form);
		console.log(data);
		let formData = new FormData($(this)[0]);
		console.log(`MY FORM DATA:${form}`)
		postDrink(formData, token, renderMadeDrink);
	})
};
//post drink to db
function postDrink(data, jwt, callback) {
	console.log(`JWT: ${jwt}`);
	const options = {
		url: '/drinks',
		type: 'POST',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		success: callback,
		error: forPostDrinkFail,
		beforeSend: function (xhr) {xhr.setRequestHeader("Authorization", 'Bearer '+ jwt);}
	}
	$.ajax(options);
};
//post drink fail
function forPostDrinkFail (err) {
	console.log(err);
	$('div.error').html(`
		<p style='color: red; text-align: center;'>ERROR: code ${err.status},
		<br>${err.responseText}`)
};
//return drink from db
function renderMadeDrink (obj) {
	console.log(obj);
	$('form#drink_register').html('');
	$('div.myDrink').html(`
		<div class='drink colu-12 border'>
			<img class="drinkPage" src=${obj.drinkImage} alt="${obj.drinkName}">
			<h2>Name</h2> <span id="drinkName" class="result">${obj.drinkName}</span>
			<h2>User</h2> <span id="userName" class="result">${obj.user}</span>
			<h2>Glass</h2> <span id="glass" class="result">${obj.glass}</span>
			<h2>Ingredents</h2> <span id="ingredents" class="result">${splitIng(obj.ingredents)}</span>
			<h2>Garnish</h2> <span id="garnish" class="result">${obj.garnish}</span>
			<h2>Instructions</h2> <span id="instructions" class="result">${obj.instructions}</span>
			<button id=${obj.id} class="btn edit">Edit</button>
			<button id=${obj.id} value=${obj.drinkName} class="btn delete">Delete</button>
		</div>
		`)
};
//make event listener for div.button_myDrinks
function handleButtonView() {
	$('div.button_myDrinks').on('click', (event) => {
		event.preventDefault();
		console.log('View my drinks pressed');
		$('div.menu_buttons').addClass('hidden');
		console.log("GETting user drinks");
		let user = $('span.userName')[0].textContent;
		console.log(`USER: ${user}`);
		getUserDrinks(user, renderMyDrinks);
	})
};
//search drinks by user
function getUserDrinks (user, callback) {
	const options = {
		url: `/drinks/name/${user}`,
		type: 'GET',
		dataType: 'json',
		success: callback,
		error: myDrinksFail,
		crossOrigin: false
	};
	$.ajax(options);
};
//for fail on my drinks
function myDrinksFail (err) {
	console.log(err);
	$('div.error').html(`
		<p style='color: red; text-align: center;'>ERROR: code ${err.status},
		<br>${err.responseText}`)
};
//render my drinks
function renderMyDrinks (obj) {
	$('div.myDrinks').html('');
	for (let i=0; i<obj.length; i++) {
		const options = `
		<div class='drink_log colu-3 border'>
		<img class="result" src=${obj[i].drinkImage} alt="${obj[i].drinkName}">
		<span class="result">Name: ${obj[i].drinkName}</span>
		<span class="result">User: ${obj[i].user}</span>
		<span class="result">Glass: ${obj[i].glass}</span>
		<button id=${obj[i].id} class="drink_btn btn btn-block btn-primary">Learn about this drink</button>
		</div>`
		console.log(obj[i]);
		$('div.myDrinks').append(options);
	};		
};
//add event listener to the elements in div.myDrinks so the can go into div.myDrink
function handleMyDrinkList () {
	$('div.myDrinks').on('click', 'button', (event) => {
		event.preventDefault();
		let theId = $(event)[0].target.id;
		console.log(`BUTTON PRESSED: ${theId}`)
		getOneDrink(theId, renderOneMyDrink)
	})
};
//render my one drink 
function renderOneMyDrink (obj) {
	$('div.myDrinks').html('');
	$('div.myDrink').html(`
			<div class='drink colu-12 border'>
			<img class="drinkPage" src=${obj.drinkImage} alt="${obj.drinkName}">
			<h2>Name</h2> <span id="drinkName" class="result">${obj.drinkName}</span>
			<h2>User</h2> <span id="userName" class="result">${obj.user}</span>
			<h2>Glass</h2> <span id="glass" class="result">${obj.glass}</span>
			<h2>Ingredents</h2> <span id="ingredents" class="result">${splitIng(obj.ingredents)}</span>
			<h2>Garnish</h2> <span id="garnish" class="result">${obj.garnish}</span>
			<h2>Instructions</h2> <span id="instructions" class="result">${obj.instructions}</span>
			<button id=${obj.id} class="btn edit">Edit</button>
			<button id=${obj.id} value="${obj.drinkName}" class="btn delete">Delete</button>
		</div>
			<form id="comments">
				<label for="comments" class"sr-only">
					<input type="text" placeholder="Comments" class="form-control"></label>
			</form>`
		);
};
//add event listener to div.myDrink for edit
function handleMyDrinkEdit () {
	$('div.myDrink').on('click', 'button.edit', (event) => {
		console.log(`EDIT WAS PRESSED`);
		console.log($('span#drinkName'));
		console.log($('span#userName'));
		console.log($('span#glass'));
		console.log($('span#ingredents'));
		console.log($('span#instructions'));
	})
}
//make event listener for div.button_terms
function handleButtonTerms() {
	$('div.button_terms').on('click', (event) => {
		event.preventDefault();
		console.log("Terms button pressed");
	})
};
//if someone presses the delete button
function handleDrinkDeleteResult() {
	$('div.myDrink').on('click', 'button.delete', (event) => {
		event.preventDefault();
		let token = $('span.token')[0].textContent;
		let theId = $(event)[0].target.id;
		let name = $(event)[0].target.value
		console.log($(event));
		console.log(`DELETE ID: ${theId}`);
		console.log(`NAME: ${name}`)
		deleteById(theId, token, renderDelete, name)
	})
};
//delete by id
function deleteById (id, jwt, callback, name) {
	const options = {
		url: `/drinks/${id}`,
		type: 'DELETE',
		cache: false,
		contentType: false,
		processData: false,
		success: callback(name),
		error: deleteDrinkError,
		beforeSend: function (xhr) {xhr.setRequestHeader("Authorization", 'Bearer '+ jwt);}
	};
	$.ajax(options);
};
//handle drink delete error 
function deleteDrinkError (err) {
	console.log(err);
};
//return user to home screen after delete
function renderDelete (name) {
	console.log(`${name}: Deleted!`);
	$('div.menu_buttons').removeClass('hidden');
	$('div.drink_results').html('');
	$('form#drink_register').html('');
	$('div.myDrinks').html('');
	$('div.myDrink').html('');
	$('div.termMix').html('');
	$('div.newDrink').html('');
	$('div.drink_result').html('');
	$("div.error").html(`<h1>${name}: DELETED</h1>`);
};
//onload
function onload () {
	handleAllDrinksButton();
	handleMakeDrink();
	handleRegister();
	handleLogin();
	handleRegisterSubmit();
	handleHomeButton();
	handleLogoutButton();
	handleButtonMake();
	handleButtonView();
	handleButtonTerms();
	handleDrinkList();
	handleDrinkDeleteResult();
	handleMyDrinkList();
	handleMyDrinkEdit();
}
onload();
//------------------------------------------------------------------------------------------------------------------------------
//features still to add
//favorites
//editting 
//comments