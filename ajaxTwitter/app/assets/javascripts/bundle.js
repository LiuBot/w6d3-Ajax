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
	const TweetCompose = __webpack_require__(3);
	
	// Document ready callback 
	$(()=> {
	 $('.follow-toggle').each((i, button) => {
		    new FollowToggle(button);
		 });
	
	  $('.users-search').each((i, search) => {
		    new UsersSearch(search);
		 });
	
	  $('.tweet-compose').each((i, post) => {
	    new TweetCompose(post);
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
	
	// Last, we want to add follow toggle buttons for 
	// each of these results. When building the li tags
	 // for each user, build a button, too. 
	
	 // You can create a FollowToggle instance for the button to setup the follow toggle.
	
		renderResults(users){
			this.ul.empty(); // same as .html("") but faster
	
			$(users).each((i, user) =>{
				
				let a = $('<a></a>').attr('href', `/users/${user.id}`).html(user.username);
				let li = $('<li></li>');
	
	      let followButton = $('<button></button');
	
	      new FollowToggle(followButton, {
	        userId: user.id,
	        followState: user.followed ? 'followed' : 'unfollowed'
	      });
	      // a.append(followButton);
	      li.append(a);
	      this.ul.append(li);
	    });
	  }
	}
	
	
	
	// Now, let's set up your controller to respond to AJAX requests with JSON. Because your 
	// controller will be handling both HTML and JSON requests, let's separate out each of those 
	// types of requests and respond to them separately. Put the following code into your 
	// controller to replace the line reading render :search:
	
	
	module.exports = UsersSearch; 

/***/ },
/* 3 */
/***/ function(module, exports) {

	
	class TweetCompose {
		constructor(el){
			this.el = $(el);
			this.post = this.el.find('[name="tweet[content]"]');
	
			this.post.on("input", this.handleInput.bind(this));
	
	
			this.el.on("submit", this.submit.bind(this));
		}
	
	// Finally, let's add a counter that will show the number of characters remaining 
	// for a tweet (starting at 140). Add a strong tag with class .chars-left to the 
	// form. In the TweetCompose constructor, add an input event handler on the 
	// textarea. In it, update the strong tag with the number of characters remaining.
	
	
		handleInput(event){
			const tweetLength = this.post.val().length;
			if (tweetLength > 140){
				this.el.find(".chars-left").html(`Post too long by ${tweetLength-140} characters!`)
			} else{
			this.el.find(".chars-left").html(`Characters remaining: ${140-tweetLength}`);
				
			}
		}
	
	
	// In the TweetCompose constructor, install a submit event handler. Write a 
	// TweetCompose#submit method that uses serializeJSON to build JSON from the form 
	// contents and use $.ajax to submit the form.
	
	// As before, disable the form when the submit is made. 
	//You can't disable an entire form, so you'll have to disable all the inputs. To get all the inputs, 
	// use jQuery's :input pseudo-CSS selector. Make sure not to disable your inputs 
	// until after you've serialized the form contents, or their values will be 
	// ignored. :(
	
		submit(event){
			event.preventDefault();
	
			const data = this.el.serializeJSON(); // serialize the form contents first
			this.el.find(":input").prop("disabled", true); // then disable inputs while ajax request is
			// being made 
	
			$.ajax({
				url: '/tweets',
				dataType: 'json',
				method: 'POST',
				data: data,
				success: this.handleSuccess.bind(this)
			})
		}
	
		handleSuccess(tweet){
			this.el.find(":input").prop("disabled", false);
			this.addTweet(tweet);
			this.clearInput();
		}
	// Write a TweetCompose#clearInput method to empty out all the inputs after a 
	// tweet is successfully created. 
	
		addTweet(tweet){
			const tweetsUl = $(this.el.data('tweets-ul'));
			let li = $('<li>');
	
			li.append(tweet.content);
			li.append(` -- <a href="/users/${tweet.user.id}">${tweet.user.username}</a>`);
		  li.append(` -- ${tweet.created_at}`);
			
			tweetsUl.prepend(li);
	
		}
		clearInput(){
			this.post.val("");
			this.el.find(".chars-left").empty();
		}
	
	// Write a TweetCompose#handleSuccess method. This should call clearInput and re-enable the form.
	
	// In #handleSuccess, we also want to insert the created tweet into the list of 
	// all tweets. How does TweetCompose find the ul of tweets? We can set a data 
	// attribute on the form where the value is the selector that corresponds to the 
	// target ul. For example, if we give the target ul an id of #feed, we can give 
	// our form the following data attribute: data-tweets-ul="#feed". Our TweetCompose 
	// can pull out this data attribute and use the selector #feed to find the ul. 
	// This is better than hard coding #feed into the JS.
	
	}
	
	
	
	
	
	// A successful AJAX post request for a tweet should return back the newly created 
	// tweet in JSON format. For simplicity, have TweetCompose call JSON.stringify on 
	// the created Tweet. Build an li with the JSON content, and stick it in the ul. 
	// We'll actually render this nicely in a later phase.
	
	
	module.exports = TweetCompose;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map