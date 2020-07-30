const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const port = 8000;

const TEXTERRA_API_KEY = "f25971321036fd1cc0fa627954b37af2f6870e95";
const testString =
  "Our kids should grow up in an America where opportunity is real.";

app.use(cors());

app.post("/", (req, res) => {
  const getT = async () => {
    try {
      const postRes = await axios.post(
        "http://api.ispras.ru/texterra/v1/nlp?targetType=named-entity&apikey=" +
          TEXTERRA_API_KEY,
        [{ text: testString }]
      );
      console.log(postRes.data);
      res.send(postRes.data);
    } catch (err) {
      console.error(err);
    }
  };
  getT();
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}!`)
);
