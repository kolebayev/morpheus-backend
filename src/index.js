console.clear();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const Az = require("az");
const date = require("date-fns");

const port = 8000;

app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.post("/analyze", express.json(), (req, res) => {
  const data = req.body;
  const { post, NMbr, GNdr, messages } = data;
  const startDate = date.parseISO(data.startDate);
  const endDate = date.parseISO(data.endDate);
  let azData = [];
  for (let i = 0; i < messages.length; i++) {
    if (
      (date.parseISO(messages[i].date) > startDate) &
      (date.parseISO(messages[i].date) < endDate)
    ) {
      azData.push(messages[i].text);
    }
  }

  console.log(azData);

  Az.Morph.init(() => {
    let words = [];
    azData.forEach(async (word) => {
      let result = Az.Morph(word);

      let stat = [];
      if ((result[0] !== undefined) & (result.length !== 0)) {
        if (("tag" in result[0]) & (result[0].tag !== undefined)) {
          stat = result[0].tag.stat;
          console.log(result[0]);
          (stat.indexOf(post) > -1) &
            (stat.indexOf(NMbr) > -1) &
            (stat.indexOf(GNdr) > -1) && words.push(word);
        }
      }

      // console.log(word, typeof stat, stat);
    });

    // console.log(x[0].tag.stat);
    res.send({ lol: words });
    console.log("————————————————");
  });
  // console.log(messages.length);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}!`)
);
