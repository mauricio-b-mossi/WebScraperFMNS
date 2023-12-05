const main = require("../fetchFunctions/butterflies_of_america.js")

if (process.argv.length < 4) {
    throw new Error("Missing Arguments: \n1. Provide Query.\n2. Provide Output File.")
}

const QUERY_STRING = process.argv[2];
const OUTPUT_FILE = process.argv[3];


let DEBUG = false;

if (process.argv.at(process.argv.length - 1) == "-d") {
    DEBUG = true;
}

main(QUERY_STRING, OUTPUT_FILE, DEBUG).catch(console.err);
