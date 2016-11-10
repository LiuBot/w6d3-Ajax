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