const API = "https://bartendersbestfriend.herokuapp.com";

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
		login(data, loadMainPage)
	});
};
//handle login requests
function login (objData, callback) {
	$.ajax({
	url: `${API}/login`,
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
		registerUser(userData, loadMainPage);
	})
};
//register the user in the db
function registerUser (data, callback) {
	const options = {
		url: `${API}/users`,
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

function loadMainPage (data) {
	console.log(data);
	localStorage.setItem('jwt', data.token);
	localStorage.setItem('userName', data.userName);
	window.location = "./Main/Main.html";
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------
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
		$('div.editDrink > img').remove()
		$('form#edit').html('');
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
		$('div.error').html('');
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
		$('div.error').html('');
		$('div.menu_buttons').addClass('hidden');
		console.log('button pressed GETting drinks');
		getDrink(renderDrink);
	})
};
//ajax call to the drink endpoint
function getDrink (callback) {
	const options = {
		url: `${API}/drinks`,
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
		url: `${API}/drinks/${id}`,
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
		</div>`
		// <form id="comments">
		// 	<label for="comments" class"sr-only">
		// 		<input type="text" placeholder="Comments" class="form-control"></label>
		// </form>
		// 
		)
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
		$('div.error').html('');
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
				<textarea name="instructions" rows="6" placeholder="How it is made" required></textarea></label><br>
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
		// let filename = form[0][6].value.replace(/.*(\/|\\)/, '');
		console.log(`POSTing drink data`);
		let token = $('span.token')[0].textContent;
		// let data = {
		// 	user: user[0].textContent,
		// 	drinkName: form[0][1].value,
		// 	glass: form[0][2].value,
		// 	ingredents: [{
		// 		ingredent: form[0][3].value,
		// 		measurement: form[0][4].value
		// 	}],
		// 	instructions: form[0][5].value,
		// 	drinkImage: filename,
		// 	garnish: form[0][7].value
		// };
		// console.log(form);
		// console.log(data);
		let formData = new FormData($(this)[0]);
		console.log(`MY FORM DATA:${formData}`)
		postDrink(formData, token, renderMadeDrink);
	})
};
//post drink to db
function postDrink(data, jwt, callback) {
	console.log(`JWT: ${jwt}`);
	const options = {
		url: `${API}/drinks`,
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
//return just made drink from db
function renderMadeDrink (obj) {
	console.log(obj);
	$('form#drink_register').html('');
	$('div.myDrink').html(`
		<div class='drink colu-12 border'>
			<img class="drinkPage" src=${obj.drinkImage} alt="${obj.drinkName}">
			<span id="drinkId" class="hidden">${obj.id}</span>
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
		$('div.error').html('');
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
		url: `${API}/drinks/name/${user}`,
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
		<div class='drink_log colu-4 border'>
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
		console.log(`BUTTON PRESSED: ${theId}`);
		getOneDrink(theId, renderOneMyDrink);
	});
};
//render my one drink 
function renderOneMyDrink (obj) {
	$('div.myDrinks').html('');
	$('div.myDrink').html(`
		<div class="drink colu-12 border">
			<img class="drinkPage" src=${obj.drinkImage} alt="${obj.drinkName}">
			<span id="drinkId" class="hidden">${obj.id}</span>
			<h2>Name</h2> <span id="drinkName" class="result">${obj.drinkName}</span>
			<h2>User</h2> <span id="userName" class="result">${obj.user}</span>
			<h2>Glass</h2> <span id="glass" class="result">${obj.glass}</span>
			<h2>Ingredents</h2> <span id="ingredents" class="result">${splitIng(obj.ingredents)}<span id="${obj.ingredents}"></span></span>
			<h2>Garnish</h2> <span id="garnish" class="result">${obj.garnish}</span>
			<h2>Instructions</h2> <span id="instructions" class="result">${obj.instructions}</span>
			<button id=${obj.id} class="btn edit">Edit</button>
			<button id=${obj.id} value="${obj.drinkName}" class="btn delete">Delete</button>
		</div>`
		);
	// <form id="comments">
	// 	<label for="comments" class"sr-only">
	// 		<input type="text" placeholder="Comments" class="form-control"></label>
	// </form>`
};
//add event listener to div.myDrink for edit
function handleMyDrinkEdit () {
	$('div.myDrink').on('click', 'button.edit', (event) => {
		console.log(`EDIT WAS PRESSED`);
		$('button.edit').addClass('hidden');
		$('button.delete').addClass('hidden');
		//make varible for the existting values,
		let drinkImage = $('img.drinkPage')[0].src;
		let drinkId = $('span#drinkId')[0].textContent;
		let drinkName = $('span#drinkName')[0].textContent;
		let glass = $('span#glass')[0].textContent;
		let ingredents = $('span#ingredents')[0].lastChild.id;
		let instructions = $('span#instructions')[0].textContent;
		let garnish = $('span#garnish')[0].textContent;
		console.log($('span#ingredents')[0].lastChild.id);
		//turn the spans into a form
		$('div.editDrink').removeClass('hidden');
		$('div.editDrink').prepend(`<img class="edit drinkPage" src=${drinkImage} alt="${drinkName}">`);
		$('form#edit').html(`
			<fieldset class="editDrink">
				<input type="text" class="hidden" id="id" name="id" value="${drinkId}">
				<label for="drinkName">Drink Name:
					<input type="text" value="${drinkName}" name="drinkName" required></label><br>
				<label for="glass">Glass:
					<input type="text" value="${glass}" name="glass" required></label><br>
				<label for="ingredents">ingredents:
					<textarea name="ingredents" rows="6" required>${ingredents}</textarea></label><br>
				<label for="garnish">Garnish:
					<input type="text" value="${garnish}" name="garnish" required></label><br>
				<label for="instructions">Instructions:
					<textarea name="instructions" rows="6" required>${instructions}</textarea></label><br>
				<label for="drinkImage">Drink Image:
					<input type="file" name="drinkImage" accept="image/*"></label><br>
				<input class="btn-block btn-lrg btn-primary btn" type="submit" name="Submit">
			</fieldset>
				`)
		$('div.myDrink').html('');

		// $('span#drinkName').replaceWith(`<input type="text" value="${drinkName}" name="drinkName">`);
		// $('span#glass').replaceWith(`<input type="text" value="${glass}" name="glass">`);
		// $('span#ingredents').replaceWith(`<textarea name="ingredents"  rows="6">${ingredents}</textarea>`);
		// $('span#garnish').replaceWith(`<input type="text" value="${garnish}" name="garnish">`);
		// $('span#instructions').replaceWith(`<textarea name="instructions"  rows="6">${instructions}</textarea><input class="btn-block btn" type="submit" name="edit">`);
	})
};
//handle form submit for drink editting
function handleDrinkEditForm () {
	$('#edit').on('submit', function() {
		event.preventDefault();
		console.log('EDIT FORM SUBMITTED');
		let token = $('span.token')[0].textContent;
		let formData = new FormData($(this)[0]);
		let id = $('input#id')[0].value;
		editDrink(formData, id, token);
	});
};
//put request function callback: getOneDrink(id, renderOneMyDrink);
function editDrink (obj, id, jwt) {
	console.log(`JWT: ${jwt}`);
	const options = {
		url: `${API}/drinks/${id}`,
		type: 'PUT',
		data: obj,
		cache: false,
		contentType: false,
		processData: false,
		success: () => {
			$('div.editDrink').addClass('hidden'),
			$('div.editDrink > img').remove(),
			$('form#edit').html(''),
			getOneDrink(id, renderOneMyDrink)},
		error: forPostDrinkFail,
		beforeSend: function (xhr) {xhr.setRequestHeader("Authorization", 'Bearer '+ jwt);}
	}
	$.ajax(options);
};

//make event listener for div.button_terms
function handleButtonTerms() {
	$('div.button_terms').on('click', (event) => {
		event.preventDefault();
		$('div.error').html('');
		console.log("Terms button pressed");
		let token = $('span.token')[0].textContent;
		localStorage.setItem('jwt', token);
		let user = $('span.userName')[0].textContent;
		localStorage.setItem('userName', user)
		window.location = "./Main/Terms/terms.html";
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
		url: `${API}/drinks/${id}`,
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
	handleDrinkEditForm();
}
onload();
//------------------------------------------------------------------------------------------------------------------------------
//features still to add
//favorites
//editting 
//comments