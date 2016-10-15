import { Template } from 'meteor/templating';
 
import './body.html';

import PIXI from 'pixi.js';

Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('usersOnline');
});

Template.body.helpers({
	player: function () {
		if (Meteor.userId() && Meteor.user())
			return Meteor.user().username;
		else
			return "Log in to access more features";
	},
	usersOnline: function () {
		return Meteor.users.find({"status.online":true});
	},
});

Template.body.onRendered = function () {
	let stage = new PIXI.Container();
	let renderer = PIXI.autoDetectRenderer(100, 100);
	document.body.appendChild(renderer.view);
	PIXI.loader
		.add("coffee", "https://dl.dropboxusercontent.com/u/139992952/coffee.png")
		.load(setup);
	let block;

	function setup() {
		block = new PIXI.Sprite(PIXI.loader.resources.coffee.texture);  
		block.anchor.x = 0.5;
		block.anchor.y = 0.61;

		block.position.x = 200;
		block.position.y = 150;
		stage.addChild(block);
		renderer.render(stage);
		theloop();
	}

	let theloop = function(){
		requestAnimationFrame(theloop);
		block.rotation += .03;
		renderer.render(stage);
	};
};
