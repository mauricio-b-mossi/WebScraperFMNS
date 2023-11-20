const fs = require("node:fs")

const url = "https://inaturalist-open-data.s3.amazonaws.com/photos/335965075/medium.jpeg"

fetch(url)
    .then(res => res.blob())
    .then(blob => blob.arrayBuffer())
    .then(buff => Buffer.from(buff))
    .then(buff => fs.createWriteStream("img.png").write(buff))
