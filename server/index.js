const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.static('images'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../public') });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})