const express = require("express");
const cors = require("cors");
const { sql, getConnection } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is alive 🚀");
});

app.get("/attendees", async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM Attendees");

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }
});

app.post("/rsvp", async (req, res) => {
    const { visitorId, name } = req.body;

    try {
        const pool = await getConnection();

        await pool.request()
            .input("visitorId", sql.NVarChar, visitorId)
            .input("name", sql.NVarChar, name)
            .query(`
                IF EXISTS (SELECT 1 FROM Attendees WHERE visitorId = @visitorId)
                    UPDATE Attendees SET name = @name WHERE visitorId = @visitorId
                ELSE
                    INSERT INTO Attendees (visitorId, name)
                    VALUES (@visitorId, @name)
            `);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }
});

app.post("/rsvp/remove", async (req, res) => {
    const { visitorId } = req.body;

    try {
        const pool = await getConnection();

        await pool.request()
            .input("visitorId", sql.NVarChar, visitorId)
            .query("DELETE FROM Attendees WHERE visitorId = @visitorId");

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});