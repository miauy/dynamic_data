let eList=require('../data/emails.json')

//import file system module
const fs = require('fs')

//Include navigation
let navigation = require("../data/navigation.json")


exports.newsletterSignup = (req, res) => {
    res.render('newsletter-signup', {csrf : 'super secret', nav: navigation})
}

exports.newsletterSignupProcess = (req, res) => {
    console.log(req.body)

    //Extract the data
    // let user = {
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname,
    //     address: req.body.address,
    //     city: req.body.city,
    //     state: req.body.state,
    //     zip: req.body.zip,
    //     email: req.body.email
    // }


    //add the user to our list
   //eList.users.push(user)
    eList.users.push(req.body)
    console.log(eList)
    let json = JSON.stringify(eList)

    fs.writeFileSync('./data/emails.json',json, 'utf-8', ()=>{})

    res.redirect(303, '/newsletter/list')
    //res.render('newsletter-signup', {csrf : 'super secret'})
}

exports.newsletterSignupList = (req, res) => {
    let eList = require('../data/emails.json')
    
    console.log(eList)
    res.render('userspage', {"users": eList.users, nav: navigation})
    
}

exports.newsletterUser = (req, res) => {
    console.log(eList)
    //filter each user and put into the variable user
    let userDetails = eList.users.filter((user)=>{
        return user.email == req.params.email
    })

    console.log(userDetails)
    res.render('userdetails', {"users": userDetails, nav: navigation})
}

exports.newsletterUserDelete = (req, res) => {
    let newsList = {}
    //retrieve all users filtering out the email we don't want
    // use not equals
    newsList.users = eList.users.filter((user)=>{
        return user.email != req.params.email

    })
    console.log("Deleting " + req.params.email)

    //convert the object to a string before writing to the file
    let json = JSON.stringify(newsList)

    fs.writeFileSync('./data/emails.json',json, 'utf-8', ()=>{})

    delete require.cache[require.resolve('../data/emails.json')]//clear cache from module

    res.redirect(303, '/newsletter/list')


}