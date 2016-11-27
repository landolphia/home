import { Template } from 'meteor/templating';

import './users.html';
import '../api/users.js';
import '../api/player.js';

//import Messages from '../api/messages.js';

//var messageHandler = false;

Tracker.autorun( function () {
	if (Meteor.userId()) {
		Meteor.subscribe('usersOnline');
		Meteor.subscribe('users');
		//messageHandler = Meteor.subscribe('messages', undefined);
	}
});

Template.body.helpers({
	worlds: function () {
		if (Meteor.userId() && Meteor.user() && Meteor.user().worlds) {
			return Meteor.user().worlds;
		} else { 
			return [{_id:"No worlds"}];
		}
	},
	onlineOnly: function () {
		let result = Session.get("userListFilter");
		if ((result != undefined) &&
		       (result == "Online"))	{
			       return true;
		}
		return false;
	},
	player: function () {
		if (Meteor.userId() && Meteor.user())
			return Meteor.user().username;
		else
			return "Log in to access more features";
	},
	position: function () {
		if (Meteor.userId() && Meteor.user()) {
			let p = Meteor.user().position;
			if ( p != undefined ) return "[" + p.x + "/" + p.y + "]";
			else return "--";
		}
	},
	allUsers: function () {
		return Meteor.users.find({});
	},
	usersOnline: function () {
		return Meteor.users.find({"status.online":true});
	},
});

Template.user.events({
	'click li' (event) {
		event.preventDefault();
		if (Meteor.user()) {
		       if (Meteor.user()._id != this._id) {
			       let selected = Session.get("selected");
			       if (selected == undefined) {
				       selected = new Array();
				       selected.push(Meteor.user()._id);
			       }
			       if (!selected.includes(this._id)) {
				       selected.push(this._id);
			       } else {
				       let index = selected.indexOf(this._id);
				       if (index > -1) {
					       selected.splice(index, 1);
				       }
			       }

			       Session.set("selected", selected);
			       //var newHandler = Meteor.subscribe('messages', this._id);
		       } else {
			       Session.set("selected", undefined);
			       //var newHandler = Meteor.subscribe('messages', undefined);
		       }
		}

		//if (messageHandler) messageHandler.stop();
		//messageHandler = newHandler;
	},
});

Template.createWorld.events({
	'click #newWorld' (event) {
		event.preventDefault();
		if (Meteor.userId()) {
			let selected = Session.get("selected");
			if (selected != undefined) {
				Meteor.call('createWorld', selected);
			}
		}
	},
});

Template.createWorld.helpers({
	selection: function () {
		let selected = Session.get("selected");
		return (selected != undefined &&
			Array.isArray(selected) &&
			selected.length >= 2);
	},
	existing: function () {

		console.log("Checks if an existing world with the selected users exists");
		return false;
	},
});

Template.user.helpers({
	currentuser: function () {
		if (Meteor.user()) return this._id == Meteor.user()._id;
	},
	selected: function () {
		let userId = this._id;
		let result = false;
		if (Meteor.user()) {
			let selected = Session.get('selected');

			if (Array.isArray(selected)) {
				selected.forEach(function (e) {
					if (e == userId) result = true;
				});
			}
		}
		return result;
	},
});

Template.onlineSwitch.helpers({
	onlineOnly: function () {
		let result = Session.get("userListFilter");
		if ((result != undefined) &&
		       (result == "Online"))	{
			       return true;
		}
		return false;
	},
});

Template.onlineSwitch.events({
	'click #userListFilter' (event) {
		event.preventDefault();
		let userListFilter= Session.get("userListFilter");
		if ((userListFilter != undefined) && (userListFilter == "All")){
			Session.set("userListFilter", "Online");
		} else {
			Session.set("userListFilter", "All");
		}
	},
});

Template.userWorld.helpers({
	'selected': function () {
		let result = Session.get("worldId");
		if (result != undefined) {
			return (result == this.id);
		}
	},
});

Template.userWorld.events({
	'click button' (event) {
		event.preventDefault();
		console.log("Setting world to " + this.id);
		Session.set("worldId", this.id);
	},
});
