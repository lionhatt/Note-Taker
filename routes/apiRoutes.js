var path = require("path");
var uniqid = require('uniqid');

const fs = require("fs");
const util = require("util");
const { listeners } = require("process");

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

module.exports = function(app) {
    app.get("/api/notes", function(req, res) {
        res.sendFile(path.join(__dirname, "../db/db.json"));
    });

    app.post("/api/notes", async function(req,res) {
        try {
            const db = await readFileAsync("./db/db.json", "utf-8");
            
            const id = uniqid.time();
            req.body.id = id;
            
            const notes = JSON.parse(db);
            notes.push(req.body);

            await writeFileAsync("./db/db.json", JSON.stringify(notes, null, 2));
            res.json(req.body);
   
        } catch (err) {
            console.log(err);
        }
    });

    app.delete("api/notes/:id", async function(req, res) {
        try {
            const db = await readFileAsync("./db/db.json", "utf-8");
            const id = req.params.id;
            
            const notes = JSON.parse(db);
            notes.forEach(element => {
                if (element.id === id) {
                    notes.splice(notes.indexOf(element), 1);
                    return;
                }
            });

            await writeFileAsync("./db/db.json", JSON.stringify(notes, null, 2));
            res.json(req.body);

        } catch (err) {
            console.log(err);
        }

    })
}

