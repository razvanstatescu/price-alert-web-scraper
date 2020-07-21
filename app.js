/**
 * YouTube: https://youtube.com/TheDevGuy
 * Instagram: https://www.instagram.com/the.dev.guy/
 */
const puppeteer = require('puppeteer');
const sgMail = require('@sendgrid/mail');
const fs = require('fs').promises;
const {API_KEY, EMAIL, FROM} = require('./credentials');
sgMail.setApiKey(API_KEY);

(async () => {
    // Load products url and price threshold
    const urlList = JSON.parse(await fs.readFile('./products.json', {encoding: 'utf8'}));
    // List of products that are below the threshold and will be send in the email
    const productsToSend = [];

    // Do web scraping for every product in products.json and get the price
    for await (let product of urlList.map(e => getPrice(e))) {
        // If the price is below the threshold add it to the array
        if (product.price < product.limitPrice) {
            productsToSend.push(product);
        }
    }

    // If there are not products to email end the script
    if (!productsToSend.length) {
        console.log('No products to send!');
        return;
    }

    // Send products to email
    try {
        await sendEmail(productsToSend);
        console.log(`Sent ${productsToSend.length} products to your email.`);
    } catch (e) {
        console.log('Email error', e);
    }
})();

/**
 * Scrape product page and get the price
 * @param product
 * @return {Promise<{limitPrice: number, pageTitle: string, price: number, priceText: UnwrapPromiseLike<EvaluateFnReturnType<function(*): string>>, url: *}>}
 */
async function getPrice(product) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(product.url);

    // Get product page title
    const pageTitle = await page.title();
    const priceElement = await page.$('#priceblock_ourprice');
    // Get product price string
    const priceText = await page.evaluate(e => e.textContent, priceElement);

    await browser.close();

    // Convert the price string to a float
    const price = parseFloat(priceText.replace(',', '').match(/(\d+)\.(\d+)/)[0]);
    return {
        pageTitle,
        price,
        limitPrice: product.price,
        priceText,
        url: product.url
    };
}

/**
 * Send products to email using Sendgrid
 * @param products
 * @return {Promise<void>}
 */
async function sendEmail(products) {
    // Create a HTML string that contains all products that must be send
    let msgToSend = '';
    products.forEach(product => {
        msgToSend += `<a href="${product.url}">${product.pageTitle}</a> is now just <b>${product.priceText}</b>`;
    });

    // Create message object required by Sendgrid
    const msg = {
        to: EMAIL,
        from: FROM,
        subject: 'Demo YT - Price Update',
        html: msgToSend
    };

    // Send email using Sendgrid
    await sgMail.send(msg);
}
