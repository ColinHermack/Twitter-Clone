const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

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
    console.log("Creating Account");
    let exists = false;
    if (req.body.username === undefined || req.body.password == undefined) {
        res.json({ error: "Required field is undefined"});
    } else {
        //Check if the username is already taken and return an error message if so.
        database.get("SELECT * FROM Users WHERE username = ?", [req.body.username], (error, row) => {
            if (row) {
                console.log("Username already taken - sending error message");
                res.json({ error: 'Username already taken.' });
                return;
            } else {
                //Otherwise, add the user
                console.log("Username available - adding new user");
                bcrypt.hash(req.body.password, 8, (error, hash) => {
                    if (error) {
                        res.json({ error: "Could not hash password"});
                    } else {
                        //Generate unique user ID made up of 64 random characters
                        let identifier = []
                        for (let i = 0; i < 64; i++) {
                            identifier.push(String.fromCharCode(97 + Math.floor(Math.random() * 25)));
                        }
                        let uniqueID = identifier.join('');
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

//Handle sign in with GET requests on the /api path
app.get("/api/signIn:username/:password", function(req, res) {
    database.get("SELECT * FROM Users WHERE username = '" + req.params.username + "';", (error, row) => {
        if (row === undefined) {
            res.send({ error: "User does not exist."})
            return;
        } 
        bcrypt.compare(req.params.password, row.password, (err, result) => {
            if (result) {
                console.log("Login successful");
                res.send({ 
                    id: row.id
                })
            } else {
                console.log("Login Attempt failed - incorrect password. Sending error message.");
                res.send({ error: "Incorrect Password."})
            }
        })
    })
})

//Get a user's feed

//Handle all other routes and serve the main React component
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "client/build/index.html")));
app.get("/home/:id", (req, res) => res.sendFile(path.join(__dirname, "client/build/index.html")));

//Listen for requests on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log(`Running on port ${PORT}`)});