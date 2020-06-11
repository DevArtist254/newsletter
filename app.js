//server side setup
const express = require("express")
const request = require("request")

//fetch data
//1. from other api
const https = require("https")
//2. from the body
const bodyParser = require("body-parser")

//security policy
const cors = require("cors")

//store our server
const app = express()
//Our port
const port = 3000

//OUR USE Methods or headers

//app.use(cors())

//2.1
app.use(express.static("public"))

//3.11
app.use(bodyParser.urlencoded({extended: true}))

//1.1
app.get("/", (req, res) => {
  //1.10
  res.sendFile(`${__dirname}/signup.html`)
})

app.post("/", (req, res) => {
  //3.11
  let firstN = req.body.firstname
  let lastN = req.body.lastname
  let email = req.body.email

  //4.1
  let data = {
    //https://mailchimp.com/developer/reference/lists/
    members: [
      {
        //click on show properties and follow the type for our value data
        email_address: email,
        status: `subscribed`,
        merge_fields: {
          //https://us4.admin.mailchimp.com/lists/settings/merge-tags?id=334154 for the keys
          FNAME: firstN,
          LNAME: lastN,
        },
      },
    ],
  }

  //4.11
  const jsonData = JSON.stringify(data)

  //5.1
  const listID = `c1bb7eeab4`
  const apiID = `2984d148b768c2e14d05a9af99d67447-us4`
  const name = `evolution`
  //http params
  const url = `https://us4.api.mailchimp.com/3.0/lists/${listID}`
  const options = {
    method: "POST",
    auth: `${name}:${apiID}`,
  }

  //5.12
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`)
    } else {
      res.sendFile(`${__dirname}/failure.html`)
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data))
    })
  })

  //5.11
  request.write(jsonData)
  request.end()
})

//5.12
app.post("/failure", (req, res) => {
  res.redirect("/")
})

//start up our server and listen to it in port 3000
app.listen(process.env.port || 3000, () => {
  console.log(`DevArtist Server has started`)
})

/**
 * Code Documentation
 *
 * 1.1 In our first we are going to respond to the servers request and
 *      (1.10) send the html file
 * 2.1 In order to use() our css and images we !1st place them in a public folder the change all the urls as if your starting from public
 *      2.11 the use a method in express.static() and set its param 1 to = "public"
 * 3.1 use() body parser to get data from that is posted browser header middleware
 *      3.11 requset from the body all the from data that comes with the name
 * 4.1 for a data model according to mailchips api ref
 *      4.11 then convet it into json string() to give ability to send it over the internet
 * 5.1 first create the constants and parameters to be used in the post request
 *      5.11 then create write() method to use it to pass the variable in our request
 *      5.12 equate our request to https fn and passing the 3 parameters  url, options and callback fn with a param of response
 * UX control flow
 *      5.13 if our data is taken to our server , (response.statusCode === 200) we should take our user to A success page
 *      5.14 else we should take to a failure page to try again
 *              5.141 if our user is willing to try again we should redirect them to our page
 */
