const FollowToggle = require('./follow_toggle');


// Document ready callback 
$(()=> {
 $('.follow-toggle').each((i, el) => {
	    new FollowToggle($(el));
	  });
});