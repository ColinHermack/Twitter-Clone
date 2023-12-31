const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

//Connect to databse
const database = new sqlite3.Database('./database.db');

app.use(express.static(path.join(__dirname, 'client/build')));  //Serve static files from the build folder
app.use(bodyParser.urlencoded({ extended: false }));  //Use bodyParser for URL-encoded bodies
app.use(bodyParser.json());  //Use bodyParser for JSON-encoded bodies
app.use(cors(
    {origin: 'https://localhost:3000',
     optionsSuccessStatus: 200
    }
));  //Enable CORS for all routes

//Handle account creation
app.post("/api/create-account", function(req, res) {
    let exists = false;
    if (req.body.username === undefined || req.body.password == undefined) {
        res.json({ error: "Required field is undefined"});
    } else {
        //Check if the username is already taken and return an error message if so.
        database.get("SELECT * FROM Users WHERE username = ?", [req.body.username], (error, row) => {
            if (row) {
                res.json({ error: 'Username already taken.' });
                return;
            } else {
                //Otherwise, add the user
                bcrypt.hash(req.body.password, 8, (error, hash) => {
                    if (error) {
                        res.json({ error: "Could not hash password"});
                    } else {
                        database.run(`INSERT INTO Users VALUES('${req.body.username}', '${hash}', '${req.body.bio}', '${req.body.photo}');`);
                        res.json({
                            username: req.body.username,
                            profilePicture: req.body.photo,
                            posts: []
                        })
                    }
                })
            }
        });
    }
});

//Test API
app.get("/api/tester", function(req, res) {
    res.json({text: "This is a test of the API"})
})

//Handle all routes and return the main index.html file
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "client/build/index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log(`Running on port ${PORT}`)});