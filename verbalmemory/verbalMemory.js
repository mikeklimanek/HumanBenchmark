const puppeteer = require('puppeteer');
const fs = require('fs');

async function main(){
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/verbal-memory', {waitUntil: 'networkidle2'});

    try {
        const selector = 'button.css-47sehv, span.css-47sehv';
        const agreeButton = await page.waitForSelector(selector, { timeout: 5000 });
        if (agreeButton) {
          console.log('Found the AGREE button by class, clicking...');
          await agreeButton.click();
        }
      } catch (error) {
        console.log('AGREE button not found or not clicked in time:', error);
      }

      

}

main();
