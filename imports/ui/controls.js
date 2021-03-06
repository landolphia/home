import { Template } from 'meteor/templating';

import './controls.html';


Template.controls.events({
	'click button' (event) {
		event.preventDefault();
		if(Meteor.user()) {
			switch (event.currentTarget.id) {
				case 'rightButton': Meteor.call('player.updatePosition', {x: 1, y: 0}); break;
				case 'leftButton': Meteor.call('player.updatePosition', {x: -1, y: 0}); break;
				case 'upButton': Meteor.call('player.updatePosition', {x: 0, y: -1}); break;
				case 'downButton': Meteor.call('player.updatePosition', {x: 0, y: 1}); break;
				default: break;
			}
		}
	},
});
