const express = require('express');
const app = express();
const bp = require('body-parser')
const https = require('https');
const configFiles = require('./config.js');

let apiKey = configFiles.ApiKey

let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`

app.use(bp.urlencoded({extended: true}))
app.use(express.static('public'))

function isImage(testUrl) {  //Tests whether or not provided link leads to an image.
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(testUrl);
  }
 

app.get('/', (req, res) => {
    
    res.sendFile(__dirname + '/public/index.html')     //sends home page where date is selected

});

 
app.post('/', (req, res) => {       //on submitting a date, this script will run to return
                                    //image and description from that day
    let date = req.body.date

    url += `&date=${date}`      //append the date selected to end of url

    https.get(url, (response) => {
        console.log(response.statusCode)        //For debugging
    
        response.on('data', (data) => {
    
            let alldata = JSON.parse(data)
            let image = alldata.url
            console.log(image)      //For debugging
            console.log(url)        //For debugging
            res.write(`<h1>${alldata.explanation}</h1>`)
    
            if (isImage(image)) {       //if true, will display image, if false, moves to next step and gives a link to the ptovided content
                res.write(`<img src=${image}>`)
            }
    
            else {
                res.write(`<a href=${image}>Click here to visit!<a>`)
            }
            
            res.write(`<button type=button onclick="location.replace('/')">Pick Another!</button>`) //button redirects back to date selection page

            res.end()
            url = url.slice(0, url.lastIndexOf('&'))        //removes the added date, allows
        })                                                  // new date to be added
    })
});
    



app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});