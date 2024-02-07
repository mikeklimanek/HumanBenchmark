const puppeteer = require('puppeteer');
const fs = require('fs');

async function main(){
    const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null});
    const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/typing', {waitUntil: 'networkidle2'});

    try {     /* clicks 'AGREE' on cookies first to get rid of the pop up */
        const selector = 'button.css-47sehv, span.css-47sehv';
        const agreeButton = await page.waitForSelector(selector, { timeout: 5000 });
        if (agreeButton) {
          console.log('Accepted cookies');
          await agreeButton.click();
        }
      } catch (error) {
        console.log('Cookies AGREE button not found:', error);
      }


      await page.waitForSelector('span.incomplete');

      const textParts = await page.evaluate(() => {
          const spans = Array.from(document.querySelectorAll('span.incomplete'));
          return spans.map(span => span.textContent);
      });
  

      await page.click('.letters.notranslate');

      for (const part of textParts) {
          await page.keyboard.press(part, /*{delay: 120}*/); // uncomment delay if you want to simulate human speed
      }
}

main();
