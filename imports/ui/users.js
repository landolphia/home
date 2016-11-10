import { Template } from 'meteor/templating';

import './users.html';

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
			       Session.set("selected", this._id);
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

Template.user.helpers({
	currentuser: function () {
		if (Meteor.user()) return this._id == Meteor.user()._id;
	},
	selected: function () {
		let selected = Session.get('selected');
		if (Meteor.user() && selected) return this._id == selected;
	},
});
