console.clear()

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const Az = require('az')
const date = require('date-fns')
const locale = require('date-fns/locale')

const port = 8000

app.use(cors())
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))

app.post('/analyze', express.json(), (req, res) => {
  const data = req.body
  const { post, NMbr, GNdr, messages } = data
  console.log(post, NMbr, GNdr)
  const startDate = date.parseISO(data.startDate)
  const endDate = date.parseISO(data.endDate)
  let azData = []
  for (let i = 0; i < messages.length; i++) {
    if (
      (date.parseISO(messages[i].date) > startDate) &
      (date.parseISO(messages[i].date) < endDate)
    ) {
      azData.push(messages[i])
    }
  }

  console.log(azData.length)

  Az.Morph.init(() => {
    let words = []
    azData.forEach((word, index) => {
      let result = Az.Morph(word.text)
      if (result.length !== 0) {
        let arr = result[0].tag.stat
        let arr2 = result[0].tag.flex
        if (arr.includes(post) & arr.includes(GNdr) & arr2.includes(NMbr)) {
          words.push({
            text: word.text,
            date: date.format(new Date(word.date), 'dd MMMM yyyy,  HH:mm', {
              locale: locale.ru,
            }),
          })
        }
      }
    })

    res.send({ words })
    console.log('————————————————')
  })
})

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}!`)
)
