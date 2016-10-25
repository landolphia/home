import { Template } from 'meteor/templating';

import { Messages } from '../api/messages.js';
 
import './chat.html';


Template.body.helpers({
	messages () {
		if (Meteor.user()) {
			let selected = Session.get("selected");
			if (selected != null) {
				return Messages.find(
					{$or:[
						{to: Meteor.user()._id, from: selected},
						{from: Meteor.user()._id, to: selected}]},
				       	{ sort: { createdAt: -1}});
			} else {
				return Messages.find({to: null}, { sort: { createdAt: -1}});
			}
		} else { return [ {text: "You must be logged in to see the chat.", from: "System", createdAt: "Never"}];}
	},
});

Template.body.events({
	'submit .new-message' (event) {
		event.preventDefault();
		const target = event.target;
		const text = target.text.value;
		const from = Meteor.user()._id;
		const selected = Session.get("selected");
		const to = selected;

		Messages.insert({
			text: text,
			createdAt: new Date(),
			from: from,
			to: to
		});

		target.text.value = '';
	},
});
