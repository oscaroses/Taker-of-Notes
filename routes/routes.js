const fs = require('fs');
const path = require('path');

module.exports = function (app) {

    fs.readFile("db/db.json", "utf8", (err, data) => {

        if (err) throw err;

        var notes = JSON.parse(data);

        app.get("/", function (req, res) {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

        app.get("/notes", function (req, res) {
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });

        app.get("/api/notes", function (req, res) {
            res.json(notes);
        });

        app.post("/api/notes", function (req, res) {
            var newNote = req.body
            let uniqueID = (notes.length).toString();
            newNote.id = uniqueID;
            notes.push(newNote);
            updateDb()
            console.log(newNote)
            return console.log("Added note: " + newNote.title);
        });

        app.post("/api/clear", function (req, res) {
            notes.length = 0;
            res.json({ ok: true });
        });

        app.get("/api/notes/:id", function (req, res) {
            res.json(notes[req.params.id]);
        });

        app.delete("/api/notes/:id", function (req, res) {
            notes.splice(req.params.id, 1);
            updateDb();
            console.log("Deleted note with id " + req.params.id);
        });

        function updateDb() {
            fs.writeFile("db/db.json", JSON.stringify(db, null), err => {
                if (err) throw err;
            });
        }
    });
};