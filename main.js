const fs = require("node:fs")
const child_process = require("child_process")
const { linesToArray } = require("./modules/inputProcessing.js")
const naturalist = require("./scripts/naturalist.js")

if (process.argv.length < 3) {
    throw Error("Missing Arguments: Please provide path to file containing entries to be scraped.\n")
}

if (process.argv[2] == "--help") {
    console.log("\nArguments and position:\n \n1. Path to input file.\n2. Path to output file.\n")
    return -1;
}

fs.open(process.argv[2], "r", (err, fd) => {
    if (err) throw err
    fs.readFile(fd, (err, buff) => {
        if (err) throw err
        const data = buff.toString()

        let entries = linesToArray(data);

        for (let query of entries) {
            naturalist(query, `out/${query}.csv`).catch(console.err)
        }

    })
})
