import { Template } from 'meteor/templating';

import './users.html';


Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('usersOnline');
});

Template.body.helpers({
	player: function () {
		if (Meteor.userId() && Meteor.user())
			return Meteor.user().username;
		else
			return "Log in to access more features";
	},
	position: function () {
		console.log("Hitting Template.body.helpers position in ui/users.js");
		if (Meteor.userId() && Meteor.user())
			return Meteor.user().position;
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
		       } else {
			       Session.set("selected", null);
		       }
		}
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
