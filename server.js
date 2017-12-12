var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/dogDash');
var DogSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    breed: { type: String, required: true},
    age: { type: Number, required: true },
    color: { type: String, required: true }
}, { timestamps: true });
mongoose.model('Dog', DogSchema);
var Dog = mongoose.model('Dog')
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


//ROUTES
app.get('/', function (req, res) {
    var dogs = Dog.find({}, function (err, dogs) {
        if (err) {
            res.render('index', { dogs: [] })
        }
        else {
            console.log(dogs);
            res.render('index', { dogs: dogs });
        }
    })
});
app.get('/dogs/new', function (req, res) {
    res.render('new')
});
app.get('/dogs/:id', function (req, res) {
    console.log(req.params.id)
    var dog = Dog.find({ _id: req.params.id }, function (err, dog) {
        if (err) {
            res.render('display', { dog: [] })
        }
        else {
            console.log(dog)
            res.render('display', { dog: dog });
        }
    })
});

app.get('/dogs/edit/:id', function (req, res) {
    
    var dog = Dog.find({ _id: req.params.id }, function (err, dog) {
        if (err) {
            res.render('edit', { dog: [] });
        }
        else {
            console.log(dog);
            res.render('edit', { dog: dog });
        }
    });
});
app.post('/dogs', function (req, res) {
    console.log("POST DATA from /dogs", req.body);
    var dogs = new Dog({ name: req.body.name, breed: req.body.breed, age: req.body.age, color: req.body.color });
    dogs.save(function (err) {
        if (err) {
            res.render('new', { errors: dogs.errors, dogs: [] })
        } else {
            console.log('successfully invited a dog!');
            res.redirect('/');
        }
    });
});
app.post('/dogs/:id', function (req, res) {
    Dog.update({ _id: req.params.id }, {$set:{name:req.body.name, breed: req.body.breed, age: req.body.age, color: req.body.color}}, function(err){
       res.redirect('/'); 
    });
});
app.post('/dogs/destroy/:id', function (req, res) {
    Dog.remove({ _id: req.params.id }, function(err) {
        res.redirect('/')
    })
});

app.listen(8000, function () {
    console.log("listening on port 8000");
})
