import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {
	Meteor.publish("usersOnline", function () {
		return Meteor.users.find({"status.online" : true});
	});

	Meteor.publish("users", function () {
		return Meteor.users.find({});
	});
}

if (Meteor.isClient) {
	Meteor.subscribe('usersOnline');
	Meteor.subscribe('users');
}
