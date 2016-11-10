class FollowToggle {
	constructor($el, options){
		this.el = $el;
		this.userId= $el.data('user-id') || options.userId;
		this.followState = $el.data('initial-follow-state') || options.followState;
		this.render();

		this.el.click(this.handleClick.bind(this));
	}

	render(){
		let text = this.followState === 'followed' ? 'Unfollow!' : 'Follow!';

		this.el.text(text);
	}

	handleClick(event){
		event.preventDefault(); 

		switch (this.followState){
			case 'followed':
				this.unfollow();
				break;
			case 'unfollowed':
				this.follow();
				break;
		}
	}

	follow(){
		this.makeRequest('POST', 'followed');
	}
	unfollow(){
		this.makeRequest('DELETE', 'unfollowed');
	}


	makeRequest(type, followState){
		let that = this;

		$.ajax({
			url: `/users/${that.userId}/follow`,
			type: type,
			dataType: 'json', 
			success(){
				that.followState = followState;
				that.render();
			}
		});
	}
}


module.exports = FollowToggle; // this makes it require-able