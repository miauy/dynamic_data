const express = require('express');
//initializing express and storing it into variable for easy access
const app = express();
//process env from node 
const port = process.env.port || 3000;

//create some routes
// app.get('/', (request, response) =>{

// })

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
    console.log(`Express is running on https://localhost:${port};`) //use ` instead of ' when inserting JS into a string
    console.log(`press CTRL-C to terminate`);

})
