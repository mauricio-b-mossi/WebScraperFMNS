const puppeteer = require("puppeteer")
const fs = require("node:fs")

async function main(query) {
    // Set-up.
    const browser = await puppeteer.launch({ headless: false })
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

    do {

        console.log("Round: ", round)

        if (next_button) {
            const classNameString = await page.$eval("li.pagination-next.ng-scope", (it) => {
                return it.className
            })

            disabled = classNameString.includes("disabled")

            console.log("Disabled: ", disabled)
        }
        await page.evaluate(() => {
            return new Promise((res, rej) => {
                (async () => {
                    let scroll = 0;
                    do {
                        scroll = window.scrollY;
                        window.scrollBy(0, window.innerHeight)
                        await new Promise((res, _) => {
                            setTimeout(res, 500)
                        })
                    } while (window.scrollY > scroll)
                    res()
                })()
            })
        })

        const items = await page.$$eval("a.photo.has-photo", (els) => {
            return els.map((el) => el.style['background-image'])
        })

        console.log(items)
        console.log(items.length)

        const urls = items.map(it => extractUrl(it, '"'))
        console.log(urls)

        fs.open("out.csv", "a", (err, fd) => {
            if (err) throw err;
            fs.appendFile(fd, Buffer.from(urls.toString()), (err) => {
                if (err) throw err;
                console.log("Finished Saving to File")
            })
        })

        console.log("Finished")

        if (next_button && !disabled) {
            console.log("Entered if")
            const el = await page.$('a[ng-click="selectPage(page + 1, $event)"]')
            if (!el) {
                console.log("Element somehow is null")
                disabled = true
            } else {
                console.log("Element not null")
                console.log("Gonna click element")
                await page.evaluate(() => {
                    const item = document.querySelector('a[ng-click="selectPage(page + 1, $event)"]')
                    item.click()
                })
                console.log("Element clicked")
                await page.waitForSelector("li.pagination-next.ng-scope")
                console.log("Navigation finished")
            }
        }

        round++;

    }
    while (next_button && !disabled);

    console.log("Finished the whole ass script")
}

main("Lion")

function extractUrl(str, delimeter) {
    return str.slice(str.indexOf(delimeter) + delimeter.length, str.lastIndexOf(delimeter))
}
