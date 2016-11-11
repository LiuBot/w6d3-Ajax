

class InfiniteTweets {
	constructor(el){
		this.el = $(el);
		this.el.on('click', ".fetch-more", this.fetchTweets.bind(this));
		this.maxCreatedAt = null;
		this.el.on('insert-tweet', (event, tweet, append) => {
      this.addTweet(tweet, append); // custom event
     })
	}

	fetchTweets(event){
		let that = this;
		event.preventDefault();

		let data = {}; // blank data object

		if (this.maxCreatedAt){ // if maxCreatedAt is not null (aka we're not starting from the beginning)
			data.max_created_at = this.maxCreatedAt;
		}

		$.ajax({
			url: '/feed',
			data: data,
			dataType: 'json',
			method: 'GET', // grabbin tweets
			success: (tweets)=>{ // here are tweets it grabbed 
				if (tweets.length < 20) {
					$('.fetch-more').remove();
					that.el.append('<h3>No more tweets!</h3>');
				} else { // if there's less than 20 in the new batch of tweets 
					that.maxCreatedAt = tweets[tweets.length - 1].created_at // creation time of last tweet
					that.insertTweets(tweets);
				}
			}
		})

	}


	insertTweets(tweets){ // this grabs the collection of tweets 
		$(tweets).each((i,tweet)=>{
			 $('#feed').trigger('insert-tweet', tweet);
		})
	}


	addTweet(tweet, append=true){ // reused from tweet_compose.js
		// adds individual tweets 
		let tweetsUl = $(this.el.find('#feed'))
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

    if (append){
		tweetsUl.append(li);
    } else{
    	tweetsUl.prepend(li);
    }
	}
}

module.exports = InfiniteTweets;