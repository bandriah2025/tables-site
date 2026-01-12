const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));

// قراءة CSV
const rows = fs.readFileSync("data.csv", "utf8").trim().split("\n");
const data = {};
rows.slice(1).forEach(r => {
  const [id, pdf] = r.split(",");
  data[id.trim()] = pdf.trim();
});

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.send(`
    <h2>عرض الجدول</h2>
    <form method="POST">
      <input name="id" placeholder="رقم الهوية" required />
      <button type="submit">عرض الجدول</button>
    </form>
  `);
});

// استقبال الهوية
app.post("/", (req, res) => {
  const pdf = data[req.body.id];
  if (!pdf) {
    return res.send("<h3>رقم الهوية غير صحيح</h3>");
  }
  res.sendFile(path.join(__dirname, pdf + ".pdf"));
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
