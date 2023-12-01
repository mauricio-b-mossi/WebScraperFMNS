const puppeteer = require("puppeteer");

const link_attr = "data-cturl"

async function main(query) {

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto("https://www.butterfliesofamerica.com/US-Can-Cat.htm");

    await page.waitForSelector("input.gsc-input")

    await page.type("input.gsc-input", query)

    await page.click("button.gsc-search-button.gsc-search-button-v2")

    await page.waitForSelector("a.gs-title")

    console.log("She loaded.")

    let navigationUrl;

    try {
        navigationUrl= await page.$$eval("a.gs-title", els => {
            return new Promise((res, rej) => {
                for (let i = 0; i < els.length; i++) {
                    if (els[i].innerText.includes("thumbnails")) {
                        res(els[i].getAttribute("data-cturl"));
                        return;
                    }
                }
                rej(`Butterflies of America Error: No thumbnails found for ${query}.`)
            })
        })
    } catch(e) {
        throw e;
    }

    await page.goto(navigationUrl)

    await page.waitForSelector("a.y > img");

    await page.screenshot({path: "debug.png"})

    console.log("Finished waiting")

    const count = await page.$$eval("a.y > img", (els) => els.length)

    console.log(count)



};

main("Phocides pigmalion Mangrove Skipper");
