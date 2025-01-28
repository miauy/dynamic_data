//variables
const http = require('node:http');
//fs is the file system; can access files within system; read files; create files; delete files; edit content of a file
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

//Functions

//syntax of a function

let name = "Mia Uy";
const someName = (name) => {
  console.log("Your name is " + name)
};

someName(name)

const server = http.createServer((req, res) => {
  console.log(req.url);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  //using file system
  fs.readFile('./public/home.html', (error, content)=>{
    //We need to handle errors first

    //if no errors we can output the content
    res.end(content);

  })
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/ .. Press ctrl C to stop`);
});
