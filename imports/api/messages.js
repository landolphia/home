import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
	Meteor.publish('messages', function messagesPublication() {
		return Messages.find();
	});
}

Meteor.methods({
});
	//Meteor.publish('messages', function messagePublication (selected) {
	//	if (this.userId) {
	//		if (selected != null) {
	//			return Messages.find(
	//				{$or:[
	//					{to: this.userId, from: selected},
	//					{to: selected, from: this.userId}
	//				]},
	//				{ sort: { createdAt: -1}, limit:5});
	//		} else {
	//			return Messages.find({to: null}, { sort: { createdAt: -1}, limit: 5});
	//	}
	//} else {
	//	return [ { text: "You must be logged in to use the chat.", from: "System", createdAt: "--/--/--"}];
	//}
	//},
	//);
