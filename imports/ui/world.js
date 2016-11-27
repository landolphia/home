import { Template } from 'meteor/templating';

import PIXI from 'pixi.js';

import '../api/player.js';
import '../api/world.js';

import './world.html';

import Worlds from '../api/world';

var worldHandler = false;

Tracker.autorun( function () {
	let worldId = Session.get("worldId");
	if (Meteor.userId() && (worldId != undefined)) {
		newHandler = Meteor.subscribe('world', worldId);
		if (worldHandler) worldHandler.stop();
		worldHandler = newHandler;
	}
});

Template.body.onRendered = function () {
	var container = document.getElementById("worldContainer");
	var renderer, stage, meepleTexture;
	function setup (height, width) {
		height = Math.min(768, Math.max(240, height));
		width = Math.min(1270, Math.max(320, width));
		console.log("Renderer: [" + height + " x " + width + "]");

		renderer = PIXI.autoDetectRenderer(height, width);
		renderer.backgroundColor = 0xC0C0C0;

		stage = new PIXI.Container();

		meepleTexture = PIXI.Texture.fromImage('placeholder.png');

		container.appendChild(renderer.view);
		renderer.render(stage);
	}
	setup(640, 480);

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
		let worldId = Session.get("worldId");
		if (worldId != undefined) {
			Meteor.call('world.setPlayerPosition', {
					'id' : worldId,
					'move' : {
						'x': p.x,
						'y': p.y}},
				function (error, result) {
				if (error) {
					console.log("Failed to set player position.");
				} else {
					console.log("Succesfully set player position to : " + result.x + " / " + result.y);
				}
					dirty = true;
			});
		}
	}
	container.addEventListener("click", getClickPosition, false);

	let dirty = false;

	let lastUpdate = Date.now();
	let delta = 0;
	let DBUpdateRate = 4000;
	let lastDBUpdate = Date.now() - DBUpdateRate;
	let previousWorldId = Session.get("worldId");

	function theloop() {
		now = Date.now();
		delta = now - lastUpdate;
		lastUpdate = now;

		let worldId = Session.get("worldId");
		if ((lastUpdate > (lastDBUpdate + DBUpdateRate)) &&
		(Meteor.userId() && Meteor.user()) &&
		(worldId != undefined)) {
			lastDBUpdate = lastUpdate;
			dirty = dirty || (previousWorldId != worldId);
			if (dirty) {
				console.log("Updating world data: " + now + " [" + previousWorldId + " x " + worldId + "]");
				previousWorldId = worldId;
				reloadWorld(worldId);
			} else { console.log("Clean, no update");}
		}

		requestAnimationFrame(theloop);
		renderer.render(stage);
	};
	theloop();

	function resetStage (result) {
		console.log("Reset stage");
		stage = new PIXI.Container();
		result.population.forEach( function (p) {
			Meteor.call('getUserColor', p.id, function(error, result) {
				if (error) {
					console.log("Couldn't retrieve color for user#" + p.id);
				} else {
					let s = new PIXI.Sprite(meepleTexture);
					let hex = parseInt(result.substr(1),16);
					console.log("Customising sprite for user#" + p.id + " -> " + hex.toString() + "[" + p.position.x + ", " +  p.position.y + "]");
					s.tint = hex;
					s.position.x = p.position.x;
					s.position.y = p.position.y;
					stage.addChild(s);
				}
			});
		});
	};
	
	function reloadWorld (id) {
		console.log("Reloading world.");
		let worldId = Session.get("worldId");
		if ((worldHandler != undefined) &&
			(worldHandler.ready())) {
			let result = Worlds.findOne(worldId);
			if ((result != undefined) &&
				(result.population != undefined)) {
					let population = result.population;
					population.forEach( function (e) {
						console.log("E: " + e.id);
					});
					Session.set("world", result);
					resetStage(result);
					dirty = false;
				}
		} else { console.log("Waiting for subscription.")};
	};
}
