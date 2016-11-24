import { Mongo } from 'meteor/mongo';

const Worlds = new Mongo.Collection('worlds');

export default Worlds;

if (Meteor.isServer) {
	Meteor.publish('world', function worldPublication (id) {
		if (this.userId) {
			if (id != undefined) {
				return Worlds.findOne(id);
			}
		}
	});

	Meteor.methods({
		'createWorld' (users) {
			console.log("createWorld called with: ");
			console.log(users);
			let what = (Array.isArray(users)); 
			console.log(what);
			if (users.length >= 2) {
				console.log("Create new world.");
				console.log("Initialize messages and positions for starters.");
			}
		}
	});
}
