const fs = require("node:fs")

if (process.argv.length < 4) {
    throw new Error("Missing Arguments: \n1. Provide Input File Path.\n2. Provide Output Directory.\n3. Provide time buffer in ms between fetch requests. Default is 100ms.")
}

// Check how many files are currenly on the dir.
const DIRECTORY_DOES_NOT_EXIST = -4058

async function main() {

    let loadedFile;
    const FILE_PATH = process.argv[2]
    const DIRECTORY_PATH = process.argv[3]
    const TIME_BUFFER_MS = (process.argv.length == 5) ? Number(process.argv[4]) : 100;

    try {
        loadedFile = await fs.promises.readFile(FILE_PATH);
    } catch (err) {
        console.error("Error Loading Input File.\n")
        throw err;
    }
    try {
        const dir = await fs.promises.opendir(DIRECTORY_PATH)
    } catch (err) {
        if (err.errno != DIRECTORY_DOES_NOT_EXIST) {
            console.error("Error Loading Output Directory.\n")
            throw err;
        }
        const dir = await fs.promises.mkdir(DIRECTORY_PATH, { recursive: true })
        dir.normalize;
    }

    // Have a working Directory and loadedFile.
    let fileStream;

    try {
        fileStream = fs.createReadStream(FILE_PATH, { encoding: "utf8" });
    } catch (err) {
        console.error("Error Streaming Input.\n\n")
    }

    let fileString = await readableStreamToString(fileStream);

    const urls = fileString.split(",");

    let i = 0
    try {
        for (i; i < urls.length; i++) {
            await new Promise((res, _) => {
                setTimeout(res, TIME_BUFFER_MS)
            })
            fetch(urls[i])
                .then(res => res.blob())
                .then(blob => blob.arrayBuffer())
                .then(abuff => Buffer.from(abuff))
                .then(buff => fs.createWriteStream(`${DIRECTORY_PATH}/img_${i + 1}.jpg`).write(buff))
        }
    } catch (err) {
        console.log("\n\nFetches Sent: ", i);
        console.log("Fetches Remainng: ", urls.length - i, "\n\n");
        throw (err);
    }

    console.log("PROGRAM FINISHED DOWNLOADING IMAGES TO ", DIRECTORY_PATH);

}

main().catch(console.err)


function readableStreamToString(readableStream) {
    return new Promise((res, rej) => {
        let data = "";
        readableStream.on("data", function(chunk) {
            data += chunk;
        })
        readableStream.on("end", function() {
            res(data)
        })
        readableStream.on("error", function(err) {
            rej(err)
        })
    })
}
