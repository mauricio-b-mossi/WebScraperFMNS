const fs = require("node:fs")

console.log(process.argv)

if (false) {
    fs.readFile("hola", (err, data) => {
        if (err) throw err;
        const urls = data.toString().split(",");
        console.log(urls)
        for (let i = 0; i < urls.length; i++) {
            fetch(urls[i])
                .then(res => res.blob())
                .then(blob => blob.arrayBuffer())
                .then(abuff => Buffer.from(abuff))
                // Check if file has been created.
                .then(buff => fs.createWriteStream(`Lions/img_${i + 1}.jpg`).write(buff))
        }
    })
}
