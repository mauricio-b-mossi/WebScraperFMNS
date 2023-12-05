const puppeteer = require("puppeteer")
const fs = require("node:fs")

if (process.argv.length < 4) {
    throw new Error("Missing Arguments: \n1. Provide Query.\n2. Provide Output File.")
}

const QUERY_STRING = process.argv[2];
const OUTPUT_FILE = process.argv[3];


if (process.argv.at(process.argv.length - 1) == "-d") {
    DEBUG = true;
}

// Set flags.
async function main(query, outputFile, headless) {
    // Set-up.
    const browser = await puppeteer.launch({ headless: headless })
    const page = await browser.newPage()

    await page.goto("https://www.inaturalist.org/")

    await page.type("input.form-control.ui-autocomplete-input", query)

    await page.waitForSelector("ul.ui-autocomplete.ui-front.ui-widget.ui-widget-content.ac-menu.open li.ac-result.ui-menu-item")

    await page.$eval("li.ac-result.ui-menu-item", (el) => {
        el.click()
    })

    await page.waitForNavigation()

    const next_button = await page.$("li.pagination-next.ng-scope")

    let disabled = false;
    let round = 0;
    let count = 0;

    do {

        await page.evaluate(() => {
            return new Promise((res, _) => {
                (async () => {
                    let scroll = 0;
                    do {
                        scroll = window.scrollY;
                        window.scrollBy(0, window.innerHeight)
                        await new Promise((res, _) => {
                            setTimeout(res, 1000)
                        })
                    } while (window.scrollY > scroll)
                    res()
                })()
            })
        })

        let classNameString;
        if (next_button) {
            classNameString = await page.$eval("li.pagination-next.ng-scope", (it) => {
                return it.className
            })
        }

        disabled = classNameString.includes("disabled")

        const items = await page.$$eval("a.photo.has-photo", (els) => {
            return els.map((el) => el.style['background-image'])
        })

        // Extracting url and switching size to large.
        const urls = items.map(it => extractUrl(it, '"').replace(/(?<=\/)(medium|small)(?=\.)/, "large"));

        count += urls.length;

        fs.open(outputFile, "a", (err, fd) => {
            if (err) throw err;
            fs.appendFile(fd, Buffer.from(urls.toString()), (err) => {
                if (err) throw err;
                console.log("Finished Saving to File")
            })
        })

        if (next_button && !disabled) {
            const el = await page.$('a[ng-click="selectPage(page + 1, $event)"]')
            if (!el) {
                disabled = true
            } else {
                await page.evaluate(() => {
                    const item = document.querySelector('a[ng-click="selectPage(page + 1, $event)"]')
                    item.click()
                })
                await page.waitForSelector("li.pagination-next.ng-scope")
            }
        }

        round++;

    }
    while (next_button && !disabled);

    console.log("FINISHED EXECUTION OF NATURALIST SCRIPT.\n\nRetrieved: ", imgUrls.length, " urls.")

}

main(QUERY_STRING, OUTPUT_FILE, DEBUG)

function extractUrl(str, delimeter) {
    return str.slice(str.indexOf(delimeter) + delimeter.length, str.lastIndexOf(delimeter))
}
