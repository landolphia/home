import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import '../imports/api/users.js';
import '../imports/api/messages.js';

import Messages from '../imports/api/messages';


Meteor.startup(() => {
});

Meteor.methods({
	'getUserPosition': function(id) {
		let user = Meteor.users.findOne(id, {fields: {"position": 1}});
		return user.position;
	},
	'player.setPosition': function(move) {
		if (move.x<0) move.x = 0;
		if (move.y<0) move.y = 0;
		if (move.x>300) move.x = 300;
		if (move.y>300) move.y = 300;
		Meteor.users.update(this.userId, {$set: {"position": move}});
	},
	'player.updatePosition': function(move) {
		let position = Meteor.user().position;
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
