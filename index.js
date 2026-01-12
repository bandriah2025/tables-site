const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.urlencoded({ extended: true }));

// قراءة CSV
const rows = fs.readFileSync("data.csv", "utf8").trim().split("\n");
const data = {};
rows.slice(1).forEach(r => {
  const [id, pdf] = r.split(",");
  data[id.trim()] = pdf.trim();
});

app.get("/", (req, res) => {
  res.send(`
    <h3>أدخل رقم الهوية</h3>
    <form method="POST">
      <input name="id" required />
      <button>عرض الجدول</button>
    </form>
  `);
});

app.post("/", (req, res) => {
  const pdf = data[req.body.id];
  if (!pdf) return res.send("رقم الهوية غير صحيح");
  res.sendFile(__dirname + "/" + pdf + ".pdf");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
