import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import Items from '../api/items';

import './inventory.html';


Template.body.helpers({
       	items () { return Items.find({});},
	inventory () {
		if (Meteor.user()) return Meteor.user().inventory;
	}
});

Template.inventorySlot.helpers({
       	getItemName () {
		let result = ReactiveMethod.call("getItemName", this.id);
		return result;
	},
});

Template.body.events({
	'click #addPen' (event) {
		event.preventDefault();
		Meteor.call('addItem', "Pencil", 1);
	},
	'click #addCondom' (event) {
		event.preventDefault();
		Meteor.call('addItem', "Condom", 1);
	},
	'click #addBucket' (event) {
		event.preventDefault();
		Meteor.call('addItem', "Bucket", 1);
	},
	'click #empty' (event) {
		event.preventDefault();
		Meteor.call('emptyInventory');
	},
	'click #reset' (event) {
		event.preventDefault();
		Meteor.call('dummyGen');
	},
});
