// this test was used to inspect the page that had short times showing the numbers
// therefore wasn't able to be inspected in browser as the content changed quickly


const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});
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
  await page.waitForTimeout(1000); 

  const pageContent = await page.content();
  require('fs').writeFileSync('pageContent.html', pageContent);

  await browser.close();
})();


