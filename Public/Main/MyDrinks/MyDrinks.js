const API = "https://bartendersbestfriend.herokuapp.com/";

function navSetup () {
	console.log("JWT:",localStorage.getItem('jwt'));
	console.log("User:", localStorage.getItem('userName'));
	user = localStorage.getItem('userName');
	$('span.userAccount').html(`<span class='userName'>${user}</span>'s Account`)
};
navSetup();

//make event listener for button.home
function handleHomeButton () {
	$('button.home').on('click', (event) => {
		window.location = '../Main.html';
		// event.preventDefault();
		// $('div.menu_buttons').removeClass('hidden');
		// $('div.drink_results').html('');
		// $('form#drink_register').html('');
		// $('div.editDrink > img').remove()
		// $('form#edit').html('');
		// $('div.myDrinks').html('');
		// $('div.myDrink').html('');
		// $('div.termMix').html('');
		// $('div.newDrink').html('');
		// $('div.drink_result').html('');
		// $("div.error").html('');
	});
};
//botton logout
function handleLogoutButton() {
	$('button.logout').on('click', (event) => {
		console.log('Pressed logout')
		localStorage.clear();
		window.location = '../../Login.html';
		// event.preventDefault();
		// $('div.error').html('');
		// $('div.login').removeClass('hidden');
		// $('nav').addClass('hidden');
		// $('span.userAccount').html("");
		// $('main').addClass('hidden');
	});
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
//for fail function
function forGetDrinkFail (err) {
	console.log(err);
	$('div.error').html(`
		<p style='color: red; text-align: center;'>ERROR: code ${err.status},
		<br>${err.responseText}`)
};
//split ingredents by the posistion in the array
function splitIng (obj) {
	let ol = `<ol>`
	obj.forEach(function(ing) {
		ol += `<li>${ing}</li>`
	})
	ol += `</ol>`
	return ol
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
//return user to myDrinks after delete
function renderDelete (name) {
	console.log(`${name}: Deleted!`);
	getUserDrinks(localStorage.getItem('userName'), renderMyDrinks);
	$("div.error").html(`<h1>${name}: DELETED</h1>`);
};
//----------------------------------------------------------------------------------------------
//onload
function onload () {
	getUserDrinks(localStorage.getItem('userName'), renderMyDrinks);

	handleHomeButton();
	handleLogoutButton();
	handleDrinkDeleteResult();
	handleMyDrinkList();
	handleMyDrinkEdit();
	handleDrinkEditForm();
}
onload();
//------------------------------------------------------------------------------------------------------------------------------
//features still to add
//terms and mix
//favorites
//editting 
//comments