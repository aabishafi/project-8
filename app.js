var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//import sequelize
var sequelize = require("./models").sequelize;

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Static Route
app.use('/static', express.static(path.join(__dirname, 'public')));

// Set Pug as view engine
app.set('view engine', 'pug');

// Get Book Routes 
const routes = require('./routes/');
const books = require('./routes/books');
app.use('/', routes);
app.use('/books', books);


//Error Handling 
app.use((req, res, next) => {
    const err = new Error('Sorry! Page is not found.');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err + '')
    res.render('page-not-found');
})

sequelize.sync().then(function() {
    app.listen(3000, () => {
        console.log("The application is running on localhost:3000!");
    })
})