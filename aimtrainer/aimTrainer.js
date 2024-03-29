const puppeteer = require('puppeteer');
const fs = require('fs');

async function aimTrainer(page){
    // const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null});
    // const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/aim', {waitUntil: 'networkidle2'});
    
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

      await page.click('.css-z6vxiy.e6yfngs3', {delay: 1000});
      for (let i = 0; i < 30; i++) {
          const waitForClickMessageAndClick = async () => {

            await page.click('.css-ad1j3y.e6yfngs2');
          };
        
          await waitForClickMessageAndClick();
          
      }
      const saveButtonSelector = 'button.css-qm6rs9.e19owgy710';
      await page.click(saveButtonSelector);
      const delay = time => new Promise(resolve => setTimeout(resolve, time));
      await delay(2500);
      // await browser.close();
      
}

// aimTrainer();

module.exports = { aimTrainer };