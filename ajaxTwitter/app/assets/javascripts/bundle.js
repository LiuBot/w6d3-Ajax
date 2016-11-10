/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const FollowToggle = __webpack_require__(1);
	const UsersSearch = __webpack_require__(2);
	
	// Document ready callback 
	$(()=> {
	 $('.follow-toggle').each((i, button) => {
		    new FollowToggle(button);
		 });
	
	  $('.users-search').each((i, search) => {
		    new UsersSearch(search);
		 });
	}); 

/***/ },
/* 1 */
/***/ function(module, exports) {

	class FollowToggle {
		constructor(el){
			this.el = $(el);
			this.userId= this.el.data('user-id');
			this.followState = this.el.data('initial-follow-state') 
			this.render();
	
			this.el.click(this.handleClick.bind(this));
		}
	
		  handleClick(event) {
	    event.preventDefault();
	
	    if (this.followState === "followed") {
	      this.followState = "unfollowing";
	      this.render(); // ""
	      this.makeRequest("DELETE", "unfollowed")
	
	    } else if (this.followState === "unfollowed") {
	      this.followState = "following";
	      this.render();
	      this.makeRequest("POST", "followed")
	    }
	  }
	
	  makeRequest(type, followState){
	  	const that = this;
	  	$.ajax({
		    url: `/users/${this.userId}/follow`,
		    dataType: "json",
		    method: type,
		    success() {
		      that.followState = followState;
		      that.render();
		    }
		  });
		}
	
	  render() {
	    switch(this.followState){
	      case "followed":
	        this.el.prop("disabled", false);
	        this.el.html("Unfollow!");
	        break;
	      case "unfollowed":
	        this.el.prop("disabled", false);
	        this.el.html("Follow!");
	        break;
	      case "following":
	        this.el.prop("disabled", true);
	        this.el.html("Following...");
	        break;
	      case "unfollowing":
	        this.el.prop("disabled", true);
	        this.el.html("Unfollowing...");
	        break;
	    }
	  }
	
	}
	
	
	module.exports = FollowToggle; // this makes it require-able

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	
	const FollowToggle = __webpack_require__(1);
	
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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map