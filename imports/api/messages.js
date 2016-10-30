import { Mongo } from 'meteor/mongo';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
	Meteor.publish('messages', function messagePublication() {
		if (this.userId) {
			let selected = null;
			if (selected != null) {
				return Messages.find(
					{$or:[
						{to: this.userId, from: selected},
						{to: selected, from: this.userId}
					]},
					{ sort: { createdAt: -1}});
			} else {
				return Messages.find({to: null}, { sort: { createdAt: -1}});
		}
	} else {
		return [ { text: "You must be logged in to use the chat.", from: "System", createdAt: "--/--/--"}];
	}
	},
	);
}

Meteor.methods({
	'messages.insert'(text, from, to) {
		Messages.insert({
			text: text,
			createdAt: new Date(),
			from: from,
			to: to
		});
	}
});
