const puppeteer = require('puppeteer');
const fs = require('fs');

async function reactionTime(page){
    // const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null});
    // const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/reactiontime', {waitUntil: 'networkidle2'});

    // try {     /* clicks 'AGREE' on cookies first to get rid of the pop up */
    //     const selector = 'button.css-47sehv, span.css-47sehv';
    //     const agreeButton = await page.waitForSelector(selector, { timeout: 5000 });
    //     if (agreeButton) {
    //       console.log('Accepted cookies');
    //       await agreeButton.click();
    //     }
    //   } catch (error) {
    //     console.log('Cookies AGREE button not found:', error);
    //   }

      await page.click('div.css-1qvtbrk.e19owgy78');
      for (let i = 0; i < 5; i++) {
          const waitForClickMessageAndClick = async () => {
            await page.waitForFunction(() => {
              const element = document.querySelector('div.css-1qvtbrk.e19owgy78 div');
              return element && element.textContent.includes('Click!');
            }, { polling: 'mutation' }); 
        
            await page.click('div.css-1qvtbrk.e19owgy78');
            await page.click('div.css-1qvtbrk.e19owgy78');
          };
        
          await waitForClickMessageAndClick();

      }
      // await browser.close();
      const saveButtonSelector = 'button.css-qm6rs9.e19owgy710';
      await page.click(saveButtonSelector);
      const delay = time => new Promise(resolve => setTimeout(resolve, time));
      await delay(2500);
}

// reactionTime();

module.exports = { reactionTime };