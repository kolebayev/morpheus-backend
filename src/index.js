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

  // удаляет ненужные ключи из каждого объекта сообщений
  const validKeys = ['date', 'text']
  filteredMessages.forEach((el) => {
    Object.keys(el).forEach((key) => validKeys.includes(key) || delete el[key])
  })

  // разбивает сообщения на слова и создает новый пословный массив объектов
  // очищает сообщения от знаков препинания и цифр, оставляет только русские буквы
  let messagesOneByOne = []
  filteredMessages.forEach((message) => {
    let words = message.text.split(' ')
    const leaveOnlyLetters = new RegExp(/[^а-яА-Я-]+/g)
    messagesOneByOne.push(
      ...words.map((word) => {
        return {
          date: message.date,
          text: word.replace(leaveOnlyLetters, ''),
        }
      })
    )
  })

  let clearedMessages = messagesOneByOne.filter((item) => {
    return item.text !== ''
  })

  // console.log(clearedMessages)

  let azData = []
  for (let i = 0; i < clearedMessages.length; i++) {
    if (
      (date.parseISO(clearedMessages[i].date) >= startDate) &
      (date.parseISO(clearedMessages[i].date) <= endDate)
    ) {
      azData.push(clearedMessages[i])
    }
  }

  console.log(azData.length)

  Az.Morph.init(() => {
    let words = []

    // выставляет условие проверки в соотвествие с переданными параметрами
    // если в UI выбрано "не важно" -> у параметра приходит null -> параметр не проверяется
    let condition = 'arr.includes(post)'
    ;(NMbr !== null) & (typeof NMbr === 'string') &&
      (condition = condition + ' & arr2.includes(NMbr)')
    ;(GNdr !== null) & (typeof GNdr === 'string') &&
      (condition = condition + ' & arr.includes(GNdr)')

    azData.forEach((word, index) => {
      let result = Az.Morph(word.text)
      if (result.length !== 0) {
        let arr = result[0].tag.stat
        let arr2 = result[0].tag.flex
        // if (arr.includes(post) & arr.includes(GNdr) & arr2.includes(NMbr)) {
        if (eval(condition)) {
          words.push({
            text: word.text.toLowerCase(),
            date: date.format(new Date(word.date), 'dd MMMM yyyy,  HH:mm', {
              locale: locale.ru,
            }),
          })
        }
      }
    })

    res.send(
      words.length === 0
        ? { message: 'По указанным параметрам слов не нашлось ¯\\_(ツ)_/¯' }
        : { words }
    )
    console.log('————————————————')
  })
})

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}!`)
)
