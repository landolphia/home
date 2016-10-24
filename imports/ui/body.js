import { Template } from 'meteor/templating';

import { Messages } from '../api/messages.js';

import PIXI from 'pixi.js';
 
import './body.html';


Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('usersOnline');
});

Template.body.helpers({
	messages () {
		if (Meteor.user()) {
			let selected = Session.get("selected");
			//console.log("User(" + Meteor.user()._id + ") wants to select: " + selected);
			if (selected != null) {
				return Messages.find(
					{$or:[
						{to: Meteor.user()._id, from: selected},
						{from: Meteor.user()._id, to: selected}]},
				       	{ sort: { createdAt: -1}});
			} else {
				return Messages.find({to: null}, { sort: { createdAt: -1}});
			}
		} else { return [ {text: "You must be logged in to see the chat.", from: "System", createdAt: "Never"}];}
	},
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

Template.body.events({
	'submit .new-message' (event) {
		event.preventDefault();
		const target = event.target;
		const text = target.text.value;
		const from = Meteor.user()._id;
		const selected = Session.get("selected");
		const to = selected;

		//console.log(text + " from: " + from + " /-> " + to);

		Messages.insert({
			text: text,
			createdAt: new Date(),
			from: from,
			to: to
		});

		target.text.value = '';
	},
});

Template.body.onRendered = function () {
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
	document.body.appendChild(renderer.view);
	console.log("Help me help you");
	//PIXI.loader.load(setup);
	setup();
	console.log("Help you help me");
	//	.add("coffee", "https://dl.dropboxusercontent.com/u/139992952/coffee.png")
		//.on("progress", loadProgressHandler)
	
	function loadProgressHandler(loader, resource) {
		console.log("loading: " + resource.url + " [" + loader.progress + "%]");
	}

	function theloop() {
		console.log("It is here:");
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

Template.user.events({
	'click li' (event) {
		event.preventDefault();
		if (Meteor.user()) {
		       if (Meteor.user()._id != this._id) {
			       Session.set("selected", this._id);
			       let result = Session.get('selected');
			       //console.log("Set selected as : " + result);
		       } else {
			       Session.set("selected", null);
		       }
		}
	},
});

Template.user.helpers({
	currentuser: function () {
		//console.log ("Current user: " + this._id + " vs " + Meteor.user()._id);
		if (Meteor.user()) return this._id == Meteor.user()._id;
	},
	selected: function () {
		let selected = Session.get('selected');
		//console.log ("Selected user: " + this._id + " vs " + selected);
		if (Meteor.user() && selected) return this._id == selected;
	},
});
