//arrays
let numbers = [10, 12, 13, 14, 13, 56];

let names = ["Peter", "Jack", "Mary", "Claudia"];

//Access values of an array

console.log(names[3])
//array iteration
names.forEach( (value, index)=>{
    //inside item
    console.log(value, index)
    if(value == "Mary"){
        console.log("Found Mary at position: " + index)
    }

})

//JavaScript objects
let person = {
    //variables inside objects are referred to as properties
    firstName: "Mia", //accessed as person.firstName
    lastName: "Uy",
    occupation:"Student",
    email:"miauy@miami.edu",
    //function within an object is called a method
    getName: ()=>{
        console.log("My name is " + this.firstName + " " + this.lastName) //cannot use person.firstName use this.firstName instead

    }

}

console.log(person.firstName)

//JSON Does not store functions, only key values

let data = {
    brand: {
        name: "Miami Travel Site", // access --> data.brand.name
        link: "/",
        img:"/images/logo.png"

    },

    links:[
        {
            text:"Home",
            href:"/"
        },
        {
            text:"Nightlife",
            href:"/nightlife"
        },
        {
            text:"Beaches",
            href:"/beaches"
        },
        {
            text:"About",
            href:"/about"
        },
        

    ]
}


