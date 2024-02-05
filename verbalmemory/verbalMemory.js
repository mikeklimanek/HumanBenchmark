const puppeteer = require('puppeteer');
const fs = require('fs');

async function main(){
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/verbal-memory', {waitUntil: 'networkidle2'});

    try {     /* click AGREE on cookies first to get rid of the pop up */
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

    const seenWords = new Set();
    for (let i = 0; i < 80; i++) {
        async function checkWord(elementHandle) {
            const word = await elementHandle.evaluate(el => el.textContent);
            const [newButton] = await page.$x("//button[contains(@class, 'css-de05nr') and contains(@class, 'e19owgy710') and contains(text(), 'NEW')]");
            const [seenButton] = await page.$x("//button[contains(@class, 'css-de05nr') and contains(@class, 'e19owgy710') and contains(text(), 'SEEN')]");
    
            if (seenWords.has(word)) {
                console.log('Word already seen:', word);
                await seenButton.click();
            } else {
                seenWords.add(word);
                console.log('Word added to set:', word);
                await newButton.click();
            }
        }
    
        const wordElement = await page.$('.word'); 
        if (wordElement) {
            await checkWord(wordElement); 
        } else {
            console.log('No word element found.');
        }
        
    }

    
      

}

main();
