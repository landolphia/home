import { Mongo } from 'meteor/mongo';

const Items = new Mongo.Collection('items'); 

export default Items;


if (Meteor.isServer) {
	Meteor.publish('items', function itemsPublication () {
		return Items.find();
	});

	Meteor.methods({
		//'inventory.add' (id, qty) {
		//	if (this.userId) {
		//		Items.insert({
		//			owner:	this.userId,
		//			uid:	id,
		//			qty: qty
		//		});
		//	}
		//},
		'dummyGen' () {
			Items.remove({});
			Items.insert({ 'name' : 'Pencil', 'src' : 'placeholder.png', 'alt' : 'Mightier than a sword.'});
			Items.insert({ 'name' : 'Condom', 'src' : 'placeholder.png', 'alt' : 'Better safe than daddy.'});
			Items.insert({ 'name' : 'Bucket', 'src' : 'placeholder.png', 'alt' : 'Kick it.'});
		},
	});
}

if (Meteor.isClient) {
	Meteor.subscribe('items');
}
