function extractUrl(str, delimeter){
    return str.slice(str.indexOf(delimeter) + delimeter.length, str.lastIndexOf(delimeter))
}

module.exports = extractUrl;
