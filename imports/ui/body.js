import { Template } from 'meteor/templating';
 
import './body.html';
 
Template.body.helpers({
	  players: [
		      { name: 'Landolphia', color:"#41A317" },
		      { name: 'Jenanoelle', color:"#842DCE" },
		      { name: 'Neko', color:"#A0A0A0" },
		    ],
});
