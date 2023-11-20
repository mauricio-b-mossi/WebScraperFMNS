const puppeteer = require("puppeteer")
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
                    setTimeout(res, 500)
                })
            } while (window.scrollY > scroll)
        })()
    })

    await new Promise((res, _) => {
        setTimeout(res, 8000)
    }) 


    const items = await page.$$eval("a.photo.has-photo", (els) => {
        return els.map((el) => el.style['background-image'])
    })

    console.log(items)
    console.log(items.length)

    const urls = items.map(it => extractUrl(it, '"'))
    console.log(urls)

    fs.open("out.csv", "w", (err, fd) => {
        fs.appendFile(fd, Buffer.from(urls.toString()), (err) => {
            if(err) throw err;
            console.log("Finished")
        })
    })

    console.log("Finished")

}

main("Lion")

function extractUrl(str, delimeter){
    return str.slice(str.indexOf(delimeter) + delimeter.length, str.lastIndexOf(delimeter))
}
