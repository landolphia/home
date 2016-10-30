import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {
	Meteor.publish("usersOnline", function () {
		return Meteor.users.find({"status.online": true});
	});
}
