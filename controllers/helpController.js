const db = require("../config/db");

exports.sendHelp = (req, res) => {
  const { name, email, message } = req.body;

  db.query(
    "INSERT INTO help_messages (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
    (err) => {
      if (err) throw err;
      res.json({ status: true, message: "Pesan bantuan terkirim" });
    }
  );
};

exports.getHelpMessages = (req, res) => {
  db.query("SELECT * FROM help_messages ORDER BY created_at DESC", (err, result) => {
    res.json(result);
  });
};
