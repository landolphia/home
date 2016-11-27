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
			if (this.userId) {
				let inventory = new Array();
				Meteor.users.update(this.userId, {$set : {"inventory" : inventory}});
			}
		},
		'player.addWorld' : function (data) {
			console.log("data: " + data);
			check(data, {'user' : String, 'world' : String});
			let userId = data.user;
			let worldId = data.world;
			let user = Meteor.users.findOne(userId);
			let worlds = undefined;
			if (user != undefined) worlds = user.worlds;
			if (!Array.isArray(worlds)) worlds = new Array();

			let exists = false;
			worlds.forEach( function (w) {
				if (w.id == worldId) exists == true;
			});

			if (! exists) {
				worlds.push({'id' : worldId});
				Meteor.users.update(userId, {$set : { 'worlds' : worlds }});
			}
		},
		'player.getWorlds' : function () {
			if (this.userId) {
				let user = Meteor.users.findOne(id, { fields : { 'worlds' : 1 }});
				let worlds = user.worlds;
				return worlds;
			}
		},
		'getUserName' : function (id) {
			let user = Meteor.users.findOne(id, {fields: {"username" : 1}});
			if (user != undefined) {
				let result = user.username;
				if (result == undefined) { result = "<unnamed>";}
				return result;
			}
		},
		'getUserColor' : function (id) {
			let user = Meteor.users.findOne(id, {fields: {"color" : 1}});
			if (user != undefined) {
				let result = user.color;
				if (result == undefined) {
					result = "#DDDDDD";
					Meteor.users.update(this.userId, {$set : {"color" : result}});
				}
				return result;
			}
		},
		'getUserPosition' : function (id) {
			let user = Meteor.users.findOne(id, {fields : {"position" : 1}});
			if (user != undefined) {
				let position = user.position;
				if (position == undefined) {
					position = {x:0,y:0};
					Meteor.users.update(this.userId, {$set : {"position" : position}});
				}
				return position;
			}
		},
		'player.setColor': function (color) {
			if (this.userId) {
				if (color != undefined) {
					Meteor.users.update(this.userId, {$set : {"color" : color}});
				}
			}
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
