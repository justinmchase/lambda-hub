const os = require('os')
const express = require('express')
const bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.all('/:func/:handler', async (req, res) => {
  const { params: { func, handler } } = req
  const [file, name] = handler.split('.')
  
  function complete(err, result) {
    if (err) {
      const { message, name, stack } = err
      res.status(500)
      res.send({ message, name, stack: stack.split('\n').map(ln => ln.trim()) })
    } else {
      res.status(200)
      res.send(result || { ok: true })
    }
    res.end()
  }

  try {
    const λ = require(`/var/tasks/${func}/${file}`)
    const fn = λ[name]
    if (!fn) return complete(new Error(`${handler} is not a valid λ function`))

    const context = {}
    const promise = fn(req.body, context, complete)
    if (promise) {
      promise
        .then(res => complete(null, res))
        .catch(err => complete(err))
    }
  } catch (err) {
    complete(err)
  }
})
const port = process.env.PORT || 2354
app.listen(port)

function exit (err, code) {
  if (err) console.error(err)
  if (code != null) console.log(`exiting with code ${code}`)
  process.exit()
}

process.on('exit', code => exit(null, code));
process.on('SIGINT', () => exit(null))
process.on('SIGTERM', () => exit(null))
process.on('uncaughtException', err => exit(err))
console.log(`now listening on host ${os.hostname()} and port ${port}`)
