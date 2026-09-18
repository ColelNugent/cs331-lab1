const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3310;

app.use(express.urlencoded({ extended: false }));
app.use("/data", (req, res) => {
    res.status(404).send("Access Denied");
});

app.use(express.static(__dirname));

const dbPath = path.join(__dirname, "data", "pass.db");
const db = new Database(dbPath);

db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL, 
            question1 TEXT NOT NULL,
            question2 TEXT NOT NULL
        )
    `).run();

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const question1 = req.body.question1;
    const question2 = req.body.question2;

    if (!username || !password){
        return res.status(400).send("Username and password are required.");
    }

    if (!question1 || !question2){
        return res.status(400).send("Answering security question is required.");
    }

    try {
        const insertUser = db.prepare(`
            INSERT INTO users (username, password, question1, question2)
            VALUES (?, ?, ?, ?) 
        `);

        insertUser.run(username, password, question1, question2);

        res.redirect("/");
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE"){
            return res.status(409).send("Username already exists.");
        }

        console.error(error);
        res.status(500).send("Could not create account.");
    }
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password){
        return res.status(400).send("Username and password are required.")
    }

    const findUser = db.prepare(`
        SELECT id, username, password
        FROM users
        WHERE username = ?
    `);

    const user = findUser.get(username);

    if (!user || user.password !== password) {
        return res.status(401).send(
            "Incorrect username or password."
        );
    }

    res.redirect("/home.html");
});

app.post("/reset", (req, res) => {
    const username = req.body.username;
    const question1 = req.body.question1;
    const question2 = req.body.question2;
    const password = req.body.password;

    if (!question1 || !question2){
        return res.status(400).send("Answering security questions is required");
    }
    if (!username){
        return res.status(400).send("Username is required for password reset.");
    }
    if (!password){
        return res.status(400).send("Enter new password.");
    }

    const findUser = db.prepare(`
        SELECT id, username, question1, question2
        FROM users
        WHERE username = ?    
    `);

    const user = findUser.get(username);

    if (!user || user.question1 !== question1 || user.question2 !== question2){
        return res.status(401).send(
            "Incorrect username or incorrect responses to questions."
        );
    }

    const updatePassword = db.prepare(`
        UPDATE users
        SET password = ?
        WHERE id = ?
        `);

    const result = updatePassword.run(password, user.id);

    if (result.changes !== 1) {
        return res.status(500).send("Password could not be updated.");
    }

    res.redirect("/");
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
