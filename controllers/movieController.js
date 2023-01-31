const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

exports.getSearchMovieForm = (req, res) => {
    res.render('search');
};

exports.getMovieResults = async (req, res) => {
    try {
        const url = req.query.searchTerm;
        // Setting headless to false will open a browser window
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        const data = await scrapeData(url, page);

        browser.close();

        res.render('results', { data });
    } catch (err) {
        throw err;
    }
};

const scrapeData = async (url, page) => {
    try {
        await page.goto(url, { waitUntil: 'load', timeout: 0 });
        const html = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(html);

        const title = $('h2 a').text();
        const releaseDate = $('h2 .release_date').text();
        const overview = $('.overview > p').text();
        const score = $('.user_score_chart').attr('data-percent');
        const imgUrl = $('.poster .lazyload')
            .attr('src')
            .replace('w300', 'w600')
            .replace('h450', 'h900');

        const castLength = $('.people .card').length;
        const cast = [];

        for (let i = 1; i <= castLength; i++) {
            const name = $(`.people .card:nth-child(${i}) p a`).text();
            const character = $(
                `.people .card:nth-child(${i}) .character`
            ).text();

            cast.push({ name, character });
        }

        console.log(cast);

        return {
            title,
            releaseDate,
            overview,
            score,
            imgUrl,
            cast,
        };
    } catch (err) {
        throw err;
    }
};
