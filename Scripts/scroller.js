const puppeteer = require("puppeteer")

async function run(query) {
    // Set-up.
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto("https://www.inaturalist.org/")

    await page.type("input.form-control.ui-autocomplete-input", query)

    await page.waitForSelector("ul.ui-autocomplete.ui-front.ui-widget.ui-widget-content.ac-menu.open li.ac-result.ui-menu-item")

    await Promise.all([page.waitForNavigation(), page.click("li.ac-result.ui-menu-item")])
    console.log("Solved")

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
    console.log("Finished Scrolling")


}

run("Lion")
