exports.handler = function (event, context) {
  return new Promise((resolve, reject) => {
    console.log("hello handler!")
    resolve({ ok: true })
  })
}
