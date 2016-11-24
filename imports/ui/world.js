import { Template } from 'meteor/templating';

import PIXI from 'pixi.js';

import '../api/player.js';
 
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

	let homeMessage = new PIXI.Text("Home user", {font: "16px sans-serif"});
	let guestMessage = new PIXI.Text( "Guest user", {font: "16px sans-serif"});

	let container = document.getElementById("worldContainer");
	container.appendChild(renderer.view);

	function getClickPosition(e) {
		let x = { x: 0, y: 0};
		if ((e.offsetX != undefined) && (e.offsetY != undefined)) {
			p = {x : e.offsetX, y : e.offsetY};
		} else {
			let totalOffset = { x: 0, y: 0};
			let canvas = { x: 0, y: 0};
			let currentElement = container;

			do {
				totalOffset.x += currentElement.offsetLeft - currentElement.scrollLeft;
				totalOffset.y += currentElement.offsetTop - currentElement.scrollTop;
			} while (currentElement = currentElement.offsetParent)

			canvas.x = e.pageX - totalOffset.x;
			canvas.y = e.pageY - totalOffset.y;
			p = {x : canvas.x, y : canvas.y};
		}
		console.log("p= " + p.x + " / " + p.y);
		Meteor.call('player.setPosition', {x: p.x, y: p.y}, function (error, result) {
			if (error) {
				console.log("Failed to set player position.");
			} else {
				console.log("Succesfully set player position to : " + result.x + " / " + result.y);
			}
		});
	}
	container.addEventListener("click", getClickPosition, false);

	setup();

	let selected = undefined;

	let lastUpdate = Date.now();
	let delta = 0;
	let DBUpdateRate = 2000;
	let lastDBUpdate = Date.now() - DBUpdateRate;

	function theloop() {
		now = Date.now();
		delta = now - lastUpdate;
		lastUpdate = now;

		if ((lastUpdate > (lastDBUpdate + DBUpdateRate)) &&
		(Meteor.userId() && Meteor.user())) {
			console.log("Updating Data: " + now);
			lastDBUpdate = lastUpdate;

			selected = Session.get("selected");
			//guestSprite.visible = (selected!=undefined);
			//guestMessage.visible = (selected!=undefined);
			if (guestSprite.visible) {
				//Meteor.call('getUserName', selected, function(error, result) {
				//	if (error) {
				//		console.log("Couldn't retrieve username for user#" + selected);
				//	} else {
				//		guestMessage.text = result;
				//	}
				//});
				//Meteor.call('getUserColor', selected, function(error, result) {
				//	if (error) {
				//		console.log("Couldn't retrieve color for user#" + selected);
				//	} else {
				//		let hex = parseInt(result.substr(1),16);
				//		guestSprite.tint = hex;
				//	}
				//});
				//Meteor.call('getUserPosition', selected, function(error, result) {
				//	if (error) {
				//		console.log("Couldn't retrieve position for user#" + selected);
				//	} else {
				//		guestSprite.position.x = result.x;
				//		guestSprite.position.y = result.y;
				//		guestMessage.position.x = result.x;
				//		guestMessage.position.y = result.y - 70;
				//		if (guestMessage.position.y < 10) {
				//			guestMessage.position.y = result.y + 70;
				//		}
				//	}
				//});
			}

			let c = Meteor.user();
			if ( (c != undefined) && (c.color != undefined)) {
				homeSprite.visible = true;
				homeSprite.position.x = c.position.x;
				homeSprite.position.y = c.position.y;
				homeMessage.position.x = c.position.x;
				homeMessage.position.y = c.position.y - 70;
				if (homeMessage.position.y < 10) {
					homeMessage.position.y = c.position.y + 70;
				}
				let hex = parseInt(c.color.substr(1),16);
				homeSprite.tint = hex;
				homeMessage.text = Meteor.user().username;
				homeMessage.style.fill = hex;
			}
		}

		requestAnimationFrame(theloop);
		renderer.render(stage);
	};

	function setup() {
		homeMessage.style.strokeThickness = 5;
		stage.addChild(homeMessage);
		guestMessage.visible = false;
		stage.addChild(guestMessage);

		homeSprite.visible = false;
		homeSprite.anchor.x = 0.5;
		homeSprite.anchor.y = 0.5;
		guestSprite.visible = false;
		guestSprite.anchor.x = 0.5;
		guestSprite.anchor.y = 0.5;

		stage.addChild(homeSprite);
		stage.addChild(guestSprite);

		renderer.render(stage);
		theloop();
	}
};
