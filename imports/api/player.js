import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {
	Meteor.publish("userPosition", function () {
		console.log("Publishing user pos")
		return Meteor.users.find({_id: this.userId}, {fields: {'position': 1}});
	});
}
