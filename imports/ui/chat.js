import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import Messages from '../api/messages';
 
import './chat.html';


Template.body.helpers({	messages () { return Messages.find({}, {limit:5});}});

Template.body.events({
	'submit .new-message' (event) {
		event.preventDefault();
		const target = event.target;
		const text = target.text.value;
		const to = Session.get("selected");

		Meteor.call('messages.insert', text, to);

		target.text.value = '';
	},
});
