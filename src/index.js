console.clear()

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const Az = require('az')
const date = require('date-fns')
const ruLocale = require('date-fns/locale/ru')

const port = 8000

app.use(cors())
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))

app.post('/analyze', express.json(), (req, res) => {
  const data = req.body
  const { post, NMbr, GNdr, filteredMessages } = data
  const wordsOptions = [post, NMbr, GNdr]

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

  // убирает пустые сообщения, фильтрует по датам
  let azData = [...messagesOneByOne]
    .filter((item) => {
      return item.text !== ''
    })
    .filter((item) => date.parseISO(item.date) >= startDate)
    .filter((item) => date.parseISO(item.date) <= endDate)

  Az.Morph.init(() => {
    // добавлет в объект сообщения результаты работы либы
    let withAnalyzeResult = azData.map((textAndDate, i) => {
      let azResult = Az.Morph(textAndDate.text)
      // i == 1 && console.log(Az.Morph(textAndDate.text).normalize())
      return {
        ...textAndDate,
        azResult:
          azResult.length !== 0
            ? [...azResult[0].tag.stat, ...azResult[0].tag.flex]
            : [],
        date: date.format(new Date(textAndDate.date), 'dd MMMM yyyy,  HH:mm', {
          locale: ruLocale,
        }),
      }
    })

    // фильтрует результат по данным запроса
    wordsOptions.forEach((option) => {
      withAnalyzeResult = [...withAnalyzeResult].filter((item) =>
        item.azResult.includes(option)
      )
    })

    res.send(
      withAnalyzeResult.length === 0
        ? { message: 'По указанным параметрам слов не нашлось ¯\\_(ツ)_/¯' }
        : { words: withAnalyzeResult }
    )
    console.log('————————————————')
  })
})

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}!`)
)
