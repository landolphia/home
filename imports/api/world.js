import { Mongo } from 'meteor/mongo';

const Worlds = new Mongo.Collection('worlds');

export default Worlds;


if (Meteor.isServer) {
	Worlds.remove({});
	Meteor.users.update({}, {$unset : {'worlds':''}});

	Meteor.publish('world', function worldPublication (id) {
			console.log("publishing : " + id);
		if (this.userId) {
			console.log("publishing : " + id);
			check(id, String);
			let userId = this.userId;
			let world = Worlds.findOne(id);
			if (world == undefined) return [];
			let population = world.population; 
			let belong = false;
			population.forEach( function (p) {
				if (p.id == userId) belong = true;
			});
			if (belong) {
				let options = { fields : {
					'population' : 1}};
				return Worlds.find(id, options);
			}
		}
	});

	Meteor.methods({
		'world.setPlayerPosition' (data) {
			let userId = this.userId;
			if (userId) {
				check(data, {
					'id' : String,
					'move' : {'x': Number, 'y': Number}});
				let move = data.move;
				let id = data.id;

				let world = Worlds.findOne(id);
				let size = world.size;
				let height = size.height;
				let width = size.width;
				console.log(height + " x " + width);

				move.x = Math.max(0, Math.min(width, move.x));
				move.y = Math.max(0, Math.min(height, move.y));

				let population = world.population;
				let index = -1;
				population.forEach( function (p, i) {
					if (p.id == userId) {
						index = i;
					}
				});
				if (index != -1) {
					population[index].position.x = move.x;
					population[index].position.y = move.y;
				}
				let result = Worlds.update(id, {$set : {'population' : population}});
				return move;
			} else return { x : -300, y : -300};
		},
		'createWorld' (users) {
			if ( Array.isArray(users) && users.length >= 2) {
				let population = new Array();
				let offset = { x : 30, y : 30};
				users.forEach(function (e) {
					offset.x += 30;
					if (offset.x > 260) {
						offset.x = 30;
						offset.y += 30;
					}
					population.push({
						'id' : e,
						'position' : { x:offset.x,y:offset.y}
					});
				});

				let history = [{ txt : "World created.",
					createdOn : new Date(),
					author : "System"
				}];

				let worldId  = Worlds.insert({
					'population' : population,
					'size' : { height: 480, width: 640},
					'history' : history},
					function (error, id) {
						if (error) {
							console.log("Couldn't create world: " + error);
						} else {
							console.log("Created world #" + id);
						};
					});

				population.forEach( function (e) {
					console.log("Population : " + e.id + " [" + e.position.x + ", " + e.position.y + "] added worldId# " + worldId);
					Meteor.call("player.addWorld", {'user' : e.id, 'world' : worldId});
				});

			} else {
				console.log("Invalid input, expecting [{_id: id}]");
			}
		},
	});
}
