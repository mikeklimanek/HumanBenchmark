const puppeteer = require('puppeteer');
const fs = require('fs');

async function getCurrentLevel(page) {
    return page.evaluate(() => {
        const levelSpan = document.querySelector('span.css-yuq7ce + span');
        return levelSpan ? parseInt(levelSpan.textContent, 10) : null;
    });
}

async function detectActiveSquaresByLevel(page, maxLevel = 25) {
    let sequences = {};
    for (let level = 1; level <= maxLevel; level++) {
        console.log(`****************************************`);
        console.log(`***Detecting sequence for Level ${level}...***`);
        console.log(`****************************************`);
        sequences[level] = [];

        
        await new Promise(resolve => setTimeout(resolve)); 

        let sequenceDetected = false;
        let previousIndex = null;
        
        while (!sequenceDetected) {
            const activeIndex = await page.evaluate(() => {
                const activeSquare = Array.from(document.querySelectorAll('.square')).findIndex(square => square.classList.contains('active'));
                return activeSquare;
            });
            
            if (activeIndex !== -1 && activeIndex !== previousIndex) {
                sequences[level].push(activeIndex + 1); 
                console.log(`Level ${level}: Square ${activeIndex + 1} is active`);
                previousIndex = activeIndex;
            } else if (activeIndex === -1 && sequences[level].length > 0) {
                sequenceDetected = true;
            }
            
            await new Promise(resolve => setTimeout(resolve, 200)); 
        }

        for (const index of sequences[level]) {

            const row = Math.floor((index - 1) / 3); 
            const col = (index - 1) % 3;
            
            const selector = `.square-row:nth-of-type(${row + 1}) .square:nth-of-type(${col + 1})`;
            await page.click(selector, { delay: 50 });
            console.log(`Clicked on square in row ${row + 1}, column ${col + 1}`);
        }


        await new Promise(resolve => setTimeout(resolve)); 
    }

    return sequences;
}





async function main() {
    const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null});
    const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/memory', { waitUntil: 'networkidle2' });

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

    console.log('Waiting for sequence to start...');
    const delay = time => new Promise(resolve => setTimeout(resolve, time));
    await delay(500);
    const levelActive = await getCurrentLevel(page);
    const levelActiveSquares = await detectActiveSquaresByLevel(page);
    console.log('Detection completed:', levelActiveSquares, levelActive);


}

main();
