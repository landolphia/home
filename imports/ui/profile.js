import { Meteor }  from 'meteor/meteor';
import { Template } from 'meteor/templating';


import './profile.html';

Template.body.helpers({ color() {
	if ((Meteor.user() != undefined) && (Meteor.user().color != undefined)) {
		return Meteor.user().color;
	} else return "#FFFFFF";
}});

Template.body.events({
	'change #color' (event) {
		event.preventDefault();
		const target = event.target;
		const color = target.value;
		Meteor.call('player.setColor', color, function(error, result) {
			if (error) {
				console.log("Couldn't set player color.");
			} else {
				console.log("Player color saved.");
			}
		});
	},
});
