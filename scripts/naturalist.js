const main = require("../fetchFunctions/naturalist.js")

if (process.argv.length < 4) {
    throw new Error("Missing Arguments: \n1. Provide Query.\n2. Provide Output File.")
}

const QUERY_STRING = process.argv[2];
const OUTPUT_FILE = process.argv[3];

const DEBUG = process.argv.at(process.argv.length - 1) == "-d"

main(QUERY_STRING, OUTPUT_FILE, DEBUG).catch(console.err);
