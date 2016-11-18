import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	Meteor.publish('inventory', function inventoryPublication () {
		if (this.userId) {
			console.log("This should return :  + Meteor.user().inventory");
			return null;
		}
	});

	Meteor.methods({
		'getUserName': function (id) {
			let user = Meteor.users.findOne(id, {fields: {"username" : 1}});
			let result = user.username;
			if (result == undefined) { result = "<unnamed>";}
			return result;
		},
		'getUserColor': function (id) {
			let user = Meteor.users.findOne(id, {fields: {"color" : 1}});
			let result = user.color;
			if (result == undefined) {
				result = "#DDDDDD";
				Meteor.users.update(this.userId, {$set : {"color" : result}});
			}
			return result;
		},
		'getUserPosition' : function (id) {
			let user = Meteor.users.findOne(id, {fields : {"position" : 1}});
			return user.position;
		},
		'player.setColor': function (color) {
			if (color != undefined) { Meteor.users.update(this.userId, {$set : {"color" : color}});}
		},
		'player.setPosition': function (move) {
			if (move.x<0) move.x = 0;
			if (move.x>300) move.x = 300;
			if (move.y<0) move.y = 0;
			if (move.y>300) move.y = 300;
			Meteor.users.update(this.userId, {$set : {"position" : move}});
		},
		'player.updatePosition': function (move) {
			let position = Meteor.user().position;
			if (position == undefined) position = {x:0,y:0};
			position.x += move.x;
			position.y += move.y;
			if (position.x<0) position.x = 0;
			if (position.x>300) position.x = 300;
			if (position.y<0) position.y = 0;
			if (position.y>300) position.y = 300;
			Meteor.users.update(this.userId, {$set : {"position" : position}});
		},
	});
}

if (Meteor.isClient) {
	Meteor.subscribe('inventory');
}
