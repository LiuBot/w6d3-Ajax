

const FollowToggle = require('./follow_toggle');

class UsersSearch{
	constructor(el){
		this.el = $(el);
    this.input = this.el.find("input[name=username]");
    this.ul = this.el.find(".users");

    this.input.on("input", this.handleInput.bind(this));
}

// Write a UsersSearch#handleInput handler. On each input event, make an AJAX request to 
// /users/search, sending the input's val as the query parameter. You can send query 
// parameters along with an $.ajax call through the data option. Don't forget to set 
// dataType!
handleInput(event){

	if (this.input.val() === ""){
		this.renderResults([]);
		return;
	}

	$.ajax({
		url: '/users/search', 
		dataType: 'json',
		method: 'GET',
		data: { query: this.input.val()},
		success: this.renderResults.bind(this)
		});
	}

	renderResults(users){
		this.ul.empty(); // same as .html("") but faster

		$(users).each((i,user) =>{
			let li = $('<li></li>');
			let a = $('<a></a>').attr('href', `/users/${user.id}`).html(user.username);
			
			li.append(a);
			this.ul.append(li);
		})
}
	
}


// Now, let's set up your controller to respond to AJAX requests with JSON. Because your 
// controller will be handling both HTML and JSON requests, let's separate out each of those 
// types of requests and respond to them separately. Put the following code into your 
// controller to replace the line reading render :search:


module.exports = UsersSearch; 