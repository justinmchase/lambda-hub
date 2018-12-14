# lambda-hub
----

This supports invoking lambda functions via a simple REST api for local testing.

## Example
Here is an example of how to trigger a lambda function from an S3 event

```yml
# docker-compose.yml
version: "3"
services:
  # Local S3 instance
  s3rver:
    image: justinmchase/s3rver
    ports:
      - "4569:4569"
    links:
      - "hub"
    environment:
      SUBSCRIBE: "ObjectCreated:Put(http://subscriber:2354/example/index.handler)"

  hub:
    image: justinmchase/lambda-hub
    ports:
      - "2354:2354"
    volumes:
      - ".:/var/tasks"
```

```js
// index.js
exports.handler = function (event, context) {
  return new Promise((resolve, reject) => {
    console.log('Hello lambda!')
    console.log(event)
    resolve({ ok: true })
  })
}
```

```sh
# shell 1
$ docker-compose up
# ...
example_hub_1 | Hello lambda!
example_hub_1 | { Records: [ ... ] }
```
```sh
# shell 2
$ aws s3 mb example
$ aws s3 cp ./hello.txt s3://example/hello.txt --endpoint-url http://localhost:4569
```
or
```sh
$ curl http://localhost:2354/example/index.handler
```
