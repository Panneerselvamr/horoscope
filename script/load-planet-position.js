const puppeteer = require('puppeteer').default;
const fs = require('fs');

const houseIndexMapper = {
    12: 1,
    1: 2,
    2: 3,
    3: 4,
    11: 5,
    4: 7,
    10: 8,
    5: 9,
    9: 10,
    8: 11,
    7: 12,
    6: 13
}
const IndexToHouseMapper = Object.fromEntries(Object.entries(houseIndexMapper).map(a => a.reverse()))
const result = {
    updatedAt : Date.now(),
    transitionDayMap: {
        1: {
            box: 1,
            search: "sun"
        },
        2: {
            box: 3,
            search: "moon",

        },
        3: {
            box: 11,
            search: "mars"
        },
        4: {
            search: 'mercury',
            box: 12,
        },
        5: {
            search: 'jupiter',
            box: 1,
        },
        6: {
            search: 'venus',
            box: 12,
        },
        7: {
            search: 'saturn',
            box: 11,
        },
        9: {
            search: 'rahu',
            box: 12,
        },
        10: {
            search: 'kethu',
            box: 6,
        }
    },
    output: {}
}
setTimeout(async () => {
    const browser = await puppeteer.launch({
        args : ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://horoscope.hosuronline.com/rasi-chart-kattam.php');
    await page.waitForNetworkIdle();
    const table = await page.$('#chart-table');
    const data = await table.$$eval('td', tdElements => tdElements.map(td => td.innerText));
    Object.entries(houseIndexMapper).forEach(([house, index]) => {
        result.output[house] = data[index - 1];
    })

    Object.entries(result.transitionDayMap).forEach(([key, {search}]) => {
        const foundIndex = data.findIndex(item => item.toLowerCase().includes(search))
        result.transitionDayMap[key].box = IndexToHouseMapper[foundIndex + 1]
    })
    console.log(result);
    fs.writeFileSync('./script/planet-position.json', JSON.stringify(result, null, 2));
    process.exit(0)
})