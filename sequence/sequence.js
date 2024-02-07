const puppeteer = require('puppeteer');
const fs = require('fs');

async function main(){
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/sequence', {waitUntil: 'networkidle2'});

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
    
    async function detectActiveSquares(page) {
        let detectedSquares = [];
        let attempt = 0;
        let activeFound = false; 
        const delay = time => new Promise(resolve => setTimeout(resolve, time));
    
        
        while (true) {
            const activeSquares = await page.evaluate(() => {
                const squares = Array.from(document.querySelectorAll('.square'));
                return squares.map((square, index) => square.classList.contains('active') ? index : null).filter(index => index !== null);
            });
    
            if (activeSquares.length > 0) {
                activeFound = true;
                activeSquares.forEach(index => {
                    if (!detectedSquares.includes(index)) {
                        console.log(`Square ${index + 1} is active`);
                        detectedSquares.push(index);
                    }
                });
            } 
    
            await delay(200); 
            attempt++;
            if (attempt > 100) break; 
        }
    
        return detectedSquares;
    }

    
    console.log('Waiting for sequence to start...');
   
    const activeSquares = await detectActiveSquares(page);
    console.log('Active squares detected:', activeSquares.map(index => index + 1)); 
    

}

main();