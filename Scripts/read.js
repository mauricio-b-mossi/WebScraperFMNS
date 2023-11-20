const fs = require("node:fs")
const path = require("node:path")

fs.readFile("./out.csv", (err, data) => {
    if (err) throw err;
    const urls = data.toString().split(",");
    console.log(urls)
    for (let i = 0; i < urls.length; i++) {
        fetch(urls[i])
            .then(res => res.blob())
            .then(blob => blob.arrayBuffer())
            .then(abuff => Buffer.from(abuff))
            .then(buff => fs.createWriteStream(`Lions/img_${i + 1}${path.extname(urls[i])}`).write(buff))
    }
})
