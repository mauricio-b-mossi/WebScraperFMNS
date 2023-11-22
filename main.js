const { error } = require("node:console")
const fs = require("node:fs")

fs.open(process.argv[2], "r", (err, fd) => {
    if (err) throw err
    fs.readFile(fd, (err, buff) => {
        if (err) throw err
        const data = buff.toString()
        let entries;
        if (data.indexOf("\n") == -1 && data.indexOf("\r\n") == -1) throw error("Invalid Input Data Format. Each entry must be separated by a new line.")
        if (data.indexOf("\r\n") != -1) {
            entries = data.split("\r\n");
        } else entries = data.split("\n");

    })
})
