
class TweetCompose {
	constructor(el){
		this.el = $(el);
		this.post = this.el.find('[name="tweet[content]"]');
		this.post.on("input", this.handleInput.bind(this));

		this.el.find('.add-mentioned-user').click(this.addMentionedUser.bind(this));
		this.el.on('click','.remove-mentioned-user',this.removeMentionedUser);

		this.el.on("submit", this.submit.bind(this));
	}

		// In the TweetCompose constructor, add a listener for a click on a.add-mentioned-user. I
		 // wrote a TweetCompose#addMentionedUser method. 
		 // I used jQuery to find the script tag, 
		 // I grabbed the HTML from within using $scriptTag.html(), 
		 // then appended it into the mentioned-users div.

	addMentionedUser(event){
		event.preventDefault();

		let $scriptTag = this.el.find('script').html();
		this.el.find(".mentioned-users").append($scriptTag);
	}


// In the TweetCompose constructor, I listened for click events on a.remove-mentioned-user. 
// You have to use event delegation here: why? I wrote a TweetCompose#removeMentionedUser 
// which used the event.currentTarget to learn which remove anchor tag was clicked, 
// and removed the parent div element. This removes both the anchor tag and the select, too.

	removeMentionedUser(event){
		event.preventDefault();
		// used the event.currentTarget to learn which remove anchor tag was clicked, 
		$(event.currentTarget).parent().remove(); //This removes both the anchor tag and the select, too.
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

	  if (tweet.mentions.length > 0) {
      let mentionUl = $('<ul>');

     $(tweet.mentions).each((i,mention)=>{
     	let mentionLi = $('<li>');
     	mentionLi.append(`<a href="/users/${mention.user.id}">${mention.user.username}</a>`);
     	mentionUl.append(mentionLi);
     });
     li.append(mentionUl); // li here is the li for the tweet
    }

		tweetsUl.prepend(li);
	}

	clearInput(){
		this.post.val("");
		this.el.find('.clear-this').empty();
		this.el.find(".chars-left").empty();
	}
}

module.exports = TweetCompose;