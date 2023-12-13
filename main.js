const fs = require("node:fs")
const path = require("node:path")
const child_process = require("child_process")
const { linesToArray } = require("./modules/inputProcessing.js")

const scraper = require("./fetchFunctions/butterflies_of_america.js")

if (process.argv.length < 4) {
    throw Error("Missing Arguments: Provide INPUT FILE and OUTPUT DIRECTORY\n")
}

const INPUT = process.argv[2]
const OUTPUT = process.argv[3]


async function main(input, output) {

    const DIRECTORY_PATH = output;
    console.log(DIRECTORY_PATH);
    if (path.extname(DIRECTORY_PATH) != "") {
        new Error("Invalid Argument: Provide output DIRECTORY not FILE.")
    }

    const DIRECTORY_DOES_NOT_EXIST = -4058

    try {
        await fs.promises.access(DIRECTORY_PATH)
    } catch (err) {
        if (err.errno != DIRECTORY_DOES_NOT_EXIST) {
            console.error("Error Loading Output Directory.\n")
        }
        console.log("Creating output directory");
        await fs.promises.mkdir(dirUrl, { recursive: true })
    }
    fs.open(input, "r", (err, fd) => {

        if (err) throw err

        fs.readFile(fd, (err, buff) => {
            if (err) throw err
            const data = buff.toString()

            let entries = linesToArray(data);

            for (let query of entries) {
                (async function() {
                    await scraper(query, `${DIRECTORY_PATH}/${query}.csv`, false).catch(console.err);
                })()
            }
        })
    })
}

main(INPUT, OUTPUT);

