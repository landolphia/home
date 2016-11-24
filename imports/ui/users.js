import { Template } from 'meteor/templating';

import './users.html';
import '../api/world.js';

import Messages from '../api/messages.js';

var messageHandler = false;

Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('usersOnline');
	messageHandler = Meteor.subscribe('messages', undefined);
});

Template.body.helpers({
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
			       }

			       Session.set("selected", selected);
			       // (This doesn't mean much anymore once I fold the messages into the world
			       var newHandler = Meteor.subscribe('messages', this._id);
		       } else {
			       Session.set("selected", undefined);
			       var newHandler = Meteor.subscribe('messages', undefined);
		       }
		}

		if (messageHandler) messageHandler.stop();
		messageHandler = newHandler;
	},
});

Template.worldButton.events({
	'click #newWorld' (event) {
		event.preventDefault();
		if (Meteor.userId()) {
			let selected = Session.get("selected");
			if (selected != undefined) {
				Meteor.call('createWorld', selected);
			}
		}

	},
	'click #joinWorld' (event) {
		event.preventDefault();
		console.log("Will join world.");
	},
});

Template.worldButton.helpers({
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
					console.log("testing: " + e + " vs " + userId);
					if (e == userId) result = true;
				});
			}
		}
		return result;
	},
});
