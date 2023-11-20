const puppeteer = require("puppeteer")
const extractUrl = require("./url_utlis.js")
const scroller = require("./scroller.js")
const fs = require("node:fs")

// Check for paramters.

async function main(query) {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto("https://www.inaturalist.org/")

    await page.type("input.form-control.ui-autocomplete-input", query)

    await page.waitForSelector("ul.ui-autocomplete.ui-front.ui-widget.ui-widget-content.ac-menu.open li.ac-result.ui-menu-item")
    await page.$eval("li.ac-result.ui-menu-item", (el) => {
        el.click()
    })
    console.log("Clicked")
    await page.waitForNavigation()
    console.log("Navigated")
    await page.waitForSelector("div.thumbnail.borderless.d-flex.flex-column")
    console.log("Waited for Selector")

    await page.evaluate(() => {
        (async () => {
            let scroll = 0;
            do {
                scroll = window.scrollY;
                window.scrollBy(0, window.innerHeight)
                await new Promise((res, _) => {
                    setTimeout(res, 1000)
                })
            } while (window.scrollY > scroll)
        })()
    })

    console.log(items)
    console.log(items.length)
    console.log("Finished")

}

main("Lion")
