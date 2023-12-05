// Accepts a string of new-line separated entries. Returns array of strings.
function linesToArray(data) {
    if (data.indexOf("\n") == -1 && data.indexOf("\r\n") == -1) throw error("Invalid Input Data Format. Each entry must be separated by a new line.")
    if (data.indexOf("\r\n") != -1) {
        return data.split("\r\n");
    } else return data.split("\n");
}

module.exports = {
    linesToArray
}

