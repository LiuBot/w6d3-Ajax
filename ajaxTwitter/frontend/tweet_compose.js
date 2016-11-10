
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