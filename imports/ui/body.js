import { Template } from 'meteor/templating';
 
import './body.html';

import PIXI from 'pixi.js';

Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('usersOnline');
});

Template.body.helpers({
	player: function () {
		return Meteor.user().username;
	},
	usersOnline: function () {
		return Meteor.users.find({"status.online":true});
	},
});

Template.body.onRendered = function () {
	var stage = new PIXI.Container();
	var renderer = PIXI.autoDetectRenderer(500, 500);
	document.body.appendChild(renderer.view);
	PIXI.loader
		.add("coffee", "https://dl.dropboxusercontent.com/u/139992952/coffee.png")
		.load(setup);
	var block;

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

	var theloop = function(){
		requestAnimationFrame(theloop);
		block.rotation += .03;
		renderer.render(stage);
	};
};
