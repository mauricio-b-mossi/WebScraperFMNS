const { error } = require("node:console")
const fs = require("node:fs")
const { linesToArray } = require("./modules/inputProcessing.js")

if (process.argv.length < 3) {
    throw Error("\nFor help using tool use command --help.\nMissing Arguments: Please provide path to file containing entries to be scraped.\n")
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

        // If succeeds entities[] contains all items to query.
        let entries = linesToArray(data);
        // Read all scripts and call child process per each script Sync.

    })
})
