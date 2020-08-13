console.clear();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const Az = require("az");

const port = 8000;

app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.post("/analyze", express.json(), (req, res) => {
  const data = req.body;
  console.log(data.messages[0]);

  Az.Morph.init(function () {
    let data = Az.Morph("ракеты");
    console.log(data[0].tag);
  });

  res.send({ lol: "response" });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}!`)
);
