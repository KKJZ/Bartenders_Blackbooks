const API = "http://localhost:8080";

//setup Nav
function navSetup () {
	console.log("JWT:",localStorage.getItem('jwt'));
	console.log("User:", localStorage.getItem('userName'));
	user = localStorage.getItem('userName');
	$('span.userAccount').html(`<span class='userName'>${user}</span>'s Account`)
};

//make event listener for button.home
function handleHomeButton () {
	$('button.home').on('click', (event) => {
		window.location = '../Main.html';
	});
};

//botton logout
function handleLogoutButton() {
	$('button.logout').on('click', (event) => {
		console.log('Pressed logout')
		localStorage.clear();
		window.location = '../../Login.html';
	});
};

//handle form to make a drink
function handleMakeDrink () {
	$('#drink_register').on('submit', function() {
		event.preventDefault();
		// let filename = form[0][6].value.replace(/.*(\/|\\)/, '');
		console.log(`POSTing drink data`);
		let token = localStorage.getItem('jwt');
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
//return just made drink from db || lets make a new page for myDrinks
function renderMadeDrink (obj) {
	console.log(obj);
	$('form#drink_register').html('');
	$('div.myDrink').html(`
		<div class='drink colu-12 border'>
			<img class="drinkPage" src=${API}/${obj.drinkImage} alt="${obj.drinkName}">
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
//----------------------------------------------------------------------------------------------------------------------
//onload
function onload () {
	navSetup();
	handleMakeDrink();
	handleHomeButton();
	handleLogoutButton();
}
onload();
//------------------------------------------------------------------------------------------------------------------------------
//features still to add
//favorites
//editting 
//comments