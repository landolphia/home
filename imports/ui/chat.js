import { Template } from 'meteor/templating';

import { Messages } from '../api/messages.js';
 
import './chat.html';


Template.body.onCreated( function onBodyCreated() {
	Meteor.subscribe('messages');
});

Template.body.helpers({	messages () { return Messages.find();}});

Template.body.events({
	'submit .new-message' (event) {
		event.preventDefault();
		const target = event.target;
		const text = target.text.value;
		const from = Meteor.user()._id;
		const selected = Session.get("selected");
		const to = selected;

		Meteor.call('messages.insert', text, from, to);

		target.text.value = '';
	},
});
