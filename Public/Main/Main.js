const API = "https://bartendersbestfriend.herokuapp.com";
//make event listener for button.home
function handleHomeButton () {
	$('button.home').on('click', (event) => {
		window.location = './Main.html';
	});
};
//botton logout
function handleLogoutButton() {
	$('button.logout').on('click', (event) => {
		console.log('Pressed logout')
		localStorage.clear();
		window.location = '../Login.html';
	});
};
//handle the get drink button
function handleAllDrinksButton () {
	$('div.button_drinks').on('click', function (event) {
		event.preventDefault();
		window.location = './Search/Search.html'
	})
};

//make event listener for div.button_make
function handleButtonMake() {
	$('div.button_make').on('click', (event) => {
		event.preventDefault();
		window.location = './NewDrink/NewDrink.html'
	});
};

//view my drinks button
function handleButtonView() {
	$('div.button_myDrinks').on('click', (event) => {
		event.preventDefault();
		window.location = './MyDrinks/MyDrinks.html'
	})
};

//view terms button
function handleButtonTerms () {
	$('div.button_terms').on('click', (event) => {
		event.preventDefault();
		console.log("Terms button pressed");
		window.location = "https://barsandbartending.com/bar-terms-and-bartender-terminology/"
	})
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//onload
function onload () {
	handleAllDrinksButton();
	handleHomeButton();
	handleLogoutButton();
	handleButtonView();
	handleButtonTerms();
	handleButtonMake();
}
onload();
//------------------------------------------------------------------------------------------------------------------------------
//features still to add
//favorites
//editting 
//comments