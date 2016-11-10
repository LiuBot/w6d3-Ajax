
class TweetCompose {
	constructor(el){
		this.el = $(el);
		this.post = this.el.find('[name="tweet[content]"]');

		this.post.on("input", this.handleInput.bind(this));

		this.el.find('a.add-mentioned-user').click(this.addMentionedUser.bind(this));
		
		this.el.on("submit", this.submit.bind(this));
	}

		// In the TweetCompose constructor, add a listener for a click on a.add-mentioned-user. I
		 // wrote a TweetCompose#addMentionedUser method. 
		 // I used jQuery to find the script tag, 
		 // I grabbed the HTML from within using $scriptTag.html(), 
		 // then appended it into the mentioned-users div.

	addMentionedUser(event){
		event.preventDefault();

		const $scriptTag = this.el.find('script').html();
		this.el.find("div.mentioned-users").append($scriptTag);
	}

	removeMentionedUser(){

	}


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
}

module.exports = TweetCompose;