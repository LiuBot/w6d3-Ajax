const FollowToggle = require('./follow_toggle');
const UsersSearch = require('./users_search');

// Document ready callback 
$(()=> {
 $('.follow-toggle').each((i, button) => {
	    new FollowToggle(button);
	 });

  $('.users-search').each((i, search) => {
	    new UsersSearch(search);
	 });
}); 