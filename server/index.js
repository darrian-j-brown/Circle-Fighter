const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("src"));
app.use(express.static("images"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "../src") });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
