import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import Items from '../api/items';

import './inventory.html';


Template.body.helpers({ items () { return Items.find({});}});
Template.body.helpers({ inventory () { return false;}});

Template.body.events({
	'click li' (event) {
		event.preventDefault();
		const target = event.target;
		const src = target.src;
		const alt = target.alt;

		console.log("This is the pic's source: " + src);
		console.log("This is the pic's alt   : " + alt);
	},
	'click #reset' (event) {
		event.preventDefault();

		Meteor.call('dummyGen');
	},
});
