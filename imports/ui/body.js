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
			console.log("User(" + Meteor.user()._id + ") wants to select: " + selected);
			if (selected != null) {
				return Messages.find({
					to: Meteor.user()._id,
					from: selected},
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

		console.log(text + " from: " + from + " /-> " + to);

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
	//let stage = new PIXI.Container();
	//let renderer = PIXI.autoDetectRenderer(100, 100);
	//document.body.appendChild(renderer.view);
	//PIXI.loader
	//	.add("coffee", "https://dl.dropboxusercontent.com/u/139992952/coffee.png")
	//	.load(setup);
	//let block;

	//function setup() {
	//	block = new PIXI.Sprite(PIXI.loader.resources.coffee.texture);  
	//	block.anchor.x = 0.5;
	//	block.anchor.y = 0.61;

	//	block.position.x = 200;
	//	block.position.y = 150;
	//	stage.addChild(block);
	//	renderer.render(stage);
	//	theloop();
	//}

	//let theloop = function(){
	//	requestAnimationFrame(theloop);
	//	block.rotation += .03;
	//	renderer.render(stage);
	//};
};

Template.user.events({
	'click li' (event) {
		event.preventDefault();
		if (Meteor.user()) {
		       if (Meteor.user()._id != this._id) {
			       Session.set("selected", this._id);
			       let result = Session.get('selected');
			       console.log("Set selected as : " + result);
		       } else {
			       Session.set("selected", null);
		       }
		}
	},
});

Template.user.helpers({
	currentuser: function () {
		console.log ("Current user: " + this._id + " vs " + Meteor.user()._id);
		if (Meteor.user()) return this._id == Meteor.user()._id;
	},
	selected: function () {
		let selected = Session.get('selected');
		console.log ("Selected user: " + this._id + " vs " + selected);
		if (Meteor.user() && selected) return this._id == selected;
	},
});
