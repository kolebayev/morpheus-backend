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
  const { post, NMbr, GNdr, filteredMessages } = data

  const startDate = date.parse(data.rangeStart, 'dd/MM/yyyy', new Date())
  const endDate = date.parse(data.rangeEnd, 'dd/MM/yyyy', new Date())
  // console.log(typeof startDate, startDate)

  // console.log(
  //   typeof date.parseISO(filteredMessages[0].date),
  //   date.parseISO(filteredMessages[0].date)
  // )
  console.log('filteredMessages', filteredMessages)
  // let azData = []
  // for (let i = 0; i < filteredMessages.length; i++) {
  //   if (
  //     (date.parseISO(filteredMessages[i].date) > startDate) &
  //     (date.parseISO(filteredMessages[i].date) < endDate)
  //   ) {
  //     azData.push(filteredMessages[i])
  //   }
  // }

  // console.log(azData.length)

  Az.Morph.init(() => {
    // let words = []
    // azData.forEach((word, index) => {
    //   let result = Az.Morph(word.text)
    //   if (result.length !== 0) {
    //     let arr = result[0].tag.stat
    //     let arr2 = result[0].tag.flex
    //     if (arr.includes(post) & arr.includes(GNdr) & arr2.includes(NMbr)) {
    //       words.push({
    //         text: word.text,
    //         date: date.format(new Date(word.date), 'dd MMMM yyyy,  HH:mm', {
    //           locale: locale.ru,
    //         }),
    //       })
    //     }
    //   }
    // })
    const words = ['response']
    res.send({ words })
    console.log('————————————————')
  })
})

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}!`)
)
