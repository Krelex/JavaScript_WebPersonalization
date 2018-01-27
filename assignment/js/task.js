
//**********Creating popup window*************

//creating div and puting them into const
const popup = createNode('div');
const popdown = createNode('div');
const popOne = createNode('div');


const loadercont = createNode('div');
const loader = createNode('div');

//creating const for body
const body = document.body;

// Puting div's into body
append(body, popup);
append(body, popdown);
append(body, popOne);

append(popOne, loadercont);
append(loadercont, loader);

// Set css attribute "class" on div's elements
popup.setAttribute("class","popup");
popdown.setAttribute("class","popdown");
popOne.setAttribute("class", "popOne");

loadercont.setAttribute("id","loadercont2");
loader.setAttribute("id", "loader2");


// Create elements for dialogbox when its open window
const popHeader='<h1 class="header_pop">Github users<span class="close">x</span></h1>';
const popBody='<ul class="body_pop"></ul>';

// Create element for dialogbox when its closed window
const downHeader='<h1 class="header_pop">Github users<span id="open">_</span></h1>';

// Create element for singleUser box
const popOHeader='<h1 class="header_pop header_user"><span>a</span><span class="close">x</span></h1>';
const popimg='<img class="popimg"></img>';
const popComp='<p class="company">Company: <span>a</span></p>';
const repo='<p class="rAndg r">Respo: <span>a</span></p>';
const gist='<p class="rAndg g">Gists: <span>a</span></p>';

// Puting elements into open window
popup.insertAdjacentHTML('afterbegin', popHeader );
popup.insertAdjacentHTML('beforeend', popBody );

// Puting elements into closed window
popdown.insertAdjacentHTML('afterbegin', downHeader );

// Puting elements into singleUser window

popOne.insertAdjacentHTML('afterbegin', popOHeader );
popOne.insertAdjacentHTML('beforeend', popimg );
popOne.insertAdjacentHTML('beforeend', popComp );
popOne.insertAdjacentHTML('beforeend', repo );
popOne.insertAdjacentHTML('beforeend', gist );


// Puting span elements "close" and "open" into const 
let x = document.getElementsByClassName("close");
let y = document.getElementById("open");

// EventListner on Close button
for (var i = 0 ; i < x.length ; i++) {
	x[i].addEventListener('click', () => {
		document.querySelector(".popup").style.visibility = 'hidden';
		document.querySelector('.popOne').style.visibility = 'hidden';


		setTimeout( () => {
			document.querySelector('.popdown').style.visibility = 'visible';}, 500);
		
		document.querySelector(".popup").classList.remove("upTran");
		document.querySelector(".popup").classList.add("downTran");

		document.querySelector(".popOne").classList.remove("upTran");
		document.querySelector(".popOne").classList.add("downTran");

	})
};	

// EventListner on Open button
y.addEventListener('click', () => {
	document.querySelector(".popup").style.visibility = 'visible';
	document.querySelector('.popdown').style.visibility = 'hidden';
	
	searchLi();

	document.querySelector(".popup").classList.remove("downTran");
	document.querySelector(".popup").classList.add("upTran");

	document.querySelector(".popOne").classList.remove("downTran");
	document.querySelector(".popOne").classList.add("upTran");

});

// Move "go-top" button on left side
document.querySelector("#go-top").style.zIndex = 450;
document.querySelector("#go-top").style.left = "30px";

// Grabing all nodes
let h1= document.querySelector(".header_user").childNodes[0];
let pic= document.querySelector(".popimg");
let comp = document.querySelector(".company").firstElementChild;
let rep= document.querySelector(".r").childNodes[1];
let git= document.querySelector(".g").childNodes[1];

// **********Logic for fatching objects from github*************

// Variables for array and localStorage
let storage = localStorage.id;
let niz = [];

// With this little code we make sure to dont put undefined value into array
if(storage != undefined){
let storageParse = JSON.parse(storage);
storageParse.forEach( (e) => {
	niz.push(e);
});

}

// 	Const for geting "ol" element and url for users
const ol = document.querySelector('.body_pop');
const url = 'https://api.github.com/users';


// Fatching data from github  for all users, single user and removing users found in local storage
fetch(url)
	.then((resp) => resp.json())					   // Convert respone into JSON
	.then((data) => {
  	let authors = data;

    return authors.map(function(author) {
      
      let li = createNode('li');                       // Create <li> for every element in node
      let span = createNode('span');				   // Create <span> for every element in node
      
      li.setAttribute("class", "li");                  // On ALL <li> created put class="li" so we can select only "li" that we create not all <li> from page
      li.setAttribute("data-id", `${author.id}`);      // On ALL <li> created put atribute data-id="" and fill it with data.id (id is diffrent for every fetched user) so we can select particular one
      li.style.listStyleType = 'none';				   // Remove annoying dots from unoreder list 
      span.innerHTML = `${author.id}.${author.login}`; // Put fatched data into <span>


      li.addEventListener('click', () => {

		
		niz.push(li.dataset.id);                       // Get value of data-set-id in a current <li> and put that value in array
		var nizTxt = JSON.stringify(niz);              // Parse array into string so it can be use by fetch() method
		appendData("id" ,nizTxt);					   // Put new value into local storage 
		userCall(author.url); 						   // Fetching single user


		document.querySelector('#loadercont2').style.visibility ='visible';
		

		setTimeout( () => {
			document.querySelector('.popOne').style.visibility = 'visible';
			document.querySelector('#loadercont2').style.visibility ='hidden';}, 700);	  // Show element with info about single user;
		})
     
      append(li, span);							       // Put new created and filled <span> into <li>
      append(ol, li);								   // Put filled <li> into <ul>
    })
  })
	.then(() => searchLi())                            // Remove <li> from <ul> if id from atribute "data-id" coincide with id from localstorage.id

    .catch((error) => {                                // Show error if didnt get fetched data
      console.log("Error!---> " + error);
      alert("Error!---> " + error);
  });  


//**********Functions*************

// Function for creating node which we need
function createNode(element) {
    return document.createElement(element);
}

// Function for puting element into parent node
function append(parent, el) {
    return parent.appendChild(el);
}

// Function for fetching single user from github api
function userCall(userUrl) {
	fetch(userUrl)
  .then((resp) => resp.json())
  .then(function(data) {

  	h1.innerHTML =data.login;
  	if(data.company != null){
  		comp.innerHTML = "<br>" + data.company;
   	}else {
   		comp.innerHTML = "<br> No-Company :(";
   	}
  	rep.innerHTML = "<br>" + data.public_repos;
  	git.innerHTML = "<br>" + data.public_gists;
  	pic.setAttribute('src', data.avatar_url);

  	comp.style.fontWeight = 1000;
  	rep.style.fontWeight = 1000;
  	git.style.fontWeight = 1000;

    })	
  .catch(function(error) {
    console.log(JSON.stringify(error));
  });
}

// Function for filtering out stored user's
function  localFilter(element, niz) {
 	for (var i=0 ; i < niz.length; i++ ) {
		if (niz[i] == element.dataset.id){
			console.log(element);
 			element.remove(); 
		}
	}
}

// Function for append old localStorage data and a new one
function appendData (nameOld, dataNew) {
	let dataOld = localStorage.getItem(nameOld);
	if (dataOld === null) {
		dataOld = "";	
	}
	localStorage.setItem(nameOld,  dataNew);
}

// Function for removing <li> from <ul> if they are found in local storage
function searchLi() {
var myLi = document.querySelectorAll('.li');
myLi.forEach( function(elTablice) {
	niz.forEach( function(elNiza) {
		if( elNiza == elTablice.dataset.id){
			elTablice.remove();
		}
	});
});
}


