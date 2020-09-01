//Required files and modules assigned to a variable.
const fs = require('fs');
const path = require('path');
const db = require('../db/db.json')

//Main function with methods.
module.exports = function (app) {

    fs.readFile("db/db.json", "utf8", (err, data) => {

        if (err) throw err;

        var notes = JSON.parse(data);

        //These methods display the html's.
        app.get("/", function (req, res) {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

        app.get("/notes", function (req, res) {
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });

        //This method loads saved notes.
        app.get("/api/notes", function (req, res) {
            res.json(notes);
        });

        //This method will save notes.
        app.post("/api/notes", function (req, res) {
            var newNote = req.body
            let uniqueID = (notes.length).toString();
            newNote.id = uniqueID;
            notes.push(newNote);
            updateDb()
            res.json(notes)
            return console.log("Added note: " + newNote.title);
        });

        //This method will display a specific note in the saved notes area.
        app.get("/api/notes/:id", function (req, res) {
            res.json(notes[req.params.id]);
        });

        //This method will delete notes.
        app.delete("/api/notes/:id", function (req, res) {
            notes.splice(req.params.id, 1);
            updateDb();
            console.log("Deleted note with id " + req.params.id);
            res.json(notes)
        });

        //This function updates the main JSON file whenever any changes are made.
        function updateDb() {
            fs.writeFile("db/db.json", JSON.stringify(db, null), err => {
                if (err) throw err;
            });
        }
    });
};