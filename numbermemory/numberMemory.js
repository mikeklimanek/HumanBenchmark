const puppeteer = require('puppeteer');
const fs = require('fs');

async function numberMemory(){
    const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null});
    const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/number-memory', {waitUntil: 'networkidle2'});

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
    
    const clickStartSelector = '.css-de05nr.e19owgy710'; 
    const clickStart = await page.waitForSelector(clickStartSelector, { timeout: 5000 });
    await clickStart.click();
    console.log('Start button clicked');

    
    for (let i = 0; i < 25; i++) {  // change the loop length in i < 25, but remember it will take longer to finish
                                    // since the more digits a number has, the longer it stays on the screen
        const savedNums = [];

        await page.waitForSelector('.big-number', {visible: true});
        const number = await page.$eval('.big-number', el => el.textContent);
        
        console.log('Number captured:', number);
        savedNums.push(number);


        await page.waitForSelector('input[type="text"][pattern="[0-9]*"]', {timeout: 60000}); 
        // yes, 60sec timeout is necessary, because numbers show longer and longer deppending on length of the number
        await page.evaluate(() => document.querySelector('input[type="text"][pattern="[0-9]*"]').value = '');
        await page.type('input[type="text"][pattern="[0-9]*"]', number); 
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
        await page.keyboard.press('Enter');
    }
   
}

numberMemory();

module.exports = { numberMemory };
