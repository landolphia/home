import { Meteor } from 'meteor/meteor';

import Items from './items.js';

if (Meteor.isServer) {
	Meteor.methods({
		'addItem' : function (name, qty) {
			let item = Items.findOne({'name' : name});
			if ( item != undefined ) {
				console.log("Found the item [" + item._id + "]");
				let user = Meteor.users.findOne(this.userId, {fields: {"inventory" : 1}});
				let inventory = user.inventory;
				if (inventory == undefined) inventory = new Array();
				let found = false;
				inventory.forEach( function (i) {
					if (i.id == item._id) {
						i.qty += qty;
						found = true;
					}
				});

				if (!found) inventory.push({"id" : item._id, "qty" : qty});
				Meteor.users.update(this.userId, {$set : {"inventory" : inventory}});
			} else {
				console.log("[" + name + "] isn't a valid item name.");
			}

		},
		'emptyInventory' : function () {
			console.log("Clearing inventory");
			let inventory = new Array();
			Meteor.users.update(this.userId, {$set : {"inventory" : inventory}});
		},
		'getUserName' : function (id) {
			let user = Meteor.users.findOne(id, {fields: {"username" : 1}});
			let result = user.username;
			if (result == undefined) { result = "<unnamed>";}
			return result;
		},
		'getUserColor' : function (id) {
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
			if (this.userId) {
				if (move.x<0) move.x = 0;
				if (move.x>300) move.x = 300;
				if (move.y<0) move.y = 0;
				if (move.y>300) move.y = 300;
				Meteor.users.update(this.userId, {$set : {"position" : move}});
				return move;
			} else return {x: -1, y: -1};
		},
		'player.updatePosition': function (move) {
			if (this.userId) {
				let position = Meteor.user().position;
				if (position == undefined) position = {x:0,y:0};
				position.x += move.x;
				position.y += move.y;
				if (position.x<0) position.x = 0;
				if (position.x>300) position.x = 300;
				if (position.y<0) position.y = 0;
				if (position.y>300) position.y = 300;
				Meteor.users.update(this.userId, {$set : {"position" : position}});
				return position;
			} else return {x: -1, y: -1};
		},
	});
}
