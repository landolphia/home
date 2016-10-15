import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import '../imports/api/users.js';
import '../imports/api/messages.js';

//Accounts.onCreateUser( function (options, user) {
//	console.log("user");
//	console.dir(user);
//	console.log("options");
//	console.dir(options);
//	return user;
//});

Meteor.startup(() => {
});
