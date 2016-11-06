import { Template } from 'meteor/templating';

import PIXI from 'pixi.js';
 
import './world.html';


Template.body.onRendered = function () {
	var interactive = true;
	let renderer = PIXI.autoDetectRenderer(300, 300);
	renderer.backgroundColor = 0xC0C0C0;
	let stage = new PIXI.Container();//Stage(0x66FF99, interactive);

	let rectangle = new PIXI.Graphics();
	let line = new PIXI.Graphics();
	
	var homeSprite = PIXI.Sprite.fromImage('placeholder.png');
	var guestSprite = PIXI.Sprite.fromImage('placeholder.png');
	guestSprite.rotation = 3.14159;

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

	function getClickPosition(e) {
		Meteor.call('player.setPosition', {x: event.layerX, y: event.layerY});
		console.log(event.layerX);
		console.log(event.layerY);
	}
	container.addEventListener("click", getClickPosition, false);

	setup();

	let selected = undefined;

	let lastUpdate = Date.now();
	let delta = 0;
	let lastDBUpdate = Date.now() - 1000;
	let DBUpdateRate = 500;

	function theloop() {
		//local stuff


		//not local stuff
		now = Date.now();
		delta = now - lastUpdate;
		lastUpdate = now;

		if ((lastUpdate > (lastDBUpdate + DBUpdateRate)) &&
		(Meteor.userId() && Meteor.user())) {
			console.log("Updating Data: " + now);
			lastDBUpdate = lastUpdate;

			selected = Session.get("selected");
			guestSprite.visible = (selected!=undefined);
			if (guestSprite.visible) {
				Meteor.call('getUserPosition', selected, function(error, result) {
					if (error) {
						console.log("Couldn't retrieve user position for user#"+ selected);
					} else {
						guestSprite.position.x = result.x;
						guestSprite.position.y = result.y;
					}
				});
			}

			homeSprite.position.x = Meteor.user().position.x;
			homeSprite.position.y = Meteor.user().position.y;
			homeMessage.text = Meteor.user().username;
		}

		requestAnimationFrame(theloop);
		renderer.render(stage);
	};

	function setup() {
		//		rectangle.beginFill(0x22CC22);
//		rectangle.lineStyle(4, 0xDD44DD, 0.3);
//		rectangle.drawRect(0, 0, 90, 90);
//		rectangle.endFill();
//		rectangle.x = 5;
//		rectangle.y = 5;
//		stage.addChild(rectangle);
//
//		line.lineStyle(2, 0x2222DD, 1);
//		line.moveTo(0, 0);
//		line.lineTo(80, 0);
//		line.x = 10;
//		line.y = 50;
//		stage.addChild(line);
//		
//		homeMessage.x = 5;
//		homeMessage.y = 10;
//		stage.addChild(homeMessage);
//		guestMessage.x = 15;
//		guestMessage.y = 75;
//		stage.addChild(guestMessage);

		homeSprite.anchor.x = 0.5;
		homeSprite.anchor.y = 0.5;
		guestSprite.anchor.x = 0.5;
		guestSprite.anchor.y = 0.5;

		stage.addChild(homeSprite);
		stage.addChild(guestSprite);

		renderer.render(stage);
		theloop();
	}
};
