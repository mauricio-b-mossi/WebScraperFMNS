const fs = require("node:fs")

fs.readFile("out.csv", (err, data) => {
    const arr = data.toString().split(",")
    console.log(arr.length)
})
