const API = "https://bartendersbestfriend.herokuapp.com";
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

//make items to click on
function renderDrink (obj) {
	$('div.drink_results').html('');
	for (let i=0; i<obj.length; i++) {
		const drink = `
		<div class='drink_log colu-4 border'>
		<img class="result" src=${API}/${obj[i].drinkImage} alt="${obj[i].drinkName}">
		<span class="result">Name: ${obj[i].drinkName}</span>
		<span class="result">User: ${obj[i].user}</span>
		<span class="result">Glass: ${obj[i].glass}</span>
		<button id=${obj[i].id} class="drink_btn btn btn-block btn-primary">Learn more about this drink</button>
		</div>`
		console.log(obj[i]);
		$('div.drink_results').append(drink);
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

//render one drink || lets make a new page instead named Result.html
function renderOneDrink (obj) {
	$('div.drink_results').html('');
	$('form#search').addClass('hidden');
	$('input.back').removeClass('hidden');
	$('div.drink_result').html(`
		<div class='drink colu-12 border'>
			<img class="drinkPage" src=${API}/${obj.drinkImage} alt="${obj.drinkName}">
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
};

function handleSearch() {
	$('form#search').on('submit', (event) => {
		event.preventDefault();
		$('div.error').html('');
		console.log(`Search: ${event.target[0].value}`);
		let name = event.target[0].value;
		getSearchDrinkName(name, renderDrink);
	})
};
function getSearchDrinkName(name, callback) {
		const options = {
		url: `${API}/drinks/drink/${name}`,
		type: 'GET',
		dataType: 'json',
		success: callback,
		error: forGetDrinkFail,
		crossOrigin: false
	};
	$.ajax(options);
};
//handle back button
function handleBackBtn() {
	$('input.back').on('click', (event) => {
		$('input.back').addClass('hidden');
		$('form#search').removeClass('hidden');
		$('div.drink_result').html('');
		getDrink(renderDrink);	
	})
};
//------------------------------------------------------------------------------------------------------------
//onload
function onload () {
	getDrink(renderDrink);
	handleHomeButton();
	handleLogoutButton();
	handleDrinkList();
	handleSearch();
	handleBackBtn();
}
onload();
//------------------------------------------------------------------------------------------------------------------------------
//features still to add
//favorites
//editting 
//comments