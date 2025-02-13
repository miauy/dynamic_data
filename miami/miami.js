const express = require('express')
//initializing express and storing it into variable for easy access
const app = express()


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
const handler = require('./lib/handler')

//set up the template engine
const handlebars = require('express-handlebars') //additional setup
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');


//process env from node to set port execute: port=8080 node miami
const port = process.env.port || 3000

let navigation = require("./data/navigation.json")
//create some routes
app.get('/', (request, response) =>{
    response.type('text/html')
    response.render('home', {title: 'Miami Travel Site', nav: navigation})
})

app.get('/about', (request, response) =>{
    response.type("text/html")
    response.render("page", {title: 'About Miami', nav: navigation})
})

app.get('/nightlife', (request, response) =>{
    response.type("text/html")
    response.render("page", {title: 'Miami Night Life', nav: navigation})
})
app.get('/beaches', (request, response) =>{
    response.type("text/html")
    response.render("page", {title: 'Miami Beaches', nav: navigation})
})

//Query, params and body
app.get('/search', (request, response) =>{
    console.log(request)
    response.type("text/html")
    response.render("page", {title: 'Search results for: ' + request.query.q, nav: navigation})

})

app.get('/basic', (req, res) => {
    res.render('page', {req})
})

//newsletter
app.get('/newsletter-signup', handler.newsletterSignup)

app.post('/newsletter-signup/process', handler.newsletterSignupProcess)
app.get('/newsletter/list', handler.newsletterSignupList)




//error handling goes after actual routes
//custum 404 error handler
app.use((request,response) =>{
    response.type("text/plain");
    response.status(404);
    response.send("404 - Not Found");
})

//server handler
app.use((error, request, response, next) =>{
    console.log(error);
    response.type("text/html");
    response.status(500);
    response.send("500 - Server Error");
})


//start the server
app.listen(port, ()=>{
    console.log(`Express is running on http://localhost:${port};`) //use ` instead of ' when inserting JS into a string
    console.log(`press CTRL-C to terminate`);

})

