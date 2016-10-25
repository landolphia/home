import { Template } from 'meteor/templating';

import PIXI from 'pixi.js';
 
import './world.html';

Template.body.onRendered = function () {
	console.log("Hey ho");
	let stage = new PIXI.Container();
	let renderer = PIXI.autoDetectRenderer(100, 100);

	let rectangle = new PIXI.Graphics();
	let line = new PIXI.Graphics();

	let homeMessage = new PIXI.Text(
		"Home user",
		{font: "16px sans-serif", fill: "white"}
	);

	let guestMessage = new PIXI.Text(
		"Guest user",
		{font: "16px sans-serif", fill: "grey"}
	);

	renderer.view.style.border = "2px dashed red";

	let container = document.getElementById("worldContainer");
	container.appendChild(renderer.view);

	setup();

	function theloop() {
		if (Meteor.userId() && Meteor.user())
			homeMessage.text = Meteor.user().username;
		else	homeMessage.text = "ANON";
		requestAnimationFrame(theloop);
		renderer.render(stage);
	};

	function setup() {
		rectangle.beginFill(0x22CC22);
		rectangle.lineStyle(4, 0xDD44DD, 0.3);
		rectangle.drawRect(0, 0, 90, 90);
		rectangle.endFill();
		rectangle.x = 5;
		rectangle.y = 5;
		stage.addChild(rectangle);

		line.lineStyle(2, 0x2222DD, 1);
		line.moveTo(0, 0);
		line.lineTo(80, 0);
		line.x = 10;
		line.y = 50;
		stage.addChild(line);
		
		homeMessage.x = 5;
		homeMessage.y = 10;
		stage.addChild(homeMessage);
		guestMessage.x = 15;
		guestMessage.y = 75;
		stage.addChild(guestMessage);

		renderer.render(stage);
		theloop();
	}
};
