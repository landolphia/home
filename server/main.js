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

Meteor.methods({
	'player.updatePosition': function(move) {
		let position = Meteor.user().position;
		console.log("position: " + position.x);
		if (position == undefined)  position = {x:0,y:0};
		position.x += move.x;
		position.y += move.y;
		if (position.x<0) position.x = 0;
		if (position.y<0) position.y = 0;
		if (position.x>300) position.x = 300;
		if (position.y>300) position.y = 300;
		Meteor.users.update(this.userId, {$set: {"position": position}});
	},
});
