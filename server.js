const express = require("express");  //Server library
const path = require("path");  //For getting the path of necessary files
const bodyParser = require("body-parser");  //For parsing POST requests
const sqlite3 = require("sqlite3");  //Database
const cors = require("cors");  //Security
const bcrypt = require("bcrypt");  //Password hashing
require("dotenv").config();  //Hiding API keys
const https = require('https');  //Making API requests server-side

const app = express();
const date = new Date();

//Connect to database
const database = new sqlite3.Database('./database.db');

app.use(express.static(path.join(__dirname, 'client/build')));  //Serve static files from the build folder for the sign in page
app.use(bodyParser.urlencoded({ extended: false }));  //Use bodyParser for URL-encoded bodies
app.use(bodyParser.json());  //Use bodyParser for JSON-encoded bodies
app.use(cors(
    {origin: 'https://localhost:3000',
     optionsSuccessStatus: 200
    }
));  //Enable CORS for all routes

//Handle account creation with POST requests on the /api/create-account path
app.post("/api/create-account", function(req, res) {
    console.log("Creating Account...");
    if (req.body.username === undefined || req.body.password == undefined) {
        res.json({ error: "Required field is undefined"});
    } else {
        //Check if the username is already taken and return an error message if so.
        database.get("SELECT * FROM Users WHERE username = ?", [req.body.username], (error, row) => {
            if (row) {
                console.log("Username already taken - sending error message.");
                res.json({ error: 'Username already taken.' });
                return;

                //Otherwise, add the user
            } else {
                console.log("Username available - adding new user.");
                //Asynchronously hash password
                bcrypt.hash(req.body.password, 8, (error, hash) => {
                    
                    //Send an error message in case of a password hashing issue
                    if (error) {
                        res.json({ error: "Could not hash password."});

                        //Generate random user id
                    } else {
                        let identifier = []
                        for (let i = 0; i < 64; i++) {
                            identifier.push(String.fromCharCode(97 + Math.floor(Math.random() * 25)));
                        }
                        let uniqueID = identifier.join('');

                        //Save user information to database
                        database.run(`INSERT INTO Users VALUES('${req.body.username}', '${hash}', '${req.body.bio}', '${req.body.photo}', '${uniqueID}');`);
                        res.json({
                            id: uniqueID
                        })
                    }
                })
            }
        });
    }
});

//Handle sign in with GET requests on the /api/signIn path
app.get("/api/signIn/:username/:password", function(req, res) {
    //Retrieve user information from the database
    database.get("SELECT * FROM Users WHERE username = '" + req.params.username + "';", (error, row) => {

        //Send an error message if there is a database issue.
        if (error) {
            res.send({ error: "Database error." });
            return;
        }

        //Send an error message if the user doesn't exist.
        if (row === undefined) {
            res.send({ error: "User does not exist."})
            return;
        } 

        //Compare hashed password with provided password
        bcrypt.compare(req.params.password, row.password, (err, result) => {

            //If password is correct send identifier string back
            if (result) {
                console.log("Login successful");
                res.send({ 
                    id: row.id
                })

            //If password is incorrect, send error message back
            } else {
                console.log("Login Attempt failed - incorrect password. Sending error message.");
                res.send({ error: "Incorrect Password."})
            }
        })
    })
})

//Handle requests for a user's homepage feed on the /api/feed path
app.get("/api/feed/:id", function (req, res) {
    //Create an object to respond with
    let feedObject = {
        headlines: [],
        posts: []
    };

    //Check whether the user exists
    database.get("SELECT * FROM Users WHERE id = '" + req.params.id + "';", (error, row) => {
        if (error) {
            res.send({ error: "Database error." });
        }
        if (row === undefined) {
            res.send({ error: "User does not exist."})
            return;
        } else {
            feedObject.profilePicture = row.photo;
        }
    });

    //Get the first 25 posts from the posts table
    database.each("SELECT * FROM Posts LIMIT 25;", (error, row) => {
        feedObject.posts.push({
            author: row.author,
            content: row.content,
            likes: row.likes,
            timestamp: `${row.hour}:${row.minute} • ${row.month}-${row.day}-${row.year}`
        })
    })

    

    //Set options for news API call
    const options = {
        host: 'newsapi.org',
        path: `/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`,
        headers: {
            'User-Agent': req.get('user-agent')
        }
    }

    //Make news API call
    https.get(options, (resp) => {

        //Add data to a string as it is received
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        })

        //Parse data and retrieve the first 5 headlines
        resp.on('end', () => {
            let json = JSON.parse(data);
            if (json.status !== 'error') {
                for (let i = 0; i < 5; i++) {
                    feedObject.headlines.push({
                        'title': json['articles'][i]['title'],
                        'url': json['articles'][i]['url'],
                        'image': json['articles'][i]['urlToImage'],
                    })
                }
            }

            //Send the feed to the client
            res.send(feedObject);
            
        })
    })
})

//Add new posts to the database
app.post("/api/new-post", function(req, res) {
    console.log("Adding new post...");
    
    //Generate a random post id
    let identifier = []
    for (let i = 0; i < 64; i++) {
        identifier.push(String.fromCharCode(97 + Math.floor(Math.random() * 25)));
    }
    
    //Find the author of the post based on their id
    database.get(`SELECT * FROM Users WHERE id = '${req.body.author}';`, (error, row) => {
        let author = row.username;

        //Add the post to the database
        database.run(`INSERT INTO Posts Values('${author}', "${req.body.content}", 0, ${date.getFullYear()}, ${date.getMonth() + 1}, ${date.getDate()}, ${date.getHours()}, ${date.getMinutes()}, '${identifier.join('')}');`)
        res.json({message: "received"});
    })

    
})

//Handle all other routes and serve the main React component
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "client/build/index.html")));
app.get("/home/:id", (req, res) => res.sendFile(path.join(__dirname, "client/build/index.html")));

//Listen for requests on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log(`Running on port ${PORT}`)});