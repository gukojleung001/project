var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongodbURL = 'mongodb://abc123:123456@ds054298.mongolab.com:54298/test001';
var mongoose = require('mongoose');

app.post('/',function(req,res) {
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://abc123:123456@ds054298.mongolab.com:54298/test001');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {

		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.body.restaurant_id},function(err,results){

		if (results.length == 0){
		var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		rObj.borough = req.body.borough;
		rObj.cuisine = req.body.cuisine;
		rObj.name = req.body.name;
		rObj.restaurant_id = req.body.restaurant_id;
			
		if (req.body.date != null || req.body.grade != null || req.body.score != null)rObj.grades = {};
		if (req.body.date != null) rObj.grades[0].date = req.body.date;
		if (req.body.grade != null) rObj.grades[0].grade = req.body.grade;
		if (req.body.score != null) rObj.grades[0].score = req.body.score;

		
		var r = new Restaurant(rObj);
		//console.log(r);
		r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant created!')
       		db.close();
			res.status(200).json({message: 'insert done', id: r._id});
		  });
		}

		if (results.length > 0) {
			res.status(200).json({message: 'The Restaurant ID is already exists'});
		}
    	});
    });
});

app.delete('/:attribute/:attribute_values',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://abc123:123456@ds054298.mongolab.com:54298/test001');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		criteria[req.params.attribute] = req.params.attribute_values;
		Restaurant.find(criteria).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'delete done', id: req.params.id});
    	});
    });
});

app.get('/:field/:field_values', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://abc123:123456@ds054298.mongolab.com:54298/test001');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		criteria[req.params.field] = req.params.field_values
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
    	});
    });
});

app.put('/:field/:field_values/:attribute/:attribute_values',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://abc123:123456@ds054298.mongolab.com:54298/test001');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		criteria[req.params.attribute] = req.params.attribute_values;
		var criteria2 = {};
		criteria2[req.params.field] = req.params.field_values;
		
		Restaurant.update(criteria2,{$set : criteria},{multi : true}, function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'Update done', id: req.params.id});
    	});
    });
});


app.put('/:field/:field_values/:field2',function(req,res) {
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://abc123:123456@ds054298.mongolab.com:54298/test001');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		criteria[req.params.field] = req.params.field_values;
		
		Restaurant.find(criteria, function(err,results) {
		
		if (err) {
				res.status(500).json(err);
				throw err
			}

		for(i=0 ; i < results.length ; i++){
		if (req.body.date != null || req.body.grade != null || req.body.score != null){
		results[i].grades = {};
		if(req.body.date != null) results[i].grades[0].date = req.body.date;
		if(req.body.grade != null) results[i].grades[0].grade = req.body.grade;	
                if(req.body.score != null) results[i].grades[0].score = req.body.score;
		}	
	
		if(req.body.building != null) results[i].address.building = req.body.building;
		if(req.body.street != null) results[i].address.street = req.body.street;
		if(req.body.zipcode != null) results[i].address.zipcode = req.body.zipcode;

		if(req.body.borough != null) results[i].borough = req.body.borough;
		if(req.body.cuisine != null) results[i].cuisine = req.body.cuisine;
		if(req.body.name != null) results[i].name = req.body.name;
		if(req.body.restaurant_id != null) results[i].restaurant_id = req.body.restaurant_id;
		
		if(req.body.lon != null || req.body.lat != null) {
		var lon = results[i].address.coord[0]
		var lat = results[i].address.coord[1]
		results[i].address.coord = [];
		if(req.body.lon != null && req.body.lat == null) {
		results[i].address.coord[0] = req.body.lon;
		results[i].address.coord[1] = lat;
		}

		if(req.body.lat != null && req.body.lon == null) {
		results[i].address.coord[0] = lon;
		results[i].address.coord[1] = req.body.lat;
		}
		
		if(req.body.lat != null && req.body.lon != null){
		results[i].address.coord[0] = req.body.lon;
                results[i].address.coord[1] = req.body.lat;
		}	
		}

		/*var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		rObj.borough = req.body.borough;
		rObj.cuisine = req.body.cuisine;
		rObj.name = req.body.name;
		rObj.restaurant_id = req.body.restaurant_id;*/

		//var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		//console.log(r);
		results[i].save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant created!')
		
       		
            });
	   }
		db.close();
		res.status(200).json({message: 'insert done'});
    	});
    });
});




app.listen(process.env.PORT || 8099);
