const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
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
  
  const clickStartSelector = '.css-z6vxiy.e6yfngs3'; 
  const clickStart = await page.waitForSelector(clickStartSelector, { timeout: 5000 });
  await clickStart.click();
  console.log('Start button clicked');
  function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

// Usage example
await delay(1500);

  const pageContent = await page.content({ timeout: 2000});
  require('fs').writeFileSync('pageContent.html', pageContent);

  await browser.close();
})();


