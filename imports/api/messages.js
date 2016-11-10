import { Mongo } from 'meteor/mongo';

const Messages = new Mongo.Collection('messages');

export default Messages;

if (Meteor.isServer) {
	Meteor.publish('messages', function messagePublication (selected) {
		if (this.userId) {
			if (selected != undefined) {
				return Messages.find(
					{$or:[	{to: this.userId, from: selected},
						{to: selected, from: this.userId}
					]},
				       	{sort: {createdAt: -1}, limit: 5});
			} else {
				return Messages.find({to: null}, {sort: {createdAt: -1}, limit: 5});
			}
		}
		self.ready();
	});

	Meteor.methods({
		'messages.insert' (text, to) {
			if (!this.userId) {
				throw new Meteor.error("Login to post.");
			}

			Messages.insert({
				text: text,
				createdAt: new Date(),
				from: this.userId,
				to: to
			});
		},
	});

}
