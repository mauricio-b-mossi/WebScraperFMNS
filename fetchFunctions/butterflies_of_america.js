const puppeteer = require("puppeteer");
const fs = require("node:fs/promises");

module.exports = async function main(query, outputFile, headless) {

    const link_attr = "data-cturl"

    const browser = await puppeteer.launch({ headless: headless })
    const page = await browser.newPage()

    await page.goto("https://www.butterfliesofamerica.com/US-Can-Cat.htm");

    await page.waitForSelector("input.gsc-input")

    await page.type("input.gsc-input", query)
        ,
        await page.click("button.gsc-search-button.gsc-search-button-v2")

    await page.waitForSelector("a.gs-title")

    // DO NOT MODIFY.
    let navigationUrl;

    try {
        navigationUrl = await page.$$eval("a.gs-title", els => {
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
    } catch (e) {
        throw e;
    }


    await page.goto(navigationUrl)

    await page.waitForSelector("a.y > img");

    // Constains the paths to all the image files.
    const paths = await page.$$eval("a.y", (els) => {
        return els.map(el => el.getAttribute("href"))
    })



    const currUrl = page.url()

    const imgUrls = [];

    for (let relPath of paths) {
        const url = new URL(relPath, currUrl);
        await page.goto(url.toString())
        const imgUrl = await page.$eval("a > img", (el) => {
            return el.src;
        })
        imgUrls.push(imgUrl.toString());
        await page.goBack();
    }

    // need to make file before opening.
    let fileDescriptor = await fs.open(outputFile, "w");
    await fs.appendFile(fileDescriptor, imgUrls.toString())

    console.log("FINISHED execution of BUTTERFLIES OF AMERICA script for ", query, ".\n\nRetrieved: ", imgUrls.length, " urls.")

    await browser.close()
};
