const { error } = require("node:console")
const fs = require("node:fs")

if(process.argv.length < 3){
    console.log("\nFor help using tool use command --help.\n")
    console.log("Missing Arguments: Please provide path to file containing entries to be scraped.\n")
    return -1;
}

if(process.argv[2] == "--help"){
    console.log("\nArguments and position:\n \n1. Path to input file.\n2. Path to output file.\n")
    return 0;
}

fs.open(process.argv[2], "r", (err, fd) => {
    if (err) throw err
    fs.readFile(fd, (err, buff) => {
        if (err) throw err
        const data = buff.toString()

        // If succeeds entities[] contains all items to query.
        let entries;
        if (data.indexOf("\n") == -1 && data.indexOf("\r\n") == -1) throw error("Invalid Input Data Format. Each entry must be separated by a new line.")
        if (data.indexOf("\r\n") != -1) {
            entries = data.split("\r\n");
        } else entries = data.split("\n");

        // Read all scripts and call child process per each script Sync.

    })
})
