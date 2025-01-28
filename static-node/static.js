//variables; declare varibles with const or let
//const is reserved for functions and variables that will not change
//let is reserved for functions and variables that will change

//require is a function that imports a module and it can be from another program within the same parent folder
const http = require('node:http');
//fs is the file system; can access files within system; read files; create files; delete files; edit content of a file
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

//Functions
//syntax of a function

const someName = (name) => {
  console.log("Your name is " + name)
};

/* another way of declaring a function
function someOtherName(name){
  console.log("Your name is " + name)
}
*/

someName("Mia Uy")

//create function to read files and display them
//r is response from server function
const displayPage = (path, r, status = 200) => {
    //r.statusCode = 200;
    r.setHeader('Content-Type', 'text/html');
    //using file system with readFile function
     
    fs.readFile(path, (error, content)=>{
      //We need to handle errors first
      if(error){
        //overriding 
        r.statusCode = 500;
        r.end("500 - error")

      } 
      else{
      r.statusCode = status;
      //if no errors we can output the content
      r.end(content);
     // r.end('<h1>Hello World</h1><p>This is some text</p>');
    }

    })
}

//represents everything that the application serves
//req is the request and res is the response
//respond to requests and responds to requests without response

const server = http.createServer((req, res) => {
  console.log(req.url);

  switch(req.url){  

    case "/":
    case "":
    //Respond to 

    displayPage('./public/home.html', res);
    break;

    case "/about":
        //Respond to 
    
        displayPage('./public/about.html', res);
        break;

    case "/contact":
        //Respond to 
        
        displayPage('./public/contact.html', res);
        break;

    default:
    //Respond to    
    displayPage('./public/404.html', res, 404);
    
  }


  


  
});

//runs the application
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/ .. Press ctrl C to stop`);
});
