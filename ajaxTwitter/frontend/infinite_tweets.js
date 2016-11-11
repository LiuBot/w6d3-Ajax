

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

		li.append(`<img class="mini-icon" src="https://static1.squarespace.com/static/522f256de4b088d34db9a62f/5251f557e4b0b9b7feb030a6/525213a1e4b0ec712549e701/1381148510163/twitter+favicon+1200x974.png"
  height="30px" width="auto">`)
		li.append(tweet.content);
		li.append(` -- <a href="/users/${tweet.user.id}">${tweet.user.username}</a>`);
	  li.append(` -- ${tweet.created_at}`);

	  if (tweet.mentions.length > 0) {
      let mentionUl = $('<ul>');

     $(tweet.mentions).each((i,mention)=>{
     	let mentionLi = $('<li>');
     	mentionLi.append(`<a href="/users/${mention.user.id}">@${mention.user.username}</a>`);
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